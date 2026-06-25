Add-Type -AssemblyName System.Drawing

$sourceDir = "c:\Users\Lenovo\Desktop\belgesem\assets\new_photos"
$webDir = "c:\Users\Lenovo\Desktop\belgesem\assets\web"
$mobileDir = "c:\Users\Lenovo\Desktop\belgesem\assets\mobile"

New-Item -ItemType Directory -Force -Path $webDir | Out-Null
New-Item -ItemType Directory -Force -Path $mobileDir | Out-Null

$files = Get-ChildItem -Path $sourceDir -Filter *.jpg
foreach ($file in $files) {
    Write-Host "Processing $($file.Name)..."
    try {
        $img = [System.Drawing.Image]::FromFile($file.FullName)
        
        # Web: max 1200 width
        $webWidth = 1200
        if ($img.Width -gt $webWidth) {
            $webHeight = [math]::Round($img.Height * ($webWidth / $img.Width))
        } else {
            $webWidth = $img.Width
            $webHeight = $img.Height
        }
        $bmpWeb = New-Object System.Drawing.Bitmap($webWidth, $webHeight)
        $gWeb = [System.Drawing.Graphics]::FromImage($bmpWeb)
        $gWeb.DrawImage($img, 0, 0, $webWidth, $webHeight)
        $webPath = Join-Path $webDir $file.Name
        $bmpWeb.Save($webPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
        $gWeb.Dispose()
        $bmpWeb.Dispose()
        
        # Mobile: max 600 width
        $mobWidth = 600
        if ($img.Width -gt $mobWidth) {
            $mobHeight = [math]::Round($img.Height * ($mobWidth / $img.Width))
        } else {
            $mobWidth = $img.Width
            $mobHeight = $img.Height
        }
        $bmpMob = New-Object System.Drawing.Bitmap($mobWidth, $mobHeight)
        $gMob = [System.Drawing.Graphics]::FromImage($bmpMob)
        $gMob.DrawImage($img, 0, 0, $mobWidth, $mobHeight)
        $mobPath = Join-Path $mobileDir $file.Name
        $bmpMob.Save($mobPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
        $gMob.Dispose()
        $bmpMob.Dispose()
        
        $img.Dispose()
    } catch {
        Write-Host "Error processing $($file.Name): $_"
    }
}
Write-Host "Done!"
