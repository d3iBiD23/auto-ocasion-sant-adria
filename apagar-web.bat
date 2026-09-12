@echo off
setlocal EnableExtensions
set "PROJECT=%~dp0"
cd /d "%PROJECT%"

echo.
echo  Deteniendo Auto Ocasión Sant Adria...

for /f "tokens=5" %%P in ('netstat -ano ^| findstr /r /c:":8080 .*LISTENING"') do taskkill /PID %%P /F >nul 2>&1
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /r /c:":5173 .*LISTENING"') do taskkill /PID %%P /F >nul 2>&1
docker compose stop >nul 2>&1

echo  Web, API y MySQL detenidos.
echo  Docker Desktop se mantiene abierto para que el próximo inicio sea inmediato.
exit /b 0
