@echo off
setlocal EnableExtensions
title Soil Nail Design Suite 1.0 - Offline Android Builder ^& APK Tool
echo ======================================================================
echo    AASHTO ^& FHWA Soil Nail Design Suite 1.0
echo    Offline Android App Packager ^& APK Builder
echo ======================================================================
echo.

pushd "%~dp0"
if not exist "release" mkdir "release"
if not exist "release\Android_Offline_PWA" mkdir "release\Android_Offline_PWA"

echo [Step 1] Packaging 100%% Offline Android WebApp ^(No Internet / No Extra Tools^)...
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

if exist "release\SoilNailDesignSuite1.0-Offline.html" (
    echo [OK] Created release\SoilNailDesignSuite1.0-Offline.html
    echo      Copy this single file to your Android phone and open it in Chrome/Browser!
    echo      It runs 100%% OFFLINE without internet or Google Play.
)
if exist "release\Android_Offline_PWA\index.html" (
    echo [OK] Created release\Android_Offline_PWA\ ^(Full PWA Assets + Icons^)
)

echo.
echo [Step 2] Checking if native Android SDK is available for *.APK compilation...
set "HAS_SDK=0"
where node >nul 2>nul
if not errorlevel 1 (
    where java >nul 2>nul
    if not errorlevel 1 (
        if "%ANDROID_HOME%"=="" if exist "%LOCALAPPDATA%\Android\Sdk" set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
        if "%ANDROID_HOME%"=="" if exist "%USERPROFILE%\AppData\Local\Android\Sdk" set "ANDROID_HOME=%USERPROFILE%\AppData\Local\Android\Sdk"
        if "%ANDROID_HOME%"=="" if exist "%USERPROFILE%\Android\Sdk" set "ANDROID_HOME=%USERPROFILE%\Android\Sdk"
        if "%ANDROID_HOME%"=="" if exist "C:\Android\Sdk" set "ANDROID_HOME=C:\Android\Sdk"
        if "%ANDROID_HOME%"=="" if exist "D:\Android\Sdk" set "ANDROID_HOME=D:\Android\Sdk"
        if "%ANDROID_HOME%"=="" if exist "%USERPROFILE%\.bubblewrap\android_sdk" set "ANDROID_HOME=%USERPROFILE%\.bubblewrap\android_sdk"
        if not "%ANDROID_HOME%"=="" set "HAS_SDK=1"
    )
)

if "%HAS_SDK%"=="1" (
    echo [INFO] Android SDK found at %ANDROID_HOME%
    echo        Proceeding to build release\SoilNailDesignSuite1.0.apk...
    goto :opt_capacitor
)

echo.
echo [NOTE] Android Studio / Android SDK is NOT installed on this PC.
echo        Windows cannot compile a signed binary *.APK without Android SDK tools.
echo        However, release\SoilNailDesignSuite1.0-Offline.html works 100%% offline on Android NOW!
echo.
echo  Optional tools to also produce a signed *.APK installer file:
echo   [1] Exit and open release\ folder ^(Use SoilNailDesignSuite1.0-Offline.html on Android^)
echo   [2] Auto-Build Signed TWA APK with Bubblewrap ^(Downloads SDK once via Internet^)
echo   [3] Generate Signed APK Online in 30 Seconds ^(Microsoft PWABuilder^)
echo   [4] Download Prebuilt *.APK from GitHub Releases
echo   [5] Open Android Installation Guide ^(README_ANDROID_APP.md^)
echo.
set "CHOICE=1"
set /p "CHOICE=Enter choice [1-5, Default is 1]: "
if "%CHOICE%"=="2" goto :opt_bubblewrap
if "%CHOICE%"=="3" goto :opt_pwabuilder
if "%CHOICE%"=="4" goto :opt_github
if "%CHOICE%"=="5" goto :opt_webapk

explorer "%~dp0release" >nul 2>nul
goto :done

:opt_capacitor
if not exist "node_modules" (
    call npm install --no-audit --no-fund
)
if not exist "dist\index.html" (
    call npm run build
)
if not exist "capacitor.config.json" (
    > capacitor.config.json (
        echo {
        echo   "appId": "com.geomechanics.soilnail",
        echo   "appName": "Soil Nail Design Suite",
        echo   "webDir": "dist",
        echo   "bundledWebRuntime": false
        echo }
    )
)
call npm list @capacitor/android >nul 2>nul
if errorlevel 1 (
    call npm install --no-save @capacitor/core @capacitor/cli @capacitor/android
)
if not exist "android" (
    call npx cap add android
) else (
    call npx cap sync android
)
if exist "public\app-icon.png" (
    if not exist "android\app\src\main\res\mipmap-xxxhdpi" mkdir "android\app\src\main\res\mipmap-xxxhdpi"
    copy /y "public\app-icon.png" "android\app\src\main\res\mipmap-xxxhdpi\ic_launcher.png" >nul 2>nul
)
if exist "android\gradlew.bat" (
    pushd "android"
    call gradlew.bat assembleDebug
    set "GRADLE_ERR=%ERRORLEVEL%"
    popd
    if "%GRADLE_ERR%"=="0" if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
        copy /y "android\app\build\outputs\apk\debug\app-debug.apk" "release\SoilNailDesignSuite1.0.apk" >nul
        echo [SUCCESS] Built release\SoilNailDesignSuite1.0.apk
        explorer /select,"%~dp0release\SoilNailDesignSuite1.0.apk" >nul 2>nul
        goto :done
    )
)
echo [WARN] Local Gradle APK build did not complete; offline package is ready in release\.
goto :done

:opt_bubblewrap
if not exist "build\android-twa" mkdir "build\android-twa"
pushd "build\android-twa"
call npx --yes @bubblewrap/cli init --manifest="https://ais-pre-ngd2bk2rvmsm7bvtk2evdd-655471265608.europe-west2.run.app/manifest.webmanifest"
call npx --yes @bubblewrap/cli build
if exist "app-release-signed.apk" (
    copy /y "app-release-signed.apk" "..\..\release\SoilNailDesignSuite1.0.apk" >nul
    echo [SUCCESS] Built release\SoilNailDesignSuite1.0.apk
    explorer /select,"%~dp0release\SoilNailDesignSuite1.0.apk" >nul 2>nul
)
popd
goto :done

:opt_pwabuilder
start "" "https://www.pwabuilder.com/?url=https%%3A%%2F%%2Fais-pre-ngd2bk2rvmsm7bvtk2evdd-655471265608.europe-west2.run.app"
goto :done

:opt_github
start "" "https://github.com/saeedjmza/Soil-Nailing/releases"
goto :done

:opt_webapk
if exist "README_ANDROID_APP.md" start notepad "README_ANDROID_APP.md"

:done
popd
pause
