param([string]$OutputPath = 'D:\Users\willi\Downloads\School OEs\Programming\September 3\OE6 - September 3.docx')

$ErrorActionPreference = 'Stop'
$sourceDir = 'D:\Users\willi\Downloads\School OEs\Programming\September 3'
$problems = @(
    @{ Number=1; File='numberClassification.cpp' },
    @{ Number=2; File='substringCheck.cpp' },
    @{ Number=3; File='nestedTernary.cpp' },
    @{ Number=5; File='logicalConnectives.cpp' },
    @{ Number=6; File='andOperator.cpp' },
    @{ Number=7; File='orOperator.cpp' },
    @{ Number=8; File='notOperator.cpp' },
    @{ Number=9; File='playerRank.cpp' }
)

function Add-Paragraph {
    param($Document, [string]$Text, [int]$Alignment=0, [float]$Size=10, [bool]$Bold=$false, [float]$After=3, [float]$LeftIndent=0)
    $p = $Document.Paragraphs.Add()
    $p.Range.Text = $Text
    $p.Alignment = $Alignment
    $p.Range.Font.Name = 'Aptos'
    $p.Range.Font.Size = $Size
    $p.Range.Font.Bold = [int]$Bold
    $p.Range.Font.Color = 0
    $p.SpaceAfter = $After
    $p.SpaceBefore = 0
    $p.LeftIndent = $LeftIndent
    return $p
}

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
$doc = $null
try {
    $doc = $word.Documents.Add()
    $section = $doc.Sections.Item(1)
    $section.PageSetup.PaperSize = 2
    $section.PageSetup.Orientation = 0
    $section.PageSetup.TopMargin = $word.InchesToPoints(0.8)
    $section.PageSetup.BottomMargin = $word.InchesToPoints(0.8)
    $section.PageSetup.LeftMargin = $word.InchesToPoints(0.85)
    $section.PageSetup.RightMargin = $word.InchesToPoints(0.85)

    $title = Add-Paragraph $doc 'OE6 SEPTEMBER 3' 1 20 $true 22 0
    $title.Range.Style = $doc.Styles.Item('Title')
    $title.Range.Font.Name = 'Aptos'
    $title.Range.Font.Size = 20
    $title.Range.Font.Color = 0

    for ($i=0; $i -lt $problems.Count; $i++) {
        Add-Paragraph $doc ("PROBLEM {0}" -f $problems[$i].Number) 1 14 $false 18 0 | Out-Null
        $code = Get-Content -LiteralPath (Join-Path $sourceDir $problems[$i].File)
        foreach ($line in $code) {
            $indent = if ($line -match '^\s+') { 22 } else { 0 }
            Add-Paragraph $doc $line 0 10 $false 2 $indent | Out-Null
        }
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
