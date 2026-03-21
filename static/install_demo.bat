@echo off
setlocal
title X2CNet Interactive Demo - One-Click Installer
echo ============================================
echo   X2CNet Real-Time Interactive Demo
echo   One-Click Installer
echo ============================================
echo.

set "INSTALL_DIR=%USERPROFILE%\Interactive_Ameca"

echo [1/3] Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Install Python 3.10+ from https://python.org
    pause
    exit /b 1
)
echo       OK

echo [2/3] Cloning repository...
if exist "%INSTALL_DIR%\realtime_mimicry.py" (
    echo       Found existing install, updating...
    cd /d "%INSTALL_DIR%" && git pull
) else (
    git clone https://github.com/futabanov16/Interactive_Ameca.git "%INSTALL_DIR%"
    cd /d "%INSTALL_DIR%"
)
echo       OK

echo [3/3] Running setup (install deps + download weights)...
call "%INSTALL_DIR%\setup.bat"

echo.
echo ============================================
echo   Starting demo...
echo   Keep a straight face for calibration!
echo ============================================
echo.
call "%INSTALL_DIR%\run.bat"
