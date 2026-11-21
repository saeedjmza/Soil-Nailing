@echo off
setlocal EnableExtensions
title Soil Nail Design Suite 1.0 - Windows Single-File EXE Builder
echo ======================================================================
echo    AASHTO ^& FHWA Soil Nail Design Suite 1.0
echo    Windows Standalone Single-File EXE Builder (100%% Offline)
echo ======================================================================
echo.

pushd "%~dp0"
set "NO_PAUSE=0"
if /I "%~1"=="--nopause" set "NO_PAUSE=1"

if not exist "build" mkdir "build"
if not exist "release" mkdir "release"
if not exist "scripts" mkdir "scripts"
if not exist "build\icon.ico" (
    if exist "publicavicon.ico" copy /y "publicavicon.ico" "build\icon.ico" >nul 2>nul
)

where node.exe >nul 2>nul
if not errorlevel 1 (
    if exist "node_modulesite" (
        echo [1/3] Building latest frontend production bundle...
        call npm run build
        if errorlevel 1 echo [WARN] npm run build failed, checking existing dist / resources\dist...
    ) else (
        echo [1/3] node_modules not installed; using prebuilt production assets...
    )
    if exist "dist\index.html" (
        echo [2/3] Packing dist assets into standalone compressed bundle...
        node "scripts\pack-assets.cjs"
    ) else if exist "resources\dist\index.html" (
        echo [2/3] Restoring from resources\dist and packing bundle...
        node "scripts\pack-assets.cjs"
    )
) else (
    echo [1/3] Node.js not found; using bundled prebuilt assets...
)

if not exist "buildpp_assets.bundle" (
    if exist "resourcespp_assets.bundle" copy /y "resourcespp_assets.bundle" "buildpp_assets.bundle" >nul 2>nul
    if not exist "buildpp_assets.bundle" if exist "scriptsssets.bundle" copy /y "scriptsssets.bundle" "buildpp_assets.bundle" >nul 2>nul
)

if not exist "buildpp_assets.bundle" (
    echo [ERROR] Could not locate or generate buildpp_assets.bundle!
    echo         Ensure resourcespp_assets.bundle or dist\ exists, or run: npm install ^&^& npm run build
    goto :finish
)

set "CS_SOURCE=scripts\SoilNailLauncher.cs"
set "NEED_REPAIR=0"
if not exist "%CS_SOURCE%" set "NEED_REPAIR=1"
if "%NEED_REPAIR%"=="0" (
    findstr /C:"Main(" "%CS_SOURCE%" >nul 2>nul
    if errorlevel 1 set "NEED_REPAIR=1"
)

if "%NEED_REPAIR%"=="1" (
    echo [INFO] Restoring self-contained launcher source to build\SoilNailLauncher.cs...
    set "CS_SOURCE=build\SoilNailLauncher.cs"
    call :extract_launcher "build\SoilNailLauncher.b64" "build\SoilNailLauncher.cs"
)

set "CSC_EXE="
if exist "%SystemRoot%\Microsoft.NET\Framework644.0.30319\csc.exe" set "CSC_EXE=%SystemRoot%\Microsoft.NET\Framework644.0.30319\csc.exe"
if "%CSC_EXE%"=="" if exist "%SystemRoot%\Microsoft.NET\Framework4.0.30319\csc.exe" set "CSC_EXE=%SystemRoot%\Microsoft.NET\Framework4.0.30319\csc.exe"
if "%CSC_EXE%"=="" (
    for /f "delims=" %%I in ('where csc.exe 2^>nul') do (
        if "%CSC_EXE%"=="" set "CSC_EXE=%%I"
    )
)
if "%CSC_EXE%"=="" (
    for %%V in (2022 2019 2017) do (
        for %%E in (BuildTools Community Professional Enterprise) do (
            if "%CSC_EXE%"=="" if exist "%ProgramFiles%\Microsoft Visual Studio\%%V\%%E\MSBuild\Current\Bin\Roslyn\csc.exe" set "CSC_EXE=%ProgramFiles%\Microsoft Visual Studio\%%V\%%E\MSBuild\Current\Bin\Roslyn\csc.exe"
            if "%CSC_EXE%"=="" if exist "%ProgramFiles(x86)%\Microsoft Visual Studio\%%V\%%E\MSBuild\Current\Bin\Roslyn\csc.exe" set "CSC_EXE=%ProgramFiles(x86)%\Microsoft Visual Studio\%%V\%%E\MSBuild\Current\Bin\Roslyn\csc.exe"
        )
    )
)

set "BUNDLE_FILE=buildpp_assets.bundle"
set "OUT_EXE=release\SoilNailDesignSuite1.0.exe"
if exist "%OUT_EXE%" del /f /q "%OUT_EXE%" >nul 2>nul

set "ICON_PARAM="
if exist "build\icon.ico" set "ICON_PARAM=/win32icon:build\icon.ico"
if "%ICON_PARAM%"=="" if exist "publicavicon.ico" set "ICON_PARAM=/win32icon:publicavicon.ico"

echo [3/3] Compiling standalone single-file %OUT_EXE%...
if not "%CSC_EXE%"=="" echo       Compiler: "%CSC_EXE%"

if not "%CSC_EXE%"=="" (
    "%CSC_EXE%" /nologo /optimize+ /target:winexe /main:SoilNailDesignSuite.Program %ICON_PARAM% "/resource:%BUNDLE_FILE%,SoilNailAssets" "/out:%OUT_EXE%" /r:System.dll "%CS_SOURCE%"
    if errorlevel 1 if not "%ICON_PARAM%"=="" (
        echo [WARN] First compile attempt failed; retrying without icon resource...
        "%CSC_EXE%" /nologo /optimize+ /target:winexe /main:SoilNailDesignSuite.Program "/resource:%BUNDLE_FILE%,SoilNailAssets" "/out:%OUT_EXE%" /r:System.dll "%CS_SOURCE%"
    )
) else (
    echo [WARN] csc.exe not found in default paths; trying PowerShell CSharpCodeProvider...
    powershell -NoProfile -ExecutionPolicy Bypass -Command " = Get-Content -Raw '%CS_SOURCE%';  = New-Object System.CodeDom.Compiler.CompilerParameters; .GenerateExecutable = ; .OutputAssembly = '%OUT_EXE%'; .MainClass = 'SoilNailDesignSuite.Program'; .ReferencedAssemblies.Add('System.dll'); .EmbeddedResources.Add('%BUNDLE_FILE%,SoilNailAssets') | Out-Null; .CompilerOptions = '/target:winexe /optimize+';  = New-Object Microsoft.CSharp.CSharpCodeProvider;  = .CompileAssemblyFromSource(, ); if (.Errors.HasErrors) { .Errors | ForEach-Object { Write-Error /app/control-plane-api/control-plane-api.ToString() }; exit 1 }"
)

if exist "dist-singlefile\index.html" (
    copy /y "dist-singlefile\index.html" "release\SoilNailDesignSuite1.0-Offline.html" >nul 2>nul
) else if exist "resources\SoilNail_Design_Suite_Offline.html" (
    copy /y "resources\SoilNail_Design_Suite_Offline.html" "release\SoilNailDesignSuite1.0-Offline.html" >nul 2>nul
)

if exist "%OUT_EXE%" (
    for %%F in ("%OUT_EXE%") do set "EXE_SIZE=%%~zF"
    echo.
    echo ======================================================================
    echo [SUCCESS] Built %~dp0%OUT_EXE%
    echo           File size: %EXE_SIZE% bytes ^(100%% Self-Contained Portable^)
    echo ======================================================================
    if "%NO_PAUSE%"=="0" explorer /select,"%~dp0%OUT_EXE%" >nul 2>nul
) else (
    echo.
    echo [ERROR] Compilation failed and %OUT_EXE% was not generated.
    echo         Tips:
    echo         1. Move project to a short path like C:\SoilNail    echo         2. Ensure Windows .NET Framework 4.x is enabled or temporarily pause Antivirus.
)
goto :finish

:extract_launcher
> "%~1" (
echo -----BEGIN CERTIFICATE-----
echo dXNpbmcgU3lzdGVtOw0KdXNpbmcgU3lzdGVtLklPOw0KdXNpbmcgU3lzdGVtLk5ldDsNCnVzaW5n
echo IFN5c3RlbS5OZXQuU29ja2V0czsNCnVzaW5nIFN5c3RlbS5UZXh0Ow0KdXNpbmcgU3lzdGVtLkRp
echo YWdub3N0aWNzOw0KdXNpbmcgU3lzdGVtLlRocmVhZGluZzsNCnVzaW5nIFN5c3RlbS5Db2xsZWN0
echo aW9ucy5HZW5lcmljOw0KdXNpbmcgU3lzdGVtLlJlZmxlY3Rpb247DQp1c2luZyBTeXN0ZW0uSU8u
echo Q29tcHJlc3Npb247DQoNCm5hbWVzcGFjZSBTb2lsTmFpbERlc2lnblN1aXRlDQp7DQogICAgcHVi
echo bGljIGNsYXNzIFByb2dyYW0NCiAgICB7DQogICAgICAgIHByaXZhdGUgc3RhdGljIFRjcExpc3Rl
echo bmVyIF90Y3BMaXN0ZW5lcjsNCiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgaW50IF9wb3J0Ow0KICAg
echo ICAgICBwcml2YXRlIHN0YXRpYyB2b2xhdGlsZSBib29sIF9ydW5uaW5nID0gdHJ1ZTsNCiAgICAg
echo ICAgcHJpdmF0ZSBzdGF0aWMgdm9sYXRpbGUgYm9vbCBfc2VlbkhlYXJ0YmVhdCA9IGZhbHNlOw0K
echo ICAgICAgICBwcml2YXRlIHN0YXRpYyBEYXRlVGltZSBfbGFzdEFjdGl2aXR5ID0gRGF0ZVRpbWUu
echo VXRjTm93Ow0KICAgICAgICBwcml2YXRlIHN0YXRpYyBEYXRlVGltZSBfc3RhcnRUaW1lID0gRGF0
echo ZVRpbWUuVXRjTm93Ow0KICAgICAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBEaWN0aW9uYXJ5
echo PHN0cmluZywgYnl0ZVtdPiBfbWVtb3J5RmlsZXMgPSBuZXcgRGljdGlvbmFyeTxzdHJpbmcsIGJ5
echo dGVbXT4oU3RyaW5nQ29tcGFyZXIuT3JkaW5hbElnbm9yZUNhc2UpOw0KDQogICAgICAgIFtTeXN0
echo ZW0uUnVudGltZS5JbnRlcm9wU2VydmljZXMuRGxsSW1wb3J0KCJ1c2VyMzIuZGxsIiwgRW50cnlQ
echo b2ludCA9ICJNZXNzYWdlQm94VyIsIENoYXJTZXQgPSBTeXN0ZW0uUnVudGltZS5JbnRlcm9wU2Vy
echo dmljZXMuQ2hhclNldC5Vbmljb2RlKV0NCiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZXh0ZXJuIGlu
echo dCBTaG93TmF0aXZlQm94KEludFB0ciBoV25kLCBzdHJpbmcgdGV4dCwgc3RyaW5nIGNhcHRpb24s
echo IHVpbnQgdHlwZSk7DQoNCiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdm9pZCBTaG93RXJyb3Ioc3Ry
echo aW5nIG1lc3NhZ2UsIHN0cmluZyBjYXB0aW9uKQ0KICAgICAgICB7DQogICAgICAgICAgICB0cnkg
echo eyBTaG93TmF0aXZlQm94KEludFB0ci5aZXJvLCBtZXNzYWdlLCBjYXB0aW9uLCAweDEwKTsgfQ0K
echo ICAgICAgICAgICAgY2F0Y2ggeyBDb25zb2xlLldyaXRlTGluZShjYXB0aW9uICsgIjogIiArIG1l
echo c3NhZ2UpOyB9DQogICAgICAgIH0NCg0KICAgICAgICBwcml2YXRlIHN0YXRpYyB2b2lkIFNob3dX
echo YXJuaW5nKHN0cmluZyBtZXNzYWdlLCBzdHJpbmcgY2FwdGlvbikNCiAgICAgICAgew0KICAgICAg
echo ICAgICAgdHJ5IHsgU2hvd05hdGl2ZUJveChJbnRQdHIuWmVybywgbWVzc2FnZSwgY2FwdGlvbiwg
echo MHgzMCk7IH0NCiAgICAgICAgICAgIGNhdGNoIHsgQ29uc29sZS5Xcml0ZUxpbmUoY2FwdGlvbiAr
echo ICI6ICIgKyBtZXNzYWdlKTsgfQ0KICAgICAgICB9DQoNCiAgICAgICAgW1NUQVRocmVhZF0NCiAg
echo ICAgICAgcHVibGljIHN0YXRpYyBpbnQgTWFpbihzdHJpbmdbXSBhcmdzKQ0KICAgICAgICB7DQog
echo ICAgICAgICAgICBfc3RhcnRUaW1lID0gRGF0ZVRpbWUuVXRjTm93Ow0KICAgICAgICAgICAgX2xh
echo c3RBY3Rpdml0eSA9IERhdGVUaW1lLlV0Y05vdzsNCg0KICAgICAgICAgICAgYm9vbCBsb2FkZWQg
echo PSBMb2FkRW1iZWRkZWRCdW5kbGUoKTsNCiAgICAgICAgICAgIGlmICghbG9hZGVkKQ0KICAgICAg
echo ICAgICAgew0KICAgICAgICAgICAgICAgIHN0cmluZyBleGVEaXIgPSBBcHBEb21haW4uQ3VycmVu
echo dERvbWFpbi5CYXNlRGlyZWN0b3J5Ow0KICAgICAgICAgICAgICAgIHN0cmluZyB3ZWJSb290ID0g
echo TG9jYXRlV2ViUm9vdChleGVEaXIpOw0KICAgICAgICAgICAgICAgIGlmICh3ZWJSb290ICE9IG51
echo bGwgJiYgRmlsZS5FeGlzdHMoUGF0aC5Db21iaW5lKHdlYlJvb3QsICJpbmRleC5odG1sIikpKQ0K
echo ICAgICAgICAgICAgICAgIHsNCiAgICAgICAgICAgICAgICAgICAgTG9hZERpc2tGaWxlcyh3ZWJS
echo b290KTsNCiAgICAgICAgICAgICAgICAgICAgbG9hZGVkID0gX21lbW9yeUZpbGVzLkNvbnRhaW5z
echo S2V5KCJpbmRleC5odG1sIik7DQogICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgfQ0KDQog
echo ICAgICAgICAgICBpZiAoIWxvYWRlZCB8fCAhX21lbW9yeUZpbGVzLkNvbnRhaW5zS2V5KCJpbmRl
echo eC5odG1sIikpDQogICAgICAgICAgICB7DQogICAgICAgICAgICAgICAgU2hvd0Vycm9yKA0KICAg
echo ICAgICAgICAgICAgICAgICAiQXBwbGljYXRpb24gYXNzZXRzIGNvdWxkIG5vdCBiZSBleHRyYWN0
echo ZWQgZnJvbSB0aGUgZXhlY3V0YWJsZS5cblxuUGxlYXNlIGVuc3VyZSBTb2lsTmFpbERlc2lnblN1
echo aXRlMS4wLmV4ZSBpcyBpbnRhY3QgYW5kIG5vdCBjb3JydXB0ZWQuIiwNCiAgICAgICAgICAgICAg
echo ICAgICAgIlNvaWwgTmFpbCBEZXNpZ24gU3VpdGUgMS4wIC0gU3RhcnR1cCBFcnJvciINCiAgICAg
echo ICAgICAgICAgICApOw0KICAgICAgICAgICAgICAgIHJldHVybiAxOw0KICAgICAgICAgICAgfQ0K
echo DQogICAgICAgICAgICB0cnkNCiAgICAgICAgICAgIHsNCiAgICAgICAgICAgICAgICBfdGNwTGlz
echo dGVuZXIgPSBuZXcgVGNwTGlzdGVuZXIoSVBBZGRyZXNzLkxvb3BiYWNrLCAwKTsNCiAgICAgICAg
echo ICAgICAgICBfdGNwTGlzdGVuZXIuU3RhcnQoKTsNCiAgICAgICAgICAgICAgICBfcG9ydCA9ICgo
echo SVBFbmRQb2ludClfdGNwTGlzdGVuZXIuTG9jYWxFbmRwb2ludCkuUG9ydDsNCg0KICAgICAgICAg
echo ICAgICAgIFRocmVhZCBzZXJ2ZXJUaHJlYWQgPSBuZXcgVGhyZWFkKExpc3Rlbkxvb3ApOw0KICAg
echo ICAgICAgICAgICAgIHNlcnZlclRocmVhZC5Jc0JhY2tncm91bmQgPSB0cnVlOw0KICAgICAgICAg
echo ICAgICAgIHNlcnZlclRocmVhZC5TdGFydCgpOw0KICAgICAgICAgICAgfQ0KICAgICAgICAgICAg
echo Y2F0Y2ggKEV4Y2VwdGlvbiBleCkNCiAgICAgICAgICAgIHsNCiAgICAgICAgICAgICAgICBTaG93
echo RXJyb3IoDQogICAgICAgICAgICAgICAgICAgICJGYWlsZWQgdG8gYmluZCBsb2NhbCBhcHBsaWNh
echo dGlvbiBwb3J0OlxuXG4iICsgZXguTWVzc2FnZSArICJcblxuUGxlYXNlIGVuc3VyZSBsb29wYmFj
echo ayBuZXR3b3JraW5nICgxMjcuMC4wLjEpIGlzIHBlcm1pdHRlZC4iLA0KICAgICAgICAgICAgICAg
echo ICAgICAiU29pbCBOYWlsIERlc2lnbiBTdWl0ZSAxLjAgLSBOZXR3b3JrIEVycm9yIg0KICAgICAg
echo ICAgICAgICAgICk7DQogICAgICAgICAgICAgICAgcmV0dXJuIDE7DQogICAgICAgICAgICB9DQoN
echo CiAgICAgICAgICAgIHN0cmluZyBhcHBVcmwgPSAiaHR0cDovLzEyNy4wLjAuMToiICsgX3BvcnQg
echo KyAiLyI7DQogICAgICAgICAgICBMYXVuY2hCcm93c2VyKGFwcFVybCk7DQoNCiAgICAgICAgICAg
echo IHdoaWxlIChfcnVubmluZykNCiAgICAgICAgICAgIHsNCiAgICAgICAgICAgICAgICBUaHJlYWQu
echo U2xlZXAoMTAwMCk7DQogICAgICAgICAgICAgICAgaWYgKF9zZWVuSGVhcnRiZWF0ICYmIChEYXRl
echo VGltZS5VdGNOb3cgLSBfc3RhcnRUaW1lKS5Ub3RhbFNlY29uZHMgPiAzNSkNCiAgICAgICAgICAg
echo ICAgICB7DQogICAgICAgICAgICAgICAgICAgIGlmICgoRGF0ZVRpbWUuVXRjTm93IC0gX2xhc3RB
echo Y3Rpdml0eSkuVG90YWxTZWNvbmRzID4gMjApDQogICAgICAgICAgICAgICAgICAgIHsNCiAgICAg
echo ICAgICAgICAgICAgICAgICAgIGJyZWFrOw0KICAgICAgICAgICAgICAgICAgICB9DQogICAgICAg
echo ICAgICAgICAgfQ0KICAgICAgICAgICAgfQ0KDQogICAgICAgICAgICBfcnVubmluZyA9IGZhbHNl
echo Ow0KICAgICAgICAgICAgdHJ5IHsgX3RjcExpc3RlbmVyLlN0b3AoKTsgfSBjYXRjaCB7IH0NCiAg
echo ICAgICAgICAgIHJldHVybiAwOw0KICAgICAgICB9DQoNCiAgICAgICAgcHJpdmF0ZSBzdGF0aWMg
echo Ym9vbCBMb2FkRW1iZWRkZWRCdW5kbGUoKQ0KICAgICAgICB7DQogICAgICAgICAgICB0cnkNCiAg
echo ICAgICAgICAgIHsNCiAgICAgICAgICAgICAgICBBc3NlbWJseSBhc20gPSBBc3NlbWJseS5HZXRF
echo eGVjdXRpbmdBc3NlbWJseSgpOw0KICAgICAgICAgICAgICAgIHVzaW5nIChTdHJlYW0gcmVzU3Ry
echo ZWFtID0gYXNtLkdldE1hbmlmZXN0UmVzb3VyY2VTdHJlYW0oIlNvaWxOYWlsQXNzZXRzIikpDQog
echo ICAgICAgICAgICAgICAgew0KICAgICAgICAgICAgICAgICAgICBpZiAocmVzU3RyZWFtID09IG51
echo bGwpIHJldHVybiBmYWxzZTsNCiAgICAgICAgICAgICAgICAgICAgdXNpbmcgKEJpbmFyeVJlYWRl
echo ciByZWFkZXIgPSBuZXcgQmluYXJ5UmVhZGVyKHJlc1N0cmVhbSwgRW5jb2RpbmcuVVRGOCkpDQog
echo ICAgICAgICAgICAgICAgICAgIHsNCiAgICAgICAgICAgICAgICAgICAgICAgIGJ5dGVbXSBtYWdp
echo YyA9IHJlYWRlci5SZWFkQnl0ZXMoNCk7DQogICAgICAgICAgICAgICAgICAgICAgICBpZiAoRW5j
echo b2RpbmcuQVNDSUkuR2V0U3RyaW5nKG1hZ2ljKSAhPSAiU05EQSIpIHJldHVybiBmYWxzZTsNCiAg
echo ICAgICAgICAgICAgICAgICAgICAgIGludCB2ZXJzaW9uID0gcmVhZGVyLlJlYWRJbnQzMigpOw0K
echo ICAgICAgICAgICAgICAgICAgICAgICAgaW50IGZpbGVDb3VudCA9IHJlYWRlci5SZWFkSW50MzIo
echo KTsNCiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ZXJzaW9uICE9IDEgfHwgZmlsZUNvdW50
echo IDw9IDApIHJldHVybiBmYWxzZTsNCg0KICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQg
echo aSA9IDA7IGkgPCBmaWxlQ291bnQ7IGkrKykNCiAgICAgICAgICAgICAgICAgICAgICAgIHsNCiAg
echo ICAgICAgICAgICAgICAgICAgICAgICAgICB1c2hvcnQgcGF0aExlbiA9IHJlYWRlci5SZWFkVUlu
echo dDE2KCk7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZVtdIHBhdGhCeXRlcyA9IHJl
echo YWRlci5SZWFkQnl0ZXMocGF0aExlbik7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ry
echo aW5nIHJlbFBhdGggPSBFbmNvZGluZy5VVEY4LkdldFN0cmluZyhwYXRoQnl0ZXMpLlJlcGxhY2Uo
echo J1xcJywgJy8nKTsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1aW50IHJhd1NpemUgPSBy
echo ZWFkZXIuUmVhZFVJbnQzMigpOw0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVpbnQgY29t
echo cFNpemUgPSByZWFkZXIuUmVhZFVJbnQzMigpOw0KICAgICAgICAgICAgICAgICAgICAgICAgICAg
echo IGJ5dGVbXSBjb21wRGF0YSA9IHJlYWRlci5SZWFkQnl0ZXMoKGludCljb21wU2l6ZSk7DQoNCiAg
echo ICAgICAgICAgICAgICAgICAgICAgICAgICBieXRlW10gcmF3RGF0YSA9IG5ldyBieXRlW3Jhd1Np
echo emVdOw0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzaW5nIChNZW1vcnlTdHJlYW0gbXMg
echo PSBuZXcgTWVtb3J5U3RyZWFtKGNvbXBEYXRhKSkNCiAgICAgICAgICAgICAgICAgICAgICAgICAg
echo ICB1c2luZyAoRGVmbGF0ZVN0cmVhbSBkcyA9IG5ldyBEZWZsYXRlU3RyZWFtKG1zLCBDb21wcmVz
echo c2lvbk1vZGUuRGVjb21wcmVzcykpDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgew0KICAg
echo ICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnQgdG90YWxSZWFkID0gMDsNCiAgICAgICAg
echo ICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRvdGFsUmVhZCA8IChpbnQpcmF3U2l6ZSkN
echo CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgew0KICAgICAgICAgICAgICAgICAgICAg
echo ICAgICAgICAgICAgICAgaW50IHJlYWQgPSBkcy5SZWFkKHJhd0RhdGEsIHRvdGFsUmVhZCwgKGlu
echo dClyYXdTaXplIC0gdG90YWxSZWFkKTsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
echo ICAgIGlmIChyZWFkIDw9IDApIGJyZWFrOw0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
echo ICAgICAgdG90YWxSZWFkICs9IHJlYWQ7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
echo IH0NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgICAgICAgICAg
echo ICAgICAgX21lbW9yeUZpbGVzW3JlbFBhdGhdID0gcmF3RGF0YTsNCiAgICAgICAgICAgICAgICAg
echo ICAgICAgIH0NCiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfbWVtb3J5RmlsZXMuQ29u
echo dGFpbnNLZXkoImluZGV4Lmh0bWwiKTsNCiAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAg
echo ICAgICAgIH0NCiAgICAgICAgICAgIH0NCiAgICAgICAgICAgIGNhdGNoDQogICAgICAgICAgICB7
echo DQogICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOw0KICAgICAgICAgICAgfQ0KICAgICAgICB9
echo DQoNCiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc3RyaW5nIExvY2F0ZVdlYlJvb3Qoc3RyaW5nIGV4
echo ZURpcikNCiAgICAgICAgew0KICAgICAgICAgICAgc3RyaW5nW10gY2FuZGlkYXRlcyA9IG5ldyBz
echo dHJpbmdbXQ0KICAgICAgICAgICAgew0KICAgICAgICAgICAgICAgIFBhdGguQ29tYmluZShleGVE
echo aXIsICJkaXN0IiksDQogICAgICAgICAgICAgICAgZXhlRGlyLA0KICAgICAgICAgICAgICAgIFBh
echo dGguR2V0RnVsbFBhdGgoUGF0aC5Db21iaW5lKGV4ZURpciwgIi4uXFxkaXN0IikpLA0KICAgICAg
echo ICAgICAgICAgIFBhdGguR2V0RnVsbFBhdGgoUGF0aC5Db21iaW5lKGV4ZURpciwgIi4uXFxyZXNv
echo dXJjZXNcXGRpc3QiKSkNCiAgICAgICAgICAgIH07DQogICAgICAgICAgICBmb3JlYWNoIChzdHJp
echo bmcgYyBpbiBjYW5kaWRhdGVzKQ0KICAgICAgICAgICAgew0KICAgICAgICAgICAgICAgIGlmIChE
echo aXJlY3RvcnkuRXhpc3RzKGMpICYmIEZpbGUuRXhpc3RzKFBhdGguQ29tYmluZShjLCAiaW5kZXgu
echo aHRtbCIpKSkgcmV0dXJuIGM7DQogICAgICAgICAgICB9DQogICAgICAgICAgICByZXR1cm4gbnVs
echo bDsNCiAgICAgICAgfQ0KDQogICAgICAgIHByaXZhdGUgc3RhdGljIHZvaWQgTG9hZERpc2tGaWxl
echo cyhzdHJpbmcgcm9vdCkNCiAgICAgICAgew0KICAgICAgICAgICAgZm9yZWFjaCAoc3RyaW5nIGZp
echo bGUgaW4gRGlyZWN0b3J5LkdldEZpbGVzKHJvb3QsICIqIiwgU2VhcmNoT3B0aW9uLkFsbERpcmVj
echo dG9yaWVzKSkNCiAgICAgICAgICAgIHsNCiAgICAgICAgICAgICAgICBzdHJpbmcgcmVsID0gZmls
echo ZS5TdWJzdHJpbmcocm9vdC5MZW5ndGgpLlRyaW1TdGFydCgnXFwnLCAnLycpLlJlcGxhY2UoJ1xc
echo JywgJy8nKTsNCiAgICAgICAgICAgICAgICBfbWVtb3J5RmlsZXNbcmVsXSA9IEZpbGUuUmVhZEFs
echo bEJ5dGVzKGZpbGUpOw0KICAgICAgICAgICAgfQ0KICAgICAgICB9DQoNCiAgICAgICAgcHJpdmF0
echo ZSBzdGF0aWMgdm9pZCBMaXN0ZW5Mb29wKCkNCiAgICAgICAgew0KICAgICAgICAgICAgd2hpbGUg
echo KF9ydW5uaW5nKQ0KICAgICAgICAgICAgew0KICAgICAgICAgICAgICAgIHRyeQ0KICAgICAgICAg
echo ICAgICAgIHsNCiAgICAgICAgICAgICAgICAgICAgVGNwQ2xpZW50IGNsaWVudCA9IF90Y3BMaXN0
echo ZW5lci5BY2NlcHRUY3BDbGllbnQoKTsNCiAgICAgICAgICAgICAgICAgICAgVGhyZWFkUG9vbC5R
echo dWV1ZVVzZXJXb3JrSXRlbShIYW5kbGVDbGllbnQsIGNsaWVudCk7DQogICAgICAgICAgICAgICAg
echo fQ0KICAgICAgICAgICAgICAgIGNhdGNoDQogICAgICAgICAgICAgICAgew0KICAgICAgICAgICAg
echo ICAgICAgICBpZiAoIV9ydW5uaW5nKSBicmVhazsNCiAgICAgICAgICAgICAgICB9DQogICAgICAg
echo ICAgICB9DQogICAgICAgIH0NCg0KICAgICAgICBwcml2YXRlIHN0YXRpYyB2b2lkIEhhbmRsZUNs
echo aWVudChvYmplY3Qgc3RhdGUpDQogICAgICAgIHsNCiAgICAgICAgICAgIFRjcENsaWVudCBjbGll
echo bnQgPSAoVGNwQ2xpZW50KXN0YXRlOw0KICAgICAgICAgICAgY2xpZW50Lk5vRGVsYXkgPSB0cnVl
echo Ow0KICAgICAgICAgICAgdHJ5DQogICAgICAgICAgICB7DQogICAgICAgICAgICAgICAgdXNpbmcg
echo KE5ldHdvcmtTdHJlYW0gc3RyZWFtID0gY2xpZW50LkdldFN0cmVhbSgpKQ0KICAgICAgICAgICAg
echo ICAgIHsNCiAgICAgICAgICAgICAgICAgICAgYnl0ZVtdIGJ1ZmZlciA9IG5ldyBieXRlWzgxOTJd
echo Ow0KICAgICAgICAgICAgICAgICAgICBpbnQgYnl0ZXNSZWFkID0gc3RyZWFtLlJlYWQoYnVmZmVy
echo LCAwLCBidWZmZXIuTGVuZ3RoKTsNCiAgICAgICAgICAgICAgICAgICAgaWYgKGJ5dGVzUmVhZCA8
echo PSAwKSByZXR1cm47DQoNCiAgICAgICAgICAgICAgICAgICAgc3RyaW5nIHJlcXVlc3RUZXh0ID0g
echo RW5jb2RpbmcuQVNDSUkuR2V0U3RyaW5nKGJ1ZmZlciwgMCwgYnl0ZXNSZWFkKTsNCiAgICAgICAg
echo ICAgICAgICAgICAgc3RyaW5nW10gbGluZXMgPSByZXF1ZXN0VGV4dC5TcGxpdChuZXcgc3RyaW5n
echo W10geyAiXHJcbiIgfSwgU3RyaW5nU3BsaXRPcHRpb25zLk5vbmUpOw0KICAgICAgICAgICAgICAg
echo ICAgICBpZiAobGluZXMuTGVuZ3RoID09IDApIHJldHVybjsNCg0KICAgICAgICAgICAgICAgICAg
echo ICBzdHJpbmdbXSBwYXJ0cyA9IGxpbmVzWzBdLlNwbGl0KCcgJyk7DQogICAgICAgICAgICAgICAg
echo ICAgIGlmIChwYXJ0cy5MZW5ndGggPCAyKSByZXR1cm47DQoNCiAgICAgICAgICAgICAgICAgICAg
echo c3RyaW5nIHJhd1VybCA9IHBhcnRzWzFdOw0KICAgICAgICAgICAgICAgICAgICBfbGFzdEFjdGl2
echo aXR5ID0gRGF0ZVRpbWUuVXRjTm93Ow0KDQogICAgICAgICAgICAgICAgICAgIGludCBxSWR4ID0g
echo cmF3VXJsLkluZGV4T2YoJz8nKTsNCiAgICAgICAgICAgICAgICAgICAgaWYgKHFJZHggPj0gMCkg
echo cmF3VXJsID0gcmF3VXJsLlN1YnN0cmluZygwLCBxSWR4KTsNCiAgICAgICAgICAgICAgICAgICAg
echo c3RyaW5nIGNsZWFuUGF0aCA9IHJhd1VybC5UcmltU3RhcnQoJy8nKTsNCiAgICAgICAgICAgICAg
echo ICAgICAgaWYgKHN0cmluZy5Jc051bGxPckVtcHR5KGNsZWFuUGF0aCkpIGNsZWFuUGF0aCA9ICJp
echo bmRleC5odG1sIjsNCg0KICAgICAgICAgICAgICAgICAgICBpZiAoY2xlYW5QYXRoLkVxdWFscygi
echo YXBpL3BpbmciLCBTdHJpbmdDb21wYXJpc29uLk9yZGluYWxJZ25vcmVDYXNlKSkNCiAgICAgICAg
echo ICAgICAgICAgICAgew0KICAgICAgICAgICAgICAgICAgICAgICAgX3NlZW5IZWFydGJlYXQgPSB0
echo cnVlOw0KICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZVtdIG9rID0gRW5jb2RpbmcuQVNDSUku
echo R2V0Qnl0ZXMoIkhUVFAvMS4xIDIwMCBPS1xyXG5Db250ZW50LVR5cGU6IHRleHQvcGxhaW5cclxu
echo Q29udGVudC1MZW5ndGg6IDJcclxuQ29ubmVjdGlvbjogY2xvc2VcclxuXHJcbk9LIik7DQogICAg
echo ICAgICAgICAgICAgICAgICAgICBzdHJlYW0uV3JpdGUob2ssIDAsIG9rLkxlbmd0aCk7DQogICAg
echo ICAgICAgICAgICAgICAgICAgICByZXR1cm47DQogICAgICAgICAgICAgICAgICAgIH0NCg0KICAg
echo ICAgICAgICAgICAgICAgICBpZiAoY2xlYW5QYXRoLkVxdWFscygiYXBpL3NodXRkb3duIiwgU3Ry
echo aW5nQ29tcGFyaXNvbi5PcmRpbmFsSWdub3JlQ2FzZSkpDQogICAgICAgICAgICAgICAgICAgIHsN
echo CiAgICAgICAgICAgICAgICAgICAgICAgIGJ5dGVbXSBieWUgPSBFbmNvZGluZy5BU0NJSS5HZXRC
echo eXRlcygiSFRUUC8xLjEgMjAwIE9LXHJcbkNvbnRlbnQtVHlwZTogdGV4dC9wbGFpblxyXG5Db250
echo ZW50LUxlbmd0aDogMlxyXG5Db25uZWN0aW9uOiBjbG9zZVxyXG5cclxuT0siKTsNCiAgICAgICAg
echo ICAgICAgICAgICAgICAgIHN0cmVhbS5Xcml0ZShieWUsIDAsIGJ5ZS5MZW5ndGgpOw0KICAgICAg
echo ICAgICAgICAgICAgICAgICAgbmV3IFRocmVhZCgoKSA9PiB7IFRocmVhZC5TbGVlcCg4MDApOyBf
echo cnVubmluZyA9IGZhbHNlOyB9KS5TdGFydCgpOw0KICAgICAgICAgICAgICAgICAgICAgICAgcmV0
echo dXJuOw0KICAgICAgICAgICAgICAgICAgICB9DQoNCiAgICAgICAgICAgICAgICAgICAgYnl0ZVtd
echo IGRhdGEgPSBudWxsOw0KICAgICAgICAgICAgICAgICAgICBpZiAoIV9tZW1vcnlGaWxlcy5UcnlH
echo ZXRWYWx1ZShjbGVhblBhdGgsIG91dCBkYXRhKSkNCiAgICAgICAgICAgICAgICAgICAgew0KICAg
echo ICAgICAgICAgICAgICAgICAgICAgc3RyaW5nIGFsdCA9IGNsZWFuUGF0aC5SZXBsYWNlKCcvJywg
echo J1xcJyk7DQogICAgICAgICAgICAgICAgICAgICAgICBpZiAoIV9tZW1vcnlGaWxlcy5UcnlHZXRW
echo YWx1ZShhbHQsIG91dCBkYXRhKSkNCiAgICAgICAgICAgICAgICAgICAgICAgIHsNCiAgICAgICAg
echo ICAgICAgICAgICAgICAgICAgICBpZiAoIVBhdGguSGFzRXh0ZW5zaW9uKGNsZWFuUGF0aCkpDQog
echo ICAgICAgICAgICAgICAgICAgICAgICAgICAgew0KICAgICAgICAgICAgICAgICAgICAgICAgICAg
echo ICAgICBfbWVtb3J5RmlsZXMuVHJ5R2V0VmFsdWUoImluZGV4Lmh0bWwiLCBvdXQgZGF0YSk7DQog
echo ICAgICAgICAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICAgICAgfQ0K
echo ICAgICAgICAgICAgICAgICAgICB9DQoNCiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgIT0g
echo bnVsbCkNCiAgICAgICAgICAgICAgICAgICAgew0KICAgICAgICAgICAgICAgICAgICAgICAgc3Ry
echo aW5nIG1pbWUgPSBHZXRNaW1lVHlwZShjbGVhblBhdGgpOw0KICAgICAgICAgICAgICAgICAgICAg
echo ICAgc3RyaW5nIGhlYWRlciA9IHN0cmluZy5Gb3JtYXQoDQogICAgICAgICAgICAgICAgICAgICAg
echo ICAgICAgIkhUVFAvMS4xIDIwMCBPS1xyXG5Db250ZW50LVR5cGU6IHswfVxyXG5Db250ZW50LUxl
echo bmd0aDogezF9XHJcbkNhY2hlLUNvbnRyb2w6IG5vLWNhY2hlXHJcbkFjY2Vzcy1Db250cm9sLUFs
echo bG93LU9yaWdpbjogKlxyXG5Db25uZWN0aW9uOiBjbG9zZVxyXG5cclxuIiwNCiAgICAgICAgICAg
echo ICAgICAgICAgICAgICAgICBtaW1lLCBkYXRhLkxlbmd0aA0KICAgICAgICAgICAgICAgICAgICAg
echo ICAgKTsNCiAgICAgICAgICAgICAgICAgICAgICAgIGJ5dGVbXSBoQnl0ZXMgPSBFbmNvZGluZy5B
echo U0NJSS5HZXRCeXRlcyhoZWFkZXIpOw0KICAgICAgICAgICAgICAgICAgICAgICAgc3RyZWFtLldy
echo aXRlKGhCeXRlcywgMCwgaEJ5dGVzLkxlbmd0aCk7DQogICAgICAgICAgICAgICAgICAgICAgICBz
echo dHJlYW0uV3JpdGUoZGF0YSwgMCwgZGF0YS5MZW5ndGgpOw0KICAgICAgICAgICAgICAgICAgICB9
echo DQogICAgICAgICAgICAgICAgICAgIGVsc2UNCiAgICAgICAgICAgICAgICAgICAgew0KICAgICAg
echo ICAgICAgICAgICAgICAgICAgYnl0ZVtdIG5vdEZvdW5kID0gRW5jb2RpbmcuQVNDSUkuR2V0Qnl0
echo ZXMoIkhUVFAvMS4xIDQwNCBOb3QgRm91bmRcclxuQ29udGVudC1UeXBlOiB0ZXh0L3BsYWluXHJc
echo bkNvbnRlbnQtTGVuZ3RoOiA5XHJcbkNvbm5lY3Rpb246IGNsb3NlXHJcblxyXG5Ob3QgRm91bmQi
echo KTsNCiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmVhbS5Xcml0ZShub3RGb3VuZCwgMCwgbm90
echo Rm91bmQuTGVuZ3RoKTsNCiAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgIH0N
echo CiAgICAgICAgICAgIH0NCiAgICAgICAgICAgIGNhdGNoIHsgfQ0KICAgICAgICAgICAgZmluYWxs
echo eQ0KICAgICAgICAgICAgew0KICAgICAgICAgICAgICAgIHRyeSB7IGNsaWVudC5DbG9zZSgpOyB9
echo IGNhdGNoIHsgfQ0KICAgICAgICAgICAgfQ0KICAgICAgICB9DQoNCiAgICAgICAgcHJpdmF0ZSBz
echo dGF0aWMgdm9pZCBMYXVuY2hCcm93c2VyKHN0cmluZyB1cmwpDQogICAgICAgIHsNCiAgICAgICAg
echo ICAgIHN0cmluZyBwcm9maWxlRGlyID0gUGF0aC5Db21iaW5lKA0KICAgICAgICAgICAgICAgIEVu
echo dmlyb25tZW50LkdldEZvbGRlclBhdGgoRW52aXJvbm1lbnQuU3BlY2lhbEZvbGRlci5Mb2NhbEFw
echo cGxpY2F0aW9uRGF0YSksDQogICAgICAgICAgICAgICAgIlNvaWxOYWlsRGVzaWduU3VpdGUxLjAi
echo LCAiUHJvZmlsZSINCiAgICAgICAgICAgICk7DQogICAgICAgICAgICB0cnkgeyBpZiAoIURpcmVj
echo dG9yeS5FeGlzdHMocHJvZmlsZURpcikpIERpcmVjdG9yeS5DcmVhdGVEaXJlY3RvcnkocHJvZmls
echo ZURpcik7IH0gY2F0Y2ggeyB9DQoNCiAgICAgICAgICAgIHN0cmluZ1tdIGVkZ2VQYXRocyA9IG5l
echo dyBzdHJpbmdbXQ0KICAgICAgICAgICAgew0KICAgICAgICAgICAgICAgIFBhdGguQ29tYmluZShF
echo bnZpcm9ubWVudC5HZXRGb2xkZXJQYXRoKEVudmlyb25tZW50LlNwZWNpYWxGb2xkZXIuUHJvZ3Jh
echo bUZpbGVzWDg2KSwgIk1pY3Jvc29mdFxcRWRnZVxcQXBwbGljYXRpb25cXG1zZWRnZS5leGUiKSwN
echo CiAgICAgICAgICAgICAgICBQYXRoLkNvbWJpbmUoRW52aXJvbm1lbnQuR2V0Rm9sZGVyUGF0aChF
echo bnZpcm9ubWVudC5TcGVjaWFsRm9sZGVyLlByb2dyYW1GaWxlcyksICJNaWNyb3NvZnRcXEVkZ2Vc
echo XEFwcGxpY2F0aW9uXFxtc2VkZ2UuZXhlIiksDQogICAgICAgICAgICAgICAgUGF0aC5Db21iaW5l
echo KEVudmlyb25tZW50LkdldEZvbGRlclBhdGgoRW52aXJvbm1lbnQuU3BlY2lhbEZvbGRlci5Mb2Nh
echo bEFwcGxpY2F0aW9uRGF0YSksICJNaWNyb3NvZnRcXEVkZ2VcXEFwcGxpY2F0aW9uXFxtc2VkZ2Uu
echo ZXhlIikNCiAgICAgICAgICAgIH07DQogICAgICAgICAgICBmb3JlYWNoIChzdHJpbmcgZWRnZSBp
echo biBlZGdlUGF0aHMpDQogICAgICAgICAgICB7DQogICAgICAgICAgICAgICAgaWYgKEZpbGUuRXhp
echo c3RzKGVkZ2UpKQ0KICAgICAgICAgICAgICAgIHsNCiAgICAgICAgICAgICAgICAgICAgdHJ5DQog
echo ICAgICAgICAgICAgICAgICAgIHsNCiAgICAgICAgICAgICAgICAgICAgICAgIFByb2Nlc3NTdGFy
echo dEluZm8gcHNpID0gbmV3IFByb2Nlc3NTdGFydEluZm8oKTsNCiAgICAgICAgICAgICAgICAgICAg
echo ICAgIHBzaS5GaWxlTmFtZSA9IGVkZ2U7DQogICAgICAgICAgICAgICAgICAgICAgICBwc2kuQXJn
echo dW1lbnRzID0gc3RyaW5nLkZvcm1hdCgiLS1hcHA9XCJ7MH1cIiAtLXdpbmRvdy1zaXplPTEzNjAs
echo ODgwIC0tdXNlci1kYXRhLWRpcj1cInsxfVwiIC0tbm8tZmlyc3QtcnVuIC0tbm8tZGVmYXVsdC1i
echo cm93c2VyLWNoZWNrIiwgdXJsLCBwcm9maWxlRGlyKTsNCiAgICAgICAgICAgICAgICAgICAgICAg
echo IHBzaS5Vc2VTaGVsbEV4ZWN1dGUgPSBmYWxzZTsNCiAgICAgICAgICAgICAgICAgICAgICAgIFBy
echo b2Nlc3MuU3RhcnQocHNpKTsNCiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjsNCiAgICAg
echo ICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICBjYXRjaCB7IH0NCiAgICAgICAg
echo ICAgICAgICB9DQogICAgICAgICAgICB9DQoNCiAgICAgICAgICAgIHN0cmluZ1tdIGNocm9tZVBh
echo dGhzID0gbmV3IHN0cmluZ1tdDQogICAgICAgICAgICB7DQogICAgICAgICAgICAgICAgUGF0aC5D
echo b21iaW5lKEVudmlyb25tZW50LkdldEZvbGRlclBhdGgoRW52aXJvbm1lbnQuU3BlY2lhbEZvbGRl
echo ci5Qcm9ncmFtRmlsZXMpLCAiR29vZ2xlXFxDaHJvbWVcXEFwcGxpY2F0aW9uXFxjaHJvbWUuZXhl
echo IiksDQogICAgICAgICAgICAgICAgUGF0aC5Db21iaW5lKEVudmlyb25tZW50LkdldEZvbGRlclBh
echo dGgoRW52aXJvbm1lbnQuU3BlY2lhbEZvbGRlci5Qcm9ncmFtRmlsZXNYODYpLCAiR29vZ2xlXFxD
echo aHJvbWVcXEFwcGxpY2F0aW9uXFxjaHJvbWUuZXhlIiksDQogICAgICAgICAgICAgICAgUGF0aC5D
echo b21iaW5lKEVudmlyb25tZW50LkdldEZvbGRlclBhdGgoRW52aXJvbm1lbnQuU3BlY2lhbEZvbGRl
echo ci5Mb2NhbEFwcGxpY2F0aW9uRGF0YSksICJHb29nbGVcXENocm9tZVxcQXBwbGljYXRpb25cXGNo
echo cm9tZS5leGUiKQ0KICAgICAgICAgICAgfTsNCiAgICAgICAgICAgIGZvcmVhY2ggKHN0cmluZyBj
echo aHJvbWUgaW4gY2hyb21lUGF0aHMpDQogICAgICAgICAgICB7DQogICAgICAgICAgICAgICAgaWYg
echo KEZpbGUuRXhpc3RzKGNocm9tZSkpDQogICAgICAgICAgICAgICAgew0KICAgICAgICAgICAgICAg
echo ICAgICB0cnkNCiAgICAgICAgICAgICAgICAgICAgew0KICAgICAgICAgICAgICAgICAgICAgICAg
echo UHJvY2Vzc1N0YXJ0SW5mbyBwc2kgPSBuZXcgUHJvY2Vzc1N0YXJ0SW5mbygpOw0KICAgICAgICAg
echo ICAgICAgICAgICAgICAgcHNpLkZpbGVOYW1lID0gY2hyb21lOw0KICAgICAgICAgICAgICAgICAg
echo ICAgICAgcHNpLkFyZ3VtZW50cyA9IHN0cmluZy5Gb3JtYXQoIi0tYXBwPVwiezB9XCIgLS13aW5k
echo b3ctc2l6ZT0xMzYwLDg4MCAtLXVzZXItZGF0YS1kaXI9XCJ7MX1cIiAtLW5vLWZpcnN0LXJ1biAt
echo LW5vLWRlZmF1bHQtYnJvd3Nlci1jaGVjayIsIHVybCwgcHJvZmlsZURpcik7DQogICAgICAgICAg
echo ICAgICAgICAgICAgICBwc2kuVXNlU2hlbGxFeGVjdXRlID0gZmFsc2U7DQogICAgICAgICAgICAg
echo ICAgICAgICAgICBQcm9jZXNzLlN0YXJ0KHBzaSk7DQogICAgICAgICAgICAgICAgICAgICAgICBy
echo ZXR1cm47DQogICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICAgICAgY2F0Y2gg
echo eyB9DQogICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgfQ0KDQogICAgICAgICAgICB0cnkN
echo CiAgICAgICAgICAgIHsNCiAgICAgICAgICAgICAgICBQcm9jZXNzLlN0YXJ0KHVybCk7DQogICAg
echo ICAgICAgICB9DQogICAgICAgICAgICBjYXRjaCAoRXhjZXB0aW9uIGV4KQ0KICAgICAgICAgICAg
echo ew0KICAgICAgICAgICAgICAgIFNob3dXYXJuaW5nKA0KICAgICAgICAgICAgICAgICAgICAiQ291
echo bGQgbm90IGxhdW5jaCBicm93c2VyIGF1dG9tYXRpY2FsbHkuXG5cblBsZWFzZSBvcGVuIHlvdXIg
echo d2ViIGJyb3dzZXIgYW5kIG5hdmlnYXRlIHRvOlxuIiArIHVybCArICJcblxuRXJyb3I6ICIgKyBl
echo eC5NZXNzYWdlLA0KICAgICAgICAgICAgICAgICAgICAiU29pbCBOYWlsIERlc2lnbiBTdWl0ZSAx
echo LjAgLSBCcm93c2VyIEVycm9yIg0KICAgICAgICAgICAgICAgICk7DQogICAgICAgICAgICB9DQog
echo ICAgICAgIH0NCg0KICAgICAgICBwcml2YXRlIHN0YXRpYyBzdHJpbmcgR2V0TWltZVR5cGUoc3Ry
echo aW5nIHBhdGgpDQogICAgICAgIHsNCiAgICAgICAgICAgIHN0cmluZyBleHQgPSBQYXRoLkdldEV4
echo dGVuc2lvbihwYXRoKS5Ub0xvd2VySW52YXJpYW50KCk7DQogICAgICAgICAgICBzd2l0Y2ggKGV4
echo dCkNCiAgICAgICAgICAgIHsNCiAgICAgICAgICAgICAgICBjYXNlICIuaHRtbCI6IHJldHVybiAi
echo dGV4dC9odG1sOyBjaGFyc2V0PXV0Zi04IjsNCiAgICAgICAgICAgICAgICBjYXNlICIuanMiOg0K
echo ICAgICAgICAgICAgICAgIGNhc2UgIi5tanMiOiByZXR1cm4gImFwcGxpY2F0aW9uL2phdmFzY3Jp
echo cHQ7IGNoYXJzZXQ9dXRmLTgiOw0KICAgICAgICAgICAgICAgIGNhc2UgIi5jc3MiOiByZXR1cm4g
echo InRleHQvY3NzOyBjaGFyc2V0PXV0Zi04IjsNCiAgICAgICAgICAgICAgICBjYXNlICIuanNvbiI6
echo IHJldHVybiAiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCI7DQogICAgICAgICAgICAg
echo ICAgY2FzZSAiLnN2ZyI6IHJldHVybiAiaW1hZ2Uvc3ZnK3htbCI7DQogICAgICAgICAgICAgICAg
echo Y2FzZSAiLnBuZyI6IHJldHVybiAiaW1hZ2UvcG5nIjsNCiAgICAgICAgICAgICAgICBjYXNlICIu
echo anBnIjoNCiAgICAgICAgICAgICAgICBjYXNlICIuanBlZyI6IHJldHVybiAiaW1hZ2UvanBlZyI7
echo DQogICAgICAgICAgICAgICAgY2FzZSAiLmljbyI6IHJldHVybiAiaW1hZ2UveC1pY29uIjsNCiAg
echo ICAgICAgICAgICAgICBjYXNlICIud29mZiI6IHJldHVybiAiZm9udC93b2ZmIjsNCiAgICAgICAg
echo ICAgICAgICBjYXNlICIud29mZjIiOiByZXR1cm4gImZvbnQvd29mZjIiOw0KICAgICAgICAgICAg
echo ICAgIGNhc2UgIi50dGYiOiByZXR1cm4gImZvbnQvdHRmIjsNCiAgICAgICAgICAgICAgICBjYXNl
echo ICIud2FzbSI6IHJldHVybiAiYXBwbGljYXRpb24vd2FzbSI7DQogICAgICAgICAgICAgICAgY2Fz
echo ZSAiLndlYnAiOiByZXR1cm4gImltYWdlL3dlYnAiOw0KICAgICAgICAgICAgICAgIGRlZmF1bHQ6
echo IHJldHVybiAiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtIjsNCiAgICAgICAgICAgIH0NCiAgICAg
echo ICAgfQ0KICAgIH0NCn0NCg==
echo -----END CERTIFICATE-----
)
certutil -f -decode "%~1" "%~2" >nul 2>nul
del /f /q "%~1" >nul 2>nul
exit /b 0

:finish
popd
if "%NO_PAUSE%"=="0" pause
