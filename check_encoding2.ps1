$path = "c:\Users\Lenovo\Desktop\belgesem\script.js"

# Read as Latin1 (Windows-1252 compatible) to preserve all bytes
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::GetEncoding(1252))

Write-Host "Current EKSKAVATÖR match: $($content -match '`"EKSKAVATÖR`"')"
Write-Host "Current EKSKAVAT... sample: $(($content | Select-String 'EKSKAVAT').Matches[0].Value)"

# The file was written by our script using UTF8 encoding but it seems the original 
# was Windows-1252. The view_file tool shows garbled text but that may be the tool's display.
# Let's check what the actual key text looks like around line 471
$lines = $content -split "`r`n"
Write-Host "Line 471: $($lines[470])"
Write-Host "Line 692: $($lines[691])"
