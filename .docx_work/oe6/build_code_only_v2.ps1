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

function Write-Line {
    param($Selection, [string]$Text, [int]$Alignment=0, [float]$Size=10, [bool]$Bold=$false, [float]$After=2, [float]$LeftIndent=0)
    $Selection.ParagraphFormat.Alignment = $Alignment
    $Selection.ParagraphFormat.SpaceBefore = 0
    $Selection.ParagraphFormat.SpaceAfter = $After
    $Selection.ParagraphFormat.LeftIndent = $LeftIndent
    $Selection.Font.Name = 'Aptos'
    $Selection.Font.Size = $Size
    $Selection.Font.Bold = [int]$Bold
    $Selection.Font.Color = 0
    $Selection.TypeText($Text)
    $Selection.TypeParagraph()
}

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
$doc = $null
try {
    $doc = $word.Documents.Add()
    $section = $doc.Sections.Item(1)
    $section.PageSetup.PaperSize = 2
    $section.PageSetup.TopMargin = $word.InchesToPoints(0.8)
    $section.PageSetup.BottomMargin = $word.InchesToPoints(0.8)
    $section.PageSetup.LeftMargin = $word.InchesToPoints(0.85)
    $section.PageSetup.RightMargin = $word.InchesToPoints(0.85)
    $sel = $word.Selection

    Write-Line $sel 'OE6 SEPTEMBER 3' 1 20 $true 22 0
    for ($i=0; $i -lt $problems.Count; $i++) {
        Write-Line $sel ("PROBLEM {0}" -f $problems[$i].Number) 1 14 $false 18 0
        foreach ($line in (Get-Content -LiteralPath (Join-Path $sourceDir $problems[$i].File))) {
            $indent = if ($line -match '^\s+') { 22 } else { 0 }
            Write-Line $sel $line 0 10 $false 2 $indent
        }
        if ($i -lt ($problems.Count - 1)) { $sel.InsertBreak(7) }
    }
    $doc.SaveAs2($OutputPath, 16)
} finally {
    if ($doc) { $doc.Close(0) }
    $word.Quit()
}
Write-Output $OutputPath
