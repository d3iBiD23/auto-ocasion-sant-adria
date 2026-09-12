@echo off
setlocal EnableExtensions
set "PROJECT=%~dp0"

REM El script PowerShell gestiona Docker, MySQL, API y Vite. También corrige
REM automáticamente una web que hubiera quedado limitada a 127.0.0.1.
powershell -NoProfile -ExecutionPolicy Bypass -File "%PROJECT%iniciar-web.ps1"
exit /b %errorlevel%
