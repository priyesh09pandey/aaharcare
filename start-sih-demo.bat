@echo off
title AaharCare - SIH Final Round Demo Server
color 0A
cls
echo ======================================================================
echo                 AAHARCARE - SIH FINAL ROUND DEMO
echo ======================================================================
echo.
echo [1/2] Setting up runtime environment...
set "PATH=%USERPROFILE%\AppData\Local\Microsoft\WinGet\Packages\Oven-sh.Bun_Microsoft.Winget.Source_8wekyb3d8bbwe\bun-windows-x64;%USERPROFILE%\AppData\Local\Microsoft\WinGet\Links;%PATH%"

echo [2/2] Launching AaharCare on Localhost and Local Wi-Fi Network...
echo.
echo ----------------------------------------------------------------------
echo  - Presentation Laptop: http://localhost:8080
echo  - Judges' Mobile / Laptop: Use the Network URL shown below
echo ----------------------------------------------------------------------
echo.

bun run dev --host

pause
