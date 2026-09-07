Add-Type -AssemblyName System.Drawing

$resDir = "c:\Users\menta\OneDrive\Documents\Tarotxofficial\android-admin\app\src\main\res"
$logoPath = "c:\Users\menta\OneDrive\Documents\Tarotxofficial\public\logo.jpg"

$logo = [System.Drawing.Image]::FromFile($logoPath)
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 15, 15, 15))

$densities = @(
    @{ name = "mipmap-mdpi";    iconSize = 48;  fgSize = 108 },
    @{ name = "mipmap-hdpi";    iconSize = 72;  fgSize = 162 },
    @{ name = "mipmap-xhdpi";   iconSize = 96;  fgSize = 216 },
    @{ name = "mipmap-xxhdpi";  iconSize = 144; fgSize = 324 },
    @{ name = "mipmap-xxxhdpi"; iconSize = 192; fgSize = 432 }
)

foreach ($d in $densities) {
    $targetDir = Join-Path $resDir $d.name
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }

    # Remove old webp files
    Get-ChildItem -Path $targetDir -Filter "ic_launcher*.webp" | Remove-Item -Force

    # 1. Standard square launcher icon (ic_launcher.png)
    $size = $d.iconSize
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::FromArgb(255, 15, 15, 15))
    $g.DrawImage($logo, 0, 0, $size, $size)
    $g.Dispose()
    $bmp.Save((Join-Path $targetDir "ic_launcher.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()

    # 2. Circular launcher icon (ic_launcher_round.png)
    $bmpRound = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gRound = [System.Drawing.Graphics]::FromImage($bmpRound)
    $gRound.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gRound.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gRound.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $gRound.Clear([System.Drawing.Color]::Transparent)

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddEllipse(0, 0, $size, $size)
    $gRound.SetClip($path)
    $gRound.FillRectangle($bgBrush, 0, 0, $size, $size)
    $inset = [Math]::Round($size * 0.05)
    $logoSize = $size - (2 * $inset)
    $gRound.DrawImage($logo, $inset, $inset, $logoSize, $logoSize)
    $gRound.ResetClip()
    $path.Dispose()
    $gRound.Dispose()
    $bmpRound.Save((Join-Path $targetDir "ic_launcher_round.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpRound.Dispose()

    # 3. Adaptive foreground (ic_launcher_foreground.png)
    $fgSize = $d.fgSize
    $bmpFg = New-Object System.Drawing.Bitmap($fgSize, $fgSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gFg = [System.Drawing.Graphics]::FromImage($bmpFg)
    $gFg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gFg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gFg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $gFg.Clear([System.Drawing.Color]::Transparent)
    
    # Scale logo to ~70% so it's comfortably inside the 72dp safe area
    $fgLogoSize = [Math]::Round($fgSize * 0.70)
    $fgOffset = [Math]::Round(($fgSize - $fgLogoSize) / 2)
    $gFg.DrawImage($logo, $fgOffset, $fgOffset, $fgLogoSize, $fgLogoSize)
    $gFg.Dispose()
    $bmpFg.Save((Join-Path $targetDir "ic_launcher_foreground.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpFg.Dispose()

    Write-Output "Generated icons for $($d.name): ic_launcher ($size x $size), ic_launcher_round ($size x $size), ic_launcher_foreground ($fgSize x $fgSize)"
}

$bgBrush.Dispose()
$logo.Dispose()
Write-Output "All icons successfully generated!"
