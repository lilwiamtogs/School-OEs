param(
    [string]$OutputPath = 'D:\Users\willi\Downloads\School OEs\Programming\September 3\OE6 - September 3.docx'
)

$ErrorActionPreference = 'Stop'
$sourceDir = 'D:\Users\willi\Downloads\School OEs\Programming\September 3'
$workDir = 'D:\Users\willi\Downloads\School OEs\.docx_work\oe6'
$imageDir = Join-Path $workDir 'output-images'
New-Item -ItemType Directory -Force -Path $imageDir | Out-Null

$problems = @(
    @{ File='playerRank.cpp'; Input="William Togonon`n85`n" },
    @{ File='numberClassification.cpp'; Input="-12`n" },
    @{ File='substringCheck.cpp'; Input="Nested ternary operators`nternary`n" },
    @{ File='nestedTernary.cpp'; Input="82`n" },
    @{ File='logicalConnectives.cpp'; Input="10`n60`n" },
    @{ File='andOperator.cpp'; Input="10`n75`n" },
    @{ File='orOperator.cpp'; Input="0`n2`n" },
    @{ File='notOperator.cpp'; Input="0`n" }
)

function New-ConsoleImage {
    param([string]$Text, [string]$Path)
    Add-Type -AssemblyName System.Drawing
    $width = 1200
    $font = New-Object System.Drawing.Font('Consolas', 19, [System.Drawing.FontStyle]::Regular)
    $lineHeight = 29
    $lines = $Text -split "`r?`n"
    $height = [Math]::Max(330, 90 + ($lines.Count * $lineHeight))
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
    $graphics.Clear([System.Drawing.Color]::FromArgb(12, 12, 12))
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(238, 238, 238))
    $y = 38
    foreach ($line in $lines) {
        $graphics.DrawString($line, $font, $brush, 35, $y)
        $y += $lineHeight
    }
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $brush.Dispose(); $font.Dispose(); $graphics.Dispose(); $bitmap.Dispose()
}

function Add-Paragraph {
    param($Document, [string]$Text, [int]$Alignment=0, [float]$Size=10, [bool]$Bold=$false, [float]$After=3, [float]$LeftIndent=0)
    $p = $Document.Paragraphs.Add()
    $p.Range.Text = $Text
    $p.Alignment = $Alignment
    $p.Range.Font.Name = 'Aptos'
    $p.Range.Font.Size = $Size
    $p.Range.Font.Bold = [int]$Bold
    $p.SpaceAfter = $After
    $p.SpaceBefore = 0
    $p.LeftIndent = $LeftIndent
    return $p
}

# Compile and capture representative output from every source file.
$captures = @()
for ($i=0; $i -lt $problems.Count; $i++) {
    $src = Join-Path $sourceDir $problems[$i].File
    $exe = Join-Path $workDir ("oe6-check-{0}.exe" -f ($i+1))
    & g++ -std=c++17 $src -o $exe
    if ($LASTEXITCODE -ne 0) { throw "Compilation failed: $src" }
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $exe
    $psi.UseShellExecute = $false
    $psi.RedirectStandardInput = $true
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.CreateNoWindow = $true
    $proc = [System.Diagnostics.Process]::Start($psi)
    $proc.StandardInput.Write($problems[$i].Input)
    $proc.StandardInput.Close()
    $stdout = $proc.StandardOutput.ReadToEnd()
    $stderr = $proc.StandardError.ReadToEnd()
    $proc.WaitForExit()
    if ($proc.ExitCode -ne 0) { throw "Execution failed: $src`n$stderr" }
    $capture = ($stdout.TrimEnd() + "`n`nProcess exited with return value 0")
    $captures += $capture
    New-ConsoleImage -Text $capture -Path (Join-Path $imageDir ("output-{0}.png" -f ($i+1)))
}

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $null
try {
    $doc = $word.Documents.Add()
    $section = $doc.Sections.Item(1)
    $section.PageSetup.PaperSize = 2 # Letter
    $section.PageSetup.Orientation = 0
    $section.PageSetup.TopMargin = $word.InchesToPoints(0.8)
    $section.PageSetup.BottomMargin = $word.InchesToPoints(0.8)
    $section.PageSetup.LeftMargin = $word.InchesToPoints(0.85)
    $section.PageSetup.RightMargin = $word.InchesToPoints(0.85)

    $title = Add-Paragraph $doc 'OE6 SEPTEMBER 3' 1 20 $true 20 0
    $title.Range.Style = $doc.Styles.Item('Title')
    $title.Range.Font.Name = 'Aptos'
    $title.Range.Font.Size = 20
    $title.Range.Font.Color = 0

    for ($i=0; $i -lt $problems.Count; $i++) {
        Add-Paragraph $doc ("PROBLEM {0}" -f ($i+1)) 1 14 $false 18 0 | Out-Null
        $code = Get-Content -LiteralPath (Join-Path $sourceDir $problems[$i].File)
        foreach ($line in $code) {
            $indent = if ($line -match '^\s+') { 22 } else { 0 }
            Add-Paragraph $doc $line 0 9.5 $false 1.5 $indent | Out-Null
        }

        $doc.Paragraphs.Add().Range.InsertBreak(7)
        Add-Paragraph $doc ("OUTPUT {0}" -f ($i+1)) 1 14 $false 14 0 | Out-Null
        $picParagraph = $doc.Paragraphs.Add()
        $picParagraph.Alignment = 1
        $pic = $picParagraph.Range.InlineShapes.AddPicture((Join-Path $imageDir ("output-{0}.png" -f ($i+1))))
        $pic.LockAspectRatio = -1
        $pic.Width = $word.InchesToPoints(6.55)

        if ($i -lt ($problems.Count - 1)) {
            $doc.Paragraphs.Add().Range.InsertBreak(7)
        }
    }

    $doc.SaveAs2($OutputPath, 16)
} finally {
    if ($doc) { $doc.Close(0) }
    $word.Quit()
}

Write-Output $OutputPath
