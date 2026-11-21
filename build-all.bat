@echo off
setlocal EnableExtensions
title Soil Nail Design Suite 1.0 - Unified Offline Windows ^& Android Builder
echo ======================================================================
echo    AASHTO ^& FHWA Soil Nail Design Suite 1.0
echo    1-Click Offline Builder: Windows (*.EXE) + Android Offline Package
echo ======================================================================
echo.

pushd "%~dp0"

echo [Part 1/2] Building Windows Portable Executable ^(release\SoilNailDesignSuite1.0.exe^)...
call "%~dp0build-portable-exe.bat" --nopause

echo.
echo [Part 2/2] Packaging Offline Android Version ^(release\^)...
if not exist "release" mkdir "release"
if not exist "release\Android_Offline_PWA" mkdir "release\Android_Offline_PWA"

if exist "dist-singlefile\index.html" (
    copy /y "dist-singlefile\index.html" "release\SoilNailDesignSuite1.0-Offline.html" >nul
) else if exist "resources\SoilNail_Design_Suite_Offline.html" (
    copy /y "resources\SoilNail_Design_Suite_Offline.html" "release\SoilNailDesignSuite1.0-Offline.html" >nul
)

if exist "dist\index.html" (
    xcopy /e /i /y "dist" "release\Android_Offline_PWA" >nul
) else if exist "resources\dist\index.html" (
    xcopy /e /i /y "resources\dist" "release\Android_Offline_PWA" >nul
)

if not "%ANDROID_HOME%"=="" (
    echo [INFO] Android SDK detected; building native APK too...
    call "%~dp0build-apk.bat"
) else if exist "%LOCALAPPDATA%\Android\Sdk" (
    echo [INFO] Android SDK detected; building native APK too...
    call "%~dp0build-apk.bat"
)

echo.
echo ======================================================================
echo   BUILD COMPLETE - Output Folder: %~dp0release\
echo ======================================================================
if exist "release\SoilNailDesignSuite1.0.exe" echo   [OK] Windows EXE     : release\SoilNailDesignSuite1.0.exe
if exist "release\SoilNailDesignSuite1.0-Offline.html" echo   [OK] Offline App HTML: release\SoilNailDesignSuite1.0-Offline.html ^(Windows ^& Android^)
if exist "release\Android_Offline_PWA\index.html" echo   [OK] Android PWA Dir : release\Android_Offline_PWA\
if exist "release\SoilNailDesignSuite1.0.apk" echo   [OK] Android APK     : release\SoilNailDesignSuite1.0.apk
echo.
echo   Note: Copy SoilNailDesignSuite1.0-Offline.html to your Android phone
echo         to run the complete latest version 100%% offline without internet.
echo ======================================================================

explorer "%~dp0release" >nul 2>nul
popd
pause
