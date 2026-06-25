$downloadDir = "C:\Users\Lenovo\Downloads"
$searchPattern = "*ARA*LAR*VE*B*LG*LEND*RMELER*.docx"
$docxFile = Get-ChildItem -Path $downloadDir -Filter $searchPattern | Select-Object -First 1

$outputPath = "C:\Users\Lenovo\Desktop\belgesem\machinery_info.txt"

if ($docxFile) {
    Write-Host "Found file: $($docxFile.FullName)"
    try {
        $word = New-Object -ComObject Word.Application
        $doc = $word.Documents.Open($docxFile.FullName)
        $doc.Content.Text | Out-File -FilePath $outputPath -Encoding utf8
        $doc.Close()
        $word.Quit()
        Write-Host "Success: Text extracted to $outputPath"
    } catch {
        Write-Host "Error: Could not extract text. Make sure Word is installed."
        Write-Host $_.Exception.Message
    }
} else {
    Write-Host "Error: Could not find the file in $downloadDir"
}
