$content = Get-Content "c:\Users\Lenovo\Desktop\belgesem\galeri.html" -Raw

$photos = Get-ChildItem "c:\Users\Lenovo\Desktop\belgesem\assets\web" -Filter *.jpg | Select-Object -ExpandProperty Name
$htmlToInsert = ""
foreach ($p in $photos) {
    $webPath = "assets/web/$p"
    $mobilePath = "assets/mobile/$p"
    # Create HTML
    $htmlToInsert += "                    <div class=`"bento-item`"><img src=`"$webPath`" srcset=`"$mobilePath 600w, $webPath 1200w`" sizes=`"(max-width: 768px) 100vw, 1200px`" alt=`"Eğitim Galerisi`" loading=`"lazy`"></div>`r`n"
}

# The target is to insert right before the closing div of gallery-grid
$pattern = "(?s)(<div class=`"grid grid-3 gap-20 gallery-grid`">.*?)(                </div>\s+</div>\s+</section>)"
$replacement = "`${1}$htmlToInsert`${2}"

$newContent = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, $replacement)

Set-Content -Path "c:\Users\Lenovo\Desktop\belgesem\galeri.html" -Value $newContent -Encoding UTF8
Write-Host "Gallery updated."
