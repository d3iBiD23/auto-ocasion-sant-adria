$ErrorActionPreference = 'Stop'

# Ejecuta este archivo con PowerShell para iniciar todo el entorno local.
$projectRoot = $PSScriptRoot
$dockerPipe = '\\.\pipe\dockerDesktopLinuxEngine'

$dockerDesktop = 'C:\Program Files\Docker\Docker\Docker Desktop.exe'
if (-not (Test-Path -LiteralPath $dockerDesktop)) {
    throw 'No se ha encontrado Docker Desktop en este equipo.'
}

# Tras un apagado anómalo, algunos sockets AF_UNIX de Docker quedan corruptos
# y Windows no permite borrarlos. Se apartan las carpetas temporales completas
# (sin tocar imágenes, contenedores ni volúmenes) y Docker las recrea limpias.
if (-not (Test-Path -LiteralPath $dockerPipe)) {
    Get-Process -Name 'Docker Desktop', 'com.docker.backend', 'docker' -ErrorAction SilentlyContinue |
        Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2

    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $runFolder = "$env:LOCALAPPDATA\Docker\run"
    $secretsFolder = "$env:LOCALAPPDATA\docker-secrets-engine"
    if (Test-Path -LiteralPath $runFolder) {
        Rename-Item -LiteralPath $runFolder -NewName "run.recovered-$stamp"
    }
    if (Test-Path -LiteralPath $secretsFolder) {
        Rename-Item -LiteralPath $secretsFolder -NewName "docker-secrets-engine.recovered-$stamp"
    }
    New-Item -ItemType Directory -Path $runFolder -Force | Out-Null
    New-Item -ItemType Directory -Path $secretsFolder -Force | Out-Null
    Start-Process -FilePath $dockerDesktop -WindowStyle Hidden
}

$deadline = (Get-Date).AddMinutes(2)
do {
    if (Test-Path -LiteralPath $dockerPipe) { break }
    Start-Sleep -Seconds 3
} while ((Get-Date) -lt $deadline)
if (-not (Test-Path -LiteralPath $dockerPipe)) {
    throw 'Docker Desktop no ha terminado de iniciar. Abre Docker Desktop y vuelve a ejecutar este archivo.'
}

Set-Location $projectRoot
docker compose up -d

$backendPort = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
if (-not $backendPort) {
    Start-Process -FilePath 'mvn.cmd' -ArgumentList 'spring-boot:run' -WorkingDirectory "$projectRoot\backend" -WindowStyle Hidden
}

if (-not (Test-Path -LiteralPath "$projectRoot\frontend\node_modules")) {
    & npm.cmd install --prefix "$projectRoot\frontend"
}
$frontendPort = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue
if ($frontendPort -and ($frontendPort | Where-Object { $_.LocalAddress -notin '0.0.0.0', '::' })) {
    $frontendPort | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object {
        Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
    }
    $frontendPort = $null
}
if (-not $frontendPort) {
    Start-Process -FilePath 'npm.cmd' -ArgumentList 'run', 'dev', '--', '--host', '0.0.0.0' -WorkingDirectory "$projectRoot\frontend" -WindowStyle Hidden
}

Write-Host 'Iniciando Auto Ocasion Sant Adria...'
$lanAddress = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Where-Object {
        $_.IPAddress -notlike '127.*' -and
        $_.IPAddress -notlike '169.254.*' -and
        $_.InterfaceAlias -notlike 'vEthernet*'
    } |
    Select-Object -First 1 -ExpandProperty IPAddress
if ($lanAddress) {
    Write-Host "Desde un movil en la misma Wi-Fi abre: http://${lanAddress}:5173"
}
Start-Process 'http://127.0.0.1:5173'
