$argsList = @($args)
$outIndex = [Array]::IndexOf($argsList, '--outdir')
if ($outIndex -lt 0) { throw 'Missing --outdir' }
$outDir = $argsList[$outIndex + 1]
$inputPath = $argsList[-1]
$pdfPath = Join-Path $outDir (([IO.Path]::GetFileNameWithoutExtension($inputPath)) + '.pdf')
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $null
try {
    $doc = $word.Documents.Open($inputPath, $false, $true)
    $doc.ExportAsFixedFormat($pdfPath, 17)
} finally {
    if ($doc) { $doc.Close(0) }
    $word.Quit()
}
