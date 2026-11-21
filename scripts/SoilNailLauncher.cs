using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Diagnostics;
using System.Threading;
using System.Collections.Generic;
using System.Reflection;
using System.IO.Compression;

namespace SoilNailDesignSuite
{
    public class Program
    {
        private static TcpListener _tcpListener;
        private static int _port;
        private static volatile bool _running = true;
        private static volatile bool _seenHeartbeat = false;
        private static DateTime _lastActivity = DateTime.UtcNow;
        private static DateTime _startTime = DateTime.UtcNow;
        private static readonly Dictionary<string, byte[]> _memoryFiles = new Dictionary<string, byte[]>(StringComparer.OrdinalIgnoreCase);

        [System.Runtime.InteropServices.DllImport("user32.dll", EntryPoint = "MessageBoxW", CharSet = System.Runtime.InteropServices.CharSet.Unicode)]
        private static extern int ShowNativeBox(IntPtr hWnd, string text, string caption, uint type);

        private static void ShowError(string message, string caption)
        {
            try { ShowNativeBox(IntPtr.Zero, message, caption, 0x10); }
            catch { Console.WriteLine(caption + ": " + message); }
        }

        private static void ShowWarning(string message, string caption)
        {
            try { ShowNativeBox(IntPtr.Zero, message, caption, 0x30); }
            catch { Console.WriteLine(caption + ": " + message); }
        }

        [STAThread]
        public static int Main(string[] args)
        {
            _startTime = DateTime.UtcNow;
            _lastActivity = DateTime.UtcNow;

            bool loaded = LoadEmbeddedBundle();
            if (!loaded)
            {
                string exeDir = AppDomain.CurrentDomain.BaseDirectory;
                string webRoot = LocateWebRoot(exeDir);
                if (webRoot != null && File.Exists(Path.Combine(webRoot, "index.html")))
                {
                    LoadDiskFiles(webRoot);
                    loaded = _memoryFiles.ContainsKey("index.html");
                }
            }

            if (!loaded || !_memoryFiles.ContainsKey("index.html"))
            {
                ShowError(
                    "Application assets could not be extracted from the executable.\n\nPlease ensure SoilNailDesignSuite1.0.exe is intact and not corrupted.",
                    "Soil Nail Design Suite 1.0 - Startup Error"
                );
                return 1;
            }

            try
            {
                _tcpListener = new TcpListener(IPAddress.Loopback, 0);
                _tcpListener.Start();
                _port = ((IPEndPoint)_tcpListener.LocalEndpoint).Port;

                Thread serverThread = new Thread(ListenLoop);
                serverThread.IsBackground = true;
                serverThread.Start();
            }
            catch (Exception ex)
            {
                ShowError(
                    "Failed to bind local application port:\n\n" + ex.Message + "\n\nPlease ensure loopback networking (127.0.0.1) is permitted.",
                    "Soil Nail Design Suite 1.0 - Network Error"
                );
                return 1;
            }

            string appUrl = "http://127.0.0.1:" + _port + "/";
            LaunchBrowser(appUrl);

            while (_running)
            {
                Thread.Sleep(1000);
                if (_seenHeartbeat && (DateTime.UtcNow - _startTime).TotalSeconds > 35)
                {
                    if ((DateTime.UtcNow - _lastActivity).TotalSeconds > 20)
                    {
                        break;
                    }
                }
            }

            _running = false;
            try { _tcpListener.Stop(); } catch { }
            return 0;
        }

        private static bool LoadEmbeddedBundle()
        {
            try
            {
                Assembly asm = Assembly.GetExecutingAssembly();
                using (Stream resStream = asm.GetManifestResourceStream("SoilNailAssets"))
                {
                    if (resStream == null) return false;
                    using (BinaryReader reader = new BinaryReader(resStream, Encoding.UTF8))
                    {
                        byte[] magic = reader.ReadBytes(4);
                        if (Encoding.ASCII.GetString(magic) != "SNDA") return false;
                        int version = reader.ReadInt32();
                        int fileCount = reader.ReadInt32();
                        if (version != 1 || fileCount <= 0) return false;

                        for (int i = 0; i < fileCount; i++)
                        {
                            ushort pathLen = reader.ReadUInt16();
                            byte[] pathBytes = reader.ReadBytes(pathLen);
                            string relPath = Encoding.UTF8.GetString(pathBytes).Replace('\\', '/');
                            uint rawSize = reader.ReadUInt32();
                            uint compSize = reader.ReadUInt32();
                            byte[] compData = reader.ReadBytes((int)compSize);

                            byte[] rawData = new byte[rawSize];
                            using (MemoryStream ms = new MemoryStream(compData))
                            using (DeflateStream ds = new DeflateStream(ms, CompressionMode.Decompress))
                            {
                                int totalRead = 0;
                                while (totalRead < (int)rawSize)
                                {
                                    int read = ds.Read(rawData, totalRead, (int)rawSize - totalRead);
                                    if (read <= 0) break;
                                    totalRead += read;
                                }
                            }
                            _memoryFiles[relPath] = rawData;
                        }
                        return _memoryFiles.ContainsKey("index.html");
                    }
                }
            }
            catch
            {
                return false;
            }
        }

        private static string LocateWebRoot(string exeDir)
        {
            string[] candidates = new string[]
            {
                Path.Combine(exeDir, "dist"),
                exeDir,
                Path.GetFullPath(Path.Combine(exeDir, "..\\dist")),
                Path.GetFullPath(Path.Combine(exeDir, "..\\resources\\dist"))
            };
            foreach (string c in candidates)
            {
                if (Directory.Exists(c) && File.Exists(Path.Combine(c, "index.html"))) return c;
            }
            return null;
        }

        private static void LoadDiskFiles(string root)
        {
            foreach (string file in Directory.GetFiles(root, "*", SearchOption.AllDirectories))
            {
                string rel = file.Substring(root.Length).TrimStart('\\', '/').Replace('\\', '/');
                _memoryFiles[rel] = File.ReadAllBytes(file);
            }
        }

        private static void ListenLoop()
        {
            while (_running)
            {
                try
                {
                    TcpClient client = _tcpListener.AcceptTcpClient();
                    ThreadPool.QueueUserWorkItem(HandleClient, client);
                }
                catch
                {
                    if (!_running) break;
                }
            }
        }

        private static void HandleClient(object state)
        {
            TcpClient client = (TcpClient)state;
            client.NoDelay = true;
            try
            {
                using (NetworkStream stream = client.GetStream())
                {
                    byte[] buffer = new byte[8192];
                    int bytesRead = stream.Read(buffer, 0, buffer.Length);
                    if (bytesRead <= 0) return;

                    string requestText = Encoding.ASCII.GetString(buffer, 0, bytesRead);
                    string[] lines = requestText.Split(new string[] { "\r\n" }, StringSplitOptions.None);
                    if (lines.Length == 0) return;

                    string[] parts = lines[0].Split(' ');
                    if (parts.Length < 2) return;

                    string rawUrl = parts[1];
                    _lastActivity = DateTime.UtcNow;

                    int qIdx = rawUrl.IndexOf('?');
                    if (qIdx >= 0) rawUrl = rawUrl.Substring(0, qIdx);
                    string cleanPath = rawUrl.TrimStart('/');
                    if (string.IsNullOrEmpty(cleanPath)) cleanPath = "index.html";

                    if (cleanPath.Equals("api/ping", StringComparison.OrdinalIgnoreCase))
                    {
                        _seenHeartbeat = true;
                        byte[] ok = Encoding.ASCII.GetBytes("HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: 2\r\nConnection: close\r\n\r\nOK");
                        stream.Write(ok, 0, ok.Length);
                        return;
                    }

                    if (cleanPath.Equals("api/shutdown", StringComparison.OrdinalIgnoreCase))
                    {
                        byte[] bye = Encoding.ASCII.GetBytes("HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: 2\r\nConnection: close\r\n\r\nOK");
                        stream.Write(bye, 0, bye.Length);
                        new Thread(() => { Thread.Sleep(800); _running = false; }).Start();
                        return;
                    }

                    byte[] data = null;
                    if (!_memoryFiles.TryGetValue(cleanPath, out data))
                    {
                        string alt = cleanPath.Replace('/', '\\');
                        if (!_memoryFiles.TryGetValue(alt, out data))
                        {
                            if (!Path.HasExtension(cleanPath))
                            {
                                _memoryFiles.TryGetValue("index.html", out data);
                            }
                        }
                    }

                    if (data != null)
                    {
                        string mime = GetMimeType(cleanPath);
                        string header = string.Format(
                            "HTTP/1.1 200 OK\r\nContent-Type: {0}\r\nContent-Length: {1}\r\nCache-Control: no-cache\r\nAccess-Control-Allow-Origin: *\r\nConnection: close\r\n\r\n",
                            mime, data.Length
                        );
                        byte[] hBytes = Encoding.ASCII.GetBytes(header);
                        stream.Write(hBytes, 0, hBytes.Length);
                        stream.Write(data, 0, data.Length);
                    }
                    else
                    {
                        byte[] notFound = Encoding.ASCII.GetBytes("HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\nContent-Length: 9\r\nConnection: close\r\n\r\nNot Found");
                        stream.Write(notFound, 0, notFound.Length);
                    }
                }
            }
            catch { }
            finally
            {
                try { client.Close(); } catch { }
            }
        }

        private static void LaunchBrowser(string url)
        {
            string profileDir = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "SoilNailDesignSuite1.0", "Profile"
            );
            try { if (!Directory.Exists(profileDir)) Directory.CreateDirectory(profileDir); } catch { }

            string[] edgePaths = new string[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Microsoft\\Edge\\Application\\msedge.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Microsoft\\Edge\\Application\\msedge.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Microsoft\\Edge\\Application\\msedge.exe")
            };
            foreach (string edge in edgePaths)
            {
                if (File.Exists(edge))
                {
                    try
                    {
                        ProcessStartInfo psi = new ProcessStartInfo();
                        psi.FileName = edge;
                        psi.Arguments = string.Format("--app=\"{0}\" --window-size=1360,880 --user-data-dir=\"{1}\" --no-first-run --no-default-browser-check", url, profileDir);
                        psi.UseShellExecute = false;
                        Process.Start(psi);
                        return;
                    }
                    catch { }
                }
            }

            string[] chromePaths = new string[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Google\\Chrome\\Application\\chrome.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Google\\Chrome\\Application\\chrome.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Google\\Chrome\\Application\\chrome.exe")
            };
            foreach (string chrome in chromePaths)
            {
                if (File.Exists(chrome))
                {
                    try
                    {
                        ProcessStartInfo psi = new ProcessStartInfo();
                        psi.FileName = chrome;
                        psi.Arguments = string.Format("--app=\"{0}\" --window-size=1360,880 --user-data-dir=\"{1}\" --no-first-run --no-default-browser-check", url, profileDir);
                        psi.UseShellExecute = false;
                        Process.Start(psi);
                        return;
                    }
                    catch { }
                }
            }

            try
            {
                Process.Start(url);
            }
            catch (Exception ex)
            {
                ShowWarning(
                    "Could not launch browser automatically.\n\nPlease open your web browser and navigate to:\n" + url + "\n\nError: " + ex.Message,
                    "Soil Nail Design Suite 1.0 - Browser Error"
                );
            }
        }

        private static string GetMimeType(string path)
        {
            string ext = Path.GetExtension(path).ToLowerInvariant();
            switch (ext)
            {
                case ".html": return "text/html; charset=utf-8";
                case ".js":
                case ".mjs": return "application/javascript; charset=utf-8";
                case ".css": return "text/css; charset=utf-8";
                case ".json": return "application/json; charset=utf-8";
                case ".svg": return "image/svg+xml";
                case ".png": return "image/png";
                case ".jpg":
                case ".jpeg": return "image/jpeg";
                case ".ico": return "image/x-icon";
                case ".woff": return "font/woff";
                case ".woff2": return "font/woff2";
                case ".ttf": return "font/ttf";
                case ".wasm": return "application/wasm";
                case ".webp": return "image/webp";
                default: return "application/octet-stream";
            }
        }
    }
}
