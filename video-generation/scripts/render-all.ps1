# Script de automatización para renderizar todas las composiciones de video
# Uso: .\scripts\render-all.ps1

param(
    [switch]$Clean = $false,
    [switch]$Verbose = $false
)

Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  EcoFIng - HyperFrames Batch Renderer         ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en la carpeta correcta
if (-not (Test-Path ".\hyperframes.json")) {
    Write-Host "❌ Error: Este script debe ejecutarse desde la carpeta video-generation/" -ForegroundColor Red
    exit 1
}

# Verificar FFmpeg
Write-Host "🔍 Verificando dependencias..." -ForegroundColor Yellow
try {
    $ffmpegVersion = ffmpeg -version 2>&1 | Select-Object -First 1
    Write-Host "✅ FFmpeg instalado: $ffmpegVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ FFmpeg no encontrado. Instalar con: winget install ffmpeg" -ForegroundColor Red
    exit 1
}

# Limpiar output anterior si se especifica
if ($Clean) {
    Write-Host ""
    Write-Host "🧹 Limpiando carpeta output/..." -ForegroundColor Yellow
    if (Test-Path ".\output") {
        Remove-Item ".\output\*" -Force -Recurse
        Write-Host "✅ Carpeta output/ limpiada" -ForegroundColor Green
    }
}

# Obtener lista de composiciones
Write-Host ""
Write-Host "📁 Buscando composiciones..." -ForegroundColor Yellow
$composiciones = Get-ChildItem -Path ".\compositions" -Filter "*.html" -File

if ($composiciones.Count -eq 0) {
    Write-Host "⚠️  No se encontraron composiciones en compositions/" -ForegroundColor Yellow
    exit 0
}

Write-Host "✅ Encontradas $($composiciones.Count) composiciones:" -ForegroundColor Green
foreach ($comp in $composiciones) {
    Write-Host "   - $($comp.Name)" -ForegroundColor Cyan
}

# Renderizar cada composición
Write-Host ""
Write-Host "🎬 Iniciando renderizado..." -ForegroundColor Yellow
Write-Host ""

$exitosos = 0
$fallidos = 0

foreach ($comp in $composiciones) {
    $nombre = $comp.BaseName
    $ruta = $comp.FullName

    Write-Host "──────────────────────────────────────────────────" -ForegroundColor Gray
    Write-Host "📹 Renderizando: $($comp.Name)" -ForegroundColor Cyan

    # Construir comando
    $comando = "npx hyperframes render --composition=`"$ruta`""
    if ($Verbose) {
        $comando += " --verbose"
    }

    # Ejecutar renderizado
    try {
        $inicio = Get-Date
        Invoke-Expression $comando

        if ($LASTEXITCODE -eq 0) {
            $duracion = (Get-Date) - $inicio
            Write-Host "✅ Renderizado exitoso en $($duracion.TotalSeconds.ToString('0.0'))s" -ForegroundColor Green
            $exitosos++
        } else {
            Write-Host "❌ Error en el renderizado (código: $LASTEXITCODE)" -ForegroundColor Red
            $fallidos++
        }
    } catch {
        Write-Host "❌ Error: $_" -ForegroundColor Red
        $fallidos++
    }

    Write-Host ""
}

# Resumen final
Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Resumen de Renderizado                        ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Exitosos:  $exitosos" -ForegroundColor Green
Write-Host "❌ Fallidos:  $fallidos" -ForegroundColor Red
Write-Host "📊 Total:     $($composiciones.Count)" -ForegroundColor Cyan
Write-Host ""

# Listar videos generados
if (Test-Path ".\output") {
    $videos = Get-ChildItem -Path ".\output" -Filter "*.mp4" -File
    if ($videos.Count -gt 0) {
        Write-Host "📦 Videos generados en output/:" -ForegroundColor Yellow
        foreach ($video in $videos) {
            $tamanio = [math]::Round($video.Length / 1MB, 2)
            Write-Host "   - $($video.Name) ($tamanio MB)" -ForegroundColor Cyan
        }
        Write-Host ""
    }
}

# Copiar a la app (opcional)
if ($exitosos -gt 0) {
    Write-Host "💡 Para usar los videos en la app, ejecuta:" -ForegroundColor Yellow
    Write-Host "   Copy-Item .\output\*.mp4 ..\app\public\videos\" -ForegroundColor Cyan
    Write-Host ""
}

exit 0
