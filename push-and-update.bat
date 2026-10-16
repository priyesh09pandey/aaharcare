@echo off
title AaharCare - Update GitHub & Vercel
color 0B
cls
echo ======================================================================
echo        AAHARCARE - PUSH FIXES TO GITHUB ^& VERCEL
echo ======================================================================
echo.
echo [1/3] Adding all updated files...
set "PATH=%USERPROFILE%\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd;%USERPROFILE%\AppData\Local\Microsoft\WinGet\Packages\GitHub.cli_Microsoft.Winget.Source_8wekyb3d8bbwe;%PATH%"

git add .

echo.
echo [2/3] Committing fixes...
git commit -m "update: sync latest features and fixes"

echo.
echo [3/3] Pushing to GitHub (origin main)...
git push origin main

echo.
echo ======================================================================
echo  SUCCESS! Changes pushed to https://github.com/priyesh09pandey/aaharcare
echo  Vercel is now automatically rebuilding and deploying your live site!
echo ======================================================================
echo.
pause
