$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
$docx = 'D:\Users\willi\Downloads\School OEs\Computing\OE1\Computing OE1 Documentation.docx'
$out = 'D:\Users\willi\Downloads\School OEs\.docx_work\final-render'
New-Item -ItemType Directory -Force -Path $out | Out-Null
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($docx, $false, $true)
$pages = $doc.ComputeStatistics(2)
for ($i = 1; $i -le $pages; $i++) {
    $start = $doc.GoTo(1, 1, $i).Start
    if ($i -lt $pages) { $end = $doc.GoTo(1, 1, $i + 1).Start - 1 } else { $end = $doc.Content.End - 1 }
    $range = $doc.Range($start, $end)
    $range.CopyAsPicture()
    Start-Sleep -Milliseconds 400
    $image = [System.Windows.Forms.Clipboard]::GetImage()
    if ($null -eq $image) { throw "Clipboard did not contain page image $i" }
    $path = Join-Path $out ("page-{0}.png" -f $i)
    $image.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $image.Dispose()
}
$doc.Close($false)
$word.Quit()
Get-ChildItem $out -Filter '*.png' | Select-Object Name, Length
