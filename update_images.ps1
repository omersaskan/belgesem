$content = Get-Content "c:\Users\Lenovo\Desktop\belgesem\script.js" -Raw

$replacements = @{
    "BEKO LODER" = "DSC07061.jpg"
    "EKSKAVATÖR" = "DSC07080.jpg"
    "LODER" = "DSC07063.jpg"
    "FORKLİFT" = "DSC07098.jpg"
    "GREYDER" = "DSC07055.jpg"
    "DOZER \(PALETLİ\)" = "DSC07059.jpg"
    "SİLİNDİR" = "DSC07071.jpg"
    "MOBİL VİNÇ" = "DSC07049.jpg"
    "İSTİF MAKİNESİ" = "DSC07091.jpg"
    "ELEKTRİKLİ TRANSPALET" = "DSC07095.jpg"
    "KÖPRÜLÜ VİNÇ" = "DSC07045.jpg"
    "PERSONEL VE YÜK YÜKSELTİCİ \(MANLİFT\)" = "DSC07043.jpg"
    "ÇEKME ARACI İŞ MAKİNESİ" = "DSC07047.jpg"
    "BUGGY \(GOLF ARABASI\)" = "DSC07099.jpg"
    "BİÇERDÖVER" = "DSC07052.jpg"
    "ÇIRÇIR MAKİNESİ" = "DSC07037.jpg"
    "SONDAJ" = "DSC07041.jpg"
    "İTFAİYE ARACI" = "DSC07069.jpg"
    "ÇÖP KAMYONU" = "DSC07066.jpg"
    "BETON MİKSERİ" = "DSC07074.jpg"
}

foreach ($key in $replacements.Keys) {
    $imgName = $replacements[$key]
    # Regex breakdown:
    # (?s) makes . match newline
    # "$key":\s*\{.*?image:\s* matches the key, followed by dict start, up to image field
    # "[^"]*" matches the old image string
    $pattern = "(?s)(`"$key`":\s*\{.*?image:\s*)`"[^`"]*`""
    $replacement = "`${1}`"assets/web/$imgName`""
    
    # We do a replace using regex
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, $replacement)
}

Set-Content -Path "c:\Users\Lenovo\Desktop\belgesem\script.js" -Value $content -Encoding UTF8
Write-Host "Replaced successfully."
