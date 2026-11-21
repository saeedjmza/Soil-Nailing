@echo off
setlocal
title Soil Nail Design Suite 1.0 - Instant Offline Desktop App
echo ======================================================================
echo    AASHTO & FHWA Soil Nail Design Suite 1.0
echo    Instant Offline Desktop Launcher (100%% Offline)
echo ======================================================================
echo.
cd /d "%~dp0"

if exist "release\SoilNailDesignSuite1.0.exe" (
    echo Launching standalone executable...
    start "" "release\SoilNailDesignSuite1.0.exe"
    exit /b 0
)

set "INDEX_PATH=%~dp0dist\index.html"
if not exist "%INDEX_PATH%" set "INDEX_PATH=%~dp0resources\dist\index.html"
if not exist "%INDEX_PATH%" (
    echo [ERROR] Web distribution files not found. Run npm run build first.
    pause
    exit /b 1
)

set "APP_URL=file:///%INDEX_PATH:\=/%"
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app="%APP_URL%" --allow-file-access-from-files --window-size=1360,880
    exit /b 0
)
if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" --app="%APP_URL%" --allow-file-access-from-files --window-size=1360,880
    exit /b 0
)
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app="%APP_URL%" --allow-file-access-from-files --window-size=1360,880
    exit /b 0
)
start "" "%INDEX_PATH%"
exit /b 0
