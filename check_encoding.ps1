$path = "c:\Users\Lenovo\Desktop\belgesem\script.js"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
# Check for the BEKO LODER key
if ($content -match '"BEKO LODER"') { Write-Host "UTF8: Keys look good (BEKO LODER found)" }
if ($content -match '"EKSKAVATÖR"') { Write-Host "UTF8: EKSKAVATÖR found" }
elseif ($content -match '"EKSKAVATÃ–R"') { Write-Host "ENCODING PROBLEM: File is Latin1/Windows-1252 misread as UTF8" }

# Also check actual bytes
$bytes = [System.IO.File]::ReadAllBytes($path)
# Check BOM
if ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    Write-Host "File has UTF-8 BOM"
} else {
    Write-Host "No UTF-8 BOM. First bytes: $($bytes[0]) $($bytes[1]) $($bytes[2])"
}
Write-Host "File size: $($bytes.Length) bytes"
