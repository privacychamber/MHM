Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "..\public\logo.png"
$appIcoPath = Join-Path $PSScriptRoot "..\src\app\favicon.ico"
$pubIcoPath = Join-Path $PSScriptRoot "..\public\favicon.ico"
$appPngPath = Join-Path $PSScriptRoot "..\src\app\icon.png"
$pubPngPath = Join-Path $PSScriptRoot "..\public\icon.png"
$applePngPath = Join-Path $PSScriptRoot "..\public\apple-touch-icon.png"

$src = [System.Drawing.Image]::FromFile($srcPath)

# 1. Save 32x32 and 192x192 PNG
$sizes = @(16, 32, 48, 64, 128, 192, 256)
$bitmaps = @()

foreach ($sz in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($sz, $sz, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($src, 0, 0, $sz, $sz)
    $g.Dispose()
    $bitmaps += $bmp

    if ($sz -eq 192) {
        $bmp.Save($appPngPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Save($pubPngPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Save($applePngPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
}

# 2. Write ICO format with multiple resolutions (32x32 primary)
# For standard ICO, let's write 16, 32, 48, 64, 128, 256 PNG frames
$fs = [System.IO.File]::Create($appIcoPath)
$bw = New-Object System.IO.BinaryWriter($fs)

# ICONDIR header: 2 bytes reserved (0), 2 bytes type (1=icon), 2 bytes count
$bw.Write([UInt16]0)
$bw.Write([UInt16]1)
$bw.Write([UInt16]$sizes.Count)

$msList = @()
foreach ($bmp in $bitmaps) {
    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $msList += $ms
}

# Calculate offsets
$headerSize = 6 + (16 * $sizes.Count)
$currentOffset = $headerSize

for ($i = 0; $i -lt $sizes.Count; $i++) {
    $sz = $sizes[$i]
    $ms = $msList[$i]
    $dataLen = [UInt32]$ms.Length

    # bWidth, bHeight (0 means 256)
    $wByte = if ($sz -ge 256) { [Byte]0 } else { [Byte]$sz }
    $hByte = if ($sz -ge 256) { [Byte]0 } else { [Byte]$sz }

    $bw.Write($wByte)
    $bw.Write($hByte)
    $bw.Write([Byte]0) # bColorCount
    $bw.Write([Byte]0) # bReserved
    $bw.Write([UInt16]1) # wPlanes
    $bw.Write([UInt16]32) # wBitCount
    $bw.Write($dataLen) # dwBytesInRes
    $bw.Write([UInt32]$currentOffset) # dwImageOffset

    $currentOffset += $dataLen
}

# Write image data
foreach ($ms in $msList) {
    $bytes = $ms.ToArray()
    $bw.Write($bytes, 0, $bytes.Length)
    $ms.Dispose()
}

$bw.Flush()
$bw.Close()
$fs.Close()

# Copy to public/favicon.ico
Copy-Item $appIcoPath $pubIcoPath -Force

# Dispose bitmaps
foreach ($bmp in $bitmaps) {
    $bmp.Dispose()
}
$src.Dispose()

Write-Output "Favicon and icon files generated successfully!"
Write-Output ("App favicon size: " + (Get-Item $appIcoPath).Length + " bytes")
Write-Output ("Public favicon size: " + (Get-Item $pubIcoPath).Length + " bytes")
Write-Output ("Icon png size: " + (Get-Item $appPngPath).Length + " bytes")
