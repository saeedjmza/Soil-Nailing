/**
 * Windows Desktop & Standalone Single-File Executable (*.exe) Suite Modal
 * Mirrors Tunnel-application zero-internet csc.exe + Desktop PWA + Electron + Portable ZIP pipeline
 */
import React, { useState } from 'react';
import JSZip from 'jszip';
import { Language } from '../types/nailing';
import { AppLogo } from './common/AppLogo';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  X,
  Monitor,
  Sparkles,
  ShieldCheck,
  Terminal,
  FolderArchive,
  FileCode,
  Download,
  HardDriveDownload,
  ExternalLink,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const WindowsExeModal: React.FC<Props> = ({ isOpen, onClose, lang }) => {
  const [activeTab, setActiveTab] = useState<'native-exe' | 'desktop-pwa' | 'portable-zip'>('native-exe');
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadingHtml, setDownloadingHtml] = useState(false);
  const { isInstallable, isInstalled, install } = usePWAInstall();

  if (!isOpen) return null;
  const isFa = lang === 'fa';

  const handleDownloadSingleFile = async () => {
    setDownloadingHtml(true);
    try {
      let htmlContent = '';
      try {
        const resp = await fetch('/SoilNail_Design_Suite_Offline.html');
        if (resp.ok) htmlContent = await resp.text();
      } catch {
        // Fallback
      }
      if (!htmlContent) {
        htmlContent = document.documentElement.outerHTML;
      }
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'SoilNail_Design_Suite_Offline.html';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingHtml(false);
    }
  };

  const handleDownloadPortableZip = async () => {
    setDownloadingZip(true);
    try {
      const zip = new JSZip();

      const batContent = `@echo off
title Soil Nail Wall Design Suite v1.0 - Portable Windows Launcher
cd /d "%~dp0"
if exist "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" (
    start "" "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" --app="file:///%~dp0SoilNail_Design_Suite_Offline.html" --window-size=1440,900
    exit
)
if exist "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe" (
    start "" "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe" --app="file:///%~dp0SoilNail_Design_Suite_Offline.html" --window-size=1440,900
    exit
)
if exist "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" (
    start "" "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" --app="file:///%~dp0SoilNail_Design_Suite_Offline.html" --window-size=1440,900
    exit
)
start "" "SoilNail_Design_Suite_Offline.html"
`;

      const vbsContent = `Set WshShell = CreateObject("WScript.Shell")
WshShell.Run chr(34) & WshShell.CurrentDirectory & "\\SoilNail_Design_Suite.bat" & Chr(34), 0
Set WshShell = Nothing
`;

      const htaContent = `<!DOCTYPE html>
<html>
<head>
<title>Soil Nail Wall Design Suite (AASHTO LRFD / FHWA GEC-7)</title>
<hta:application id="SoilNailDesignSuite" applicationname="SoilNailDesignSuite" border="thick" borderstyle="normal" caption="yes" maximizebutton="yes" minimizebutton="yes" showintaskbar="yes" singleinstance="yes" sysmenu="yes" windowstate="maximize" navigable="yes" />
<meta http-equiv="x-ua-compatible" content="ie=edge" />
<style>body, html { margin:0; padding:0; width:100%; height:100%; overflow:hidden; background:#020617; } iframe { width:100%; height:100%; border:none; }</style>
</head>
<body><iframe src="SoilNail_Design_Suite_Offline.html"></iframe></body>
</html>`;

      const readmeFa = `========================================================================
نرم‌افزار محاسبات و طراحی دیوارهای نیلینگ (Soil Nail Wall Design Suite v1.0)
مطابق آیین‌نامه AASHTO LRFD (2020) و راهنمای FHWA-NHI-14-007 (GEC-7)
========================================================================
روش اجرا در ویندوز:
۱- روی فایل SoilNail_Design_Suite.vbs یا SoilNail_Design_Suite.bat دو بار کلیک کنید تا در پنجره مستقل دسکتاپ بدون نوار مرورگر باز شود.
۲- یا فایل SoilNail_Design_Suite_Offline.html را مستقیماً باز کنید.
۳- برای ساخت تک‌فایل اجرایی *.exe بومی بدون نیاز به اینترنت، اسکریپت build-portable-exe.bat را در پوشه سورس اجرا نمایید (کامپایل ۲ ثانیه‌ای با csc.exe).
`;

      zip.file('SoilNail_Design_Suite.bat', batContent);
      zip.file('SoilNail_Design_Suite.vbs', vbsContent);
      zip.file('SoilNail_Design_Suite_App.hta', htaContent);
      zip.file('README.txt', readmeFa);

      let htmlContent = '';
      try {
        const resp = await fetch('/SoilNail_Design_Suite_Offline.html');
        if (resp.ok) htmlContent = await resp.text();
      } catch {
        // Fallback
      }
      if (!htmlContent) {
        htmlContent = document.documentElement.outerHTML;
      }
      zip.file('SoilNail_Design_Suite_Offline.html', htmlContent);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'SoilNail_Design_Suite_Portable_Windows.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        dir={isFa ? 'rtl' : 'ltr'}
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto text-slate-200 text-xs"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <AppLogo size="md" className="shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-100 flex flex-wrap items-center gap-2">
                <span>{isFa ? 'نسخه مستقل ویندوز (*.EXE) و دسکتاپ آفلاین' : 'Windows Desktop & Standalone (*.EXE) Edition'}</span>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 text-[10px] font-mono">
                  Win 7 / 10 / 11
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isFa
                  ? 'کامپایل تک‌فایل اجرایی بومی (csc.exe) در ۲ ثانیه بدون اینترنت + نصب دسکتاپ PWA + بسته پرتابل'
                  : '2-second offline C# single-file .EXE builder + Windows Desktop PWA + Portable Archive'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={isFa ? 'بستن' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-800 bg-slate-950/50 px-4 pt-2 gap-1.5 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('native-exe')}
            className={`px-3.5 py-2 font-bold rounded-t-lg transition flex items-center gap-1.5 border-t-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'native-exe'
                ? 'bg-slate-900 text-amber-400 border-amber-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{isFa ? 'تک‌فایل بومی SoilNail1.0.exe' : 'Native Single-File .EXE'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('desktop-pwa')}
            className={`px-3.5 py-2 font-bold rounded-t-lg transition flex items-center gap-1.5 border-t-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'desktop-pwa'
                ? 'bg-slate-900 text-emerald-400 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/50'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>{isFa ? 'نصب فوری دسکتاپ ویندوز (PWA)' : 'Instant Desktop App (PWA)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('portable-zip')}
            className={`px-3.5 py-2 font-bold rounded-t-lg transition flex items-center gap-1.5 border-t-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'portable-zip'
                ? 'bg-slate-900 text-sky-400 border-sky-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/50'
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>{isFa ? 'دانلود مستقیم بسته پرتابل (.ZIP)' : 'Portable Package (.ZIP)'}</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {activeTab === 'native-exe' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>
                      {isFa
                        ? 'روش ۱: ساخت تک‌فایل اجرایی مستقل بدون نیاز به اینترنت (کمتر از ۲ ثانیه)'
                        : 'Method 1: Instant Single-File Native Windows .EXE (100% Offline)'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                    Zero Internet
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {isFa
                    ? 'مشابه معماری پیشرفته سامانه تونل، فایل‌های پروژه توسط اسکریپت فشرده‌سازی اختصاصی (pack-assets.cjs) در هسته یک لانچر بومی C# جاسازی شده و با کامپایلر داخلی ویندوز (csc.exe) مستقیماً به تک‌فایل اجرایی release\\SoilNailDesignSuite1.0.exe تبدیل می‌شوند!'
                    : 'All web assets are embedded inside a native C# loopback server binary compiled offline in 2 seconds using Windows built-in .NET csc.exe into a single release\\SoilNailDesignSuite1.0.exe file.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{isFa ? 'بدون نیاز به دسترسی Administrator' : 'No Administrator permissions needed'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{isFa ? 'بدون وابستگی به پوشه بیرونی dist' : 'Self-contained embedded assets'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sky-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{isFa ? 'دارای آیکون اختصاصی build\\icon.ico' : 'Custom embedded application icon'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sky-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{isFa ? 'پشتیبانی کامل از ذخیره *.SNDA و PDF' : 'Full *.SNDA & PDF support'}</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1" dir="ltr">
                  <div className="text-slate-400"># Step 1: Run 1-click Windows builder (Offline Native .EXE or Electron):</div>
                  <div className="text-amber-300 font-bold select-all">build-portable-exe.bat</div>
                  <div className="text-slate-400 pt-1"># Or launch instantly offline in App Window mode without compiling:</div>
                  <div className="text-emerald-300 font-bold select-all">start-offline-app.bat</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-200 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>{isFa ? 'بسته‌بندی Electron و بیلد خودکار GitHub Actions' : 'Electron Builder & GitHub Actions CI'}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">electron-builder.json</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isFa
                    ? 'علاوه بر کامپایلر سریع بومی، ورک‌فلو ابری .github/workflows/build-all.yml و تنظیمات electron-builder.json برای ساخت نصاب‌های x64 و x86 نیز در پروژه مهیا شده است.'
                    : 'Includes electron/main.cjs, electron-builder.json, and .github/workflows/build-all.yml for automated Windows cloud builds.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'desktop-pwa' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Monitor className="w-4 h-4 shrink-0" />
                    <span>
                      {isFa
                        ? 'نصب مستقیم روی دسکتاپ ویندوز ۱۰ و ۱۱ (بدون دانلود اضافه)'
                        : 'Direct Windows 10/11 Desktop App Installation'}
                    </span>
                  </div>
                  {isInstallable && !isInstalled && (
                    <button
                      type="button"
                      onClick={() => install()}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isFa ? 'نصب روی دسکتاپ' : 'Install Now'}</span>
                    </button>
                  )}
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">
                  {isFa
                    ? 'مرورگرهای Microsoft Edge و Google Chrome این سامانه را به عنوان یک نرم‌افزار رسمی دسکتاپ ویندوز شناسایی می‌کنند و آن را با آیکون اختصاصی در Desktop و منوی Start نصب می‌نمایند:'
                    : 'Edge and Chrome convert this PWA into a registered Windows Desktop program with Start Menu & Taskbar shortcuts:'}
                </p>

                <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300 bg-slate-900/70 p-3 rounded-lg border border-slate-800">
                  <li>
                    {isFa
                      ? 'روی دکمه «نصب روی دسکتاپ» در بالای همین نوار ابزار یا آیکون نصب در نوار آدرس مرورگر کلیک کنید.'
                      : 'Click the Install icon in the browser address bar or the Install button in the toolbar.'}
                  </li>
                  <li>
                    {isFa
                      ? 'گزینه «Create Desktop Shortcut» و «Pin to Taskbar» را تایید کنید.'
                      : 'Approve Desktop Shortcut and Pin to Taskbar.'}
                  </li>
                  <li>
                    {isFa
                      ? 'نرم‌افزار بدون نیاز به اینترنت و با پنجره استاندارد ویندوز باز خواهد شد.'
                      : 'Launches 100% offline inside a dedicated native Windows frame.'}
                  </li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'portable-zip' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-sky-500/40 space-y-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">
                      {isFa ? 'دانلود آنی بسته پرتابل ویندوز (ZIP / Offline HTML)' : 'Instant Portable Bundle Download'}
                    </h4>
                    <p className="text-slate-300 mt-1 text-xs leading-relaxed">
                      {isFa
                        ? 'شامل فایل‌های اجرایی .bat، .vbs (اجرای بی‌صدا)، .hta و نسخه تک‌فایل تماماً آفلاین HTML برای انتقال سریع با فلش مموری.'
                        : 'Includes .bat, silent .vbs, .hta, and standalone single-file HTML for instant USB portable execution.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadPortableZip}
                    disabled={downloadingZip}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    <FolderArchive className="w-4 h-4" />
                    <span>
                      {downloadingZip
                        ? isFa ? 'در حال ایجاد ZIP...' : 'Generating ZIP...'
                        : isFa ? 'دانلود بسته پرتابل ویندوز (.ZIP)' : 'Download Portable Suite (.ZIP)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadSingleFile}
                    disabled={downloadingHtml}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 transition disabled:opacity-50 cursor-pointer"
                  >
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <span>
                      {downloadingHtml
                        ? isFa ? 'در حال ذخیره...' : 'Saving...'
                        : isFa ? 'دانلود تک‌فایل آفلاین (.HTML)' : 'Download Offline (.HTML)'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <HardDriveDownload className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              {isFa
                ? 'تمامی محاسبات محلی روی سیستم کاربر اجرا شده و کاملاً محرمانه است.'
                : '100% client-side offline calculations.'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://nodejs.org"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px]"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Node.js</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              {isFa ? 'بستن' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
