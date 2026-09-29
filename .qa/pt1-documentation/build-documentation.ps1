$ErrorActionPreference = 'Stop'

$source = 'D:\Users\willi\Downloads\PT Documentation Template_ITC.docx'
$output = 'D:\Users\willi\Downloads\School OEs\Computing\PT 1\PT 1 Documentation.docx'
$assets = 'D:\Users\willi\Downloads\School OEs\.qa\pt1-documentation'

Copy-Item -LiteralPath $source -Destination $output -Force

$wdAlignLeft = 0
$wdAlignCenter = 1
$wdAlignJustify = 3
$wdCollapseEnd = 0
$wdPageBreak = 7
$wdColorBlack = 0

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

function Set-BaseFont($range, [double]$size = 11) {
    $range.Font.Name = 'Arial'
    $range.Font.Size = $size
    $range.Font.Color = $wdColorBlack
}

function Add-Paragraph {
    param(
        [string]$Text = '',
        [double]$Size = 11,
        [bool]$Bold = $false,
        [bool]$Italic = $false,
        [int]$Alignment = 0,
        [double]$Before = 0,
        [double]$After = 6,
        [double]$LeftIndent = 0,
        [double]$FirstLineIndent = 0,
        [string]$FontName = 'Arial',
        [int]$KeepWithNext = 0
    )
    $start = $script:doc.Content.End - 1
    $range = $script:doc.Range($start, $start)
    $range.InsertAfter($Text + "`r")
    $paragraph = $script:doc.Range($start, $start + $Text.Length).Paragraphs.Item(1)
    $paragraph.Range.Font.Name = $FontName
    $paragraph.Range.Font.Size = $Size
    $paragraph.Range.Font.Bold = [int]$Bold * -1
    $paragraph.Range.Font.Italic = [int]$Italic * -1
    $paragraph.Range.Font.Color = $wdColorBlack
    $paragraph.Format.Alignment = $Alignment
    $paragraph.Format.SpaceBefore = $Before
    $paragraph.Format.SpaceAfter = $After
    $paragraph.Format.LineSpacingRule = 0
    $paragraph.Format.LeftIndent = $LeftIndent
    $paragraph.Format.FirstLineIndent = $FirstLineIndent
    $paragraph.Format.KeepWithNext = $KeepWithNext
    return $paragraph
}

function Add-SectionHeading([string]$Roman, [string]$Text) {
    Add-Paragraph -Text "$Roman. $Text" -Size 14 -Bold $true -Before 6 -After 10 -KeepWithNext -1 | Out-Null
}

function Add-Subheading([string]$Letter, [string]$Text) {
    Add-Paragraph -Text "$Letter. $Text" -Size 12 -Bold $true -Before 6 -After 5 -KeepWithNext -1 | Out-Null
}

function Add-Body([string]$Text) {
    Add-Paragraph -Text $Text -Size 11 -Alignment $wdAlignJustify -After 7 | Out-Null
}

function Add-Bullet([string]$Text) {
    $p = Add-Paragraph -Text ("- " + $Text) -Size 11 -Alignment $wdAlignLeft -After 4 -LeftIndent 18 -FirstLineIndent -9
    $p.Range.ListFormat.ApplyBulletDefault()
}

function Add-Code([string]$Text) {
    $lines = $Text -split "`r?`n"
    foreach ($line in $lines) {
        if ($line.Length -eq 0) { continue }
        $p = Add-Paragraph -Text $line -Size 8.5 -Alignment $wdAlignLeft -After 0 -LeftIndent 14 -FontName 'Consolas'
        $p.Format.RightIndent = 14
        $p.Format.LineSpacingRule = 0
        $p.Range.Shading.BackgroundPatternColor = 15132390
    }
    Add-Paragraph -Text '' -Size 4 -After 4 | Out-Null
}

function Add-PageBreak {
    $range = $script:doc.Range($script:doc.Content.End - 1, $script:doc.Content.End - 1)
    $range.InsertBreak($wdPageBreak)
}

function Add-Picture {
    param(
        [string]$Path,
        [double]$WidthPoints,
        [string]$Caption
    )
    $start = $script:doc.Content.End - 1
    $range = $script:doc.Range($start, $start)
    $image = $script:doc.InlineShapes.AddPicture($Path, $false, $true, $range)
    $image.LockAspectRatio = -1
    $image.Width = $WidthPoints
    $image.Range.ParagraphFormat.Alignment = $wdAlignCenter
    $image.Range.ParagraphFormat.SpaceAfter = 6
    $after = $script:doc.Range($script:doc.Content.End - 1, $script:doc.Content.End - 1)
    $after.InsertAfter("`r")
    Add-Paragraph -Text $Caption -Size 9 -Italic $true -Alignment $wdAlignCenter -After 10 | Out-Null
}

try {
    $script:doc = $word.Documents.Open($output, $false, $false)

    # Fill the cover-page slots without changing the original template file.
    $replacements = [ordered]@{
        'PERFORMANCE TASK #' = 'PERFORMANCE TASK 1'
        'Title' = 'Sunnydale School Webpage Enhancement'
        'Submitted By' = 'John William Togonon'
        'Course & Section' = 'CS 1-1'
        'Date' = '25 September 2026'
    }
    foreach ($oldText in $replacements.Keys) {
        $findRange = $script:doc.Content
        $find = $findRange.Find
        $find.ClearFormatting()
        $find.Text = $oldText
        $find.Replacement.ClearFormatting()
        $find.Replacement.Text = $replacements[$oldText]
        $find.Forward = $true
        $find.Wrap = 1
        $find.Format = $false
        [void]$find.Execute($oldText, $false, $false, $false, $false, $false, $true, 1, $false, $replacements[$oldText], 2)
    }

    Add-PageBreak

    Add-SectionHeading 'I' 'INTRODUCTION'
    Add-Subheading 'a' 'Project Overview'
    Add-Body 'The Sunnydale School webpage is a single-page information hub designed for students, parents, and staff. I selected this topic because a school website should make essential information easy to find while still feeling welcoming and organized. The page presents the school mission, upcoming events, and contact details in a clear structure. Its main purpose is to improve readability, visual appeal, and basic interaction through semantic HTML and internal CSS.'

    Add-Subheading 'b' 'Purpose and Objectives'
    Add-Body 'General Objective: To design and develop a responsive Sunnydale School information webpage that communicates important school information clearly using semantic HTML5 and a consistent CSS design system.'
    Add-Bullet 'To organize the mission, events, and contact information using appropriate HTML elements, IDs, classes, inline styles, and data attributes.'
    Add-Bullet 'To apply an accessible navy, teal, neutral, and warm-gold color scheme that remains readable on desktop and smaller screens.'
    Add-Bullet 'To provide useful interactions through email and telephone links, hover tooltips, and responsive layout rules.'

    Add-Subheading 'c' 'Scope and Limitations'
    Add-Body 'Scope: The project contains one responsive page with a school header, mission statement, upcoming-events list, contact-information panel, and footer. It includes styled headings, highlighted event dates, indoor and outdoor event metadata, hover titles, email and telephone links, and a mobile layout adjustment.'
    Add-Body 'Limitations: The website is static and does not use a backend, database, account system, event-management system, or contact form. The email and telephone links open compatible applications, but the page does not copy values to the clipboard or display the suggested thank-you message because no JavaScript behavior was required.'

    Add-PageBreak
    Add-SectionHeading 'II' 'USER AND SYSTEM REQUIREMENTS'
    Add-Subheading 'a' 'Target Audience'
    Add-Body 'The webpage is intended for Sunnydale School students, parents or guardians, teachers, staff, and community members who need a quick overview of the school. These users benefit from a focused layout that presents the mission, important dates, and contact information without requiring navigation through several pages.'

    Add-Subheading 'b' 'Basic Functional Requirements'
    Add-Bullet 'The system must display the school title, introductory message, mission statement, upcoming events, contact information, and copyright notice.'
    Add-Bullet 'The system must identify every event as indoor or outdoor through data attributes and matching hover tooltips.'
    Add-Bullet 'The system must visually distinguish outdoor events and emphasize each event date.'
    Add-Bullet 'The system must allow users to open an email client or telephone application through the contact links.'
    Add-Bullet 'The system must adapt its spacing and page width for viewports at or below 600 pixels.'
    Add-Bullet 'The system must retain readable contrast, visible link states, and clear section hierarchy.'

    Add-PageBreak
    Add-SectionHeading 'III' 'WEB DESIGN AND ARCHITECTURE'
    Add-Subheading 'a' 'Website Structure Sitemap'
    Add-Body 'The project uses a compact single-page architecture. All content is contained in index.html, while README.md records testing notes and design decisions.'
    Add-Paragraph -Text 'PT 1' -Size 11 -Bold $true -LeftIndent 18 -After 2 | Out-Null
    Add-Paragraph -Text '|-- index.html' -Size 10 -FontName 'Consolas' -LeftIndent 36 -After 2 | Out-Null
    Add-Paragraph -Text '|   |-- Header' -Size 10 -FontName 'Consolas' -LeftIndent 36 -After 2 | Out-Null
    Add-Paragraph -Text '|   |-- Mission Statement' -Size 10 -FontName 'Consolas' -LeftIndent 36 -After 2 | Out-Null
    Add-Paragraph -Text '|   |-- Upcoming Events' -Size 10 -FontName 'Consolas' -LeftIndent 36 -After 2 | Out-Null
    Add-Paragraph -Text '|   |-- Contact Us' -Size 10 -FontName 'Consolas' -LeftIndent 36 -After 2 | Out-Null
    Add-Paragraph -Text '|   `-- Footer' -Size 10 -FontName 'Consolas' -LeftIndent 36 -After 2 | Out-Null
    Add-Paragraph -Text '`-- README.md' -Size 10 -FontName 'Consolas' -LeftIndent 36 -After 8 | Out-Null

    Add-Subheading 'b' 'Page Layouts and Wireframes'
    Add-Body 'The box model below shows the planned vertical reading order. The design begins with school identity, moves through the most important informational sections, and closes with contact details and a simple footer.'
    Add-Picture -Path "$assets\wireframe.png" -WidthPoints 300 -Caption 'Figure 1. Digital wireframe showing the single-page content hierarchy.'

    Add-PageBreak
    Add-Subheading 'c' 'Visual Design Color Scheme and Typography'
    Add-Body 'The revised color palette uses dark navy (#18344D) as the primary school color, muted teal (#24566B and #5F9293) as the secondary color, and warm gold (#C7A75B and #8A5418) as the accent. Neutral backgrounds (#EDF1F4, #F3F6F7, and white) reduce visual noise, while the pale teal outdoor-event background (#E7F1EF) creates distinction without overpowering the text.'
    Add-Body 'Arial is used throughout the webpage because it is readable, widely available, and appropriate for an educational information page. Heading sizes and bold weights establish hierarchy, while body text uses comfortable line spacing for longer descriptions.'

    Add-SectionHeading 'IV' 'DEVELOPMENT AND IMPLEMENTATION'
    Add-Subheading 'a' 'Tools and Technologies Used'
    Add-Bullet 'HTML5 for the semantic page structure, content sections, links, IDs, classes, tooltips, and data attributes.'
    Add-Bullet 'CSS3 in an internal style element for typography, colors, spacing, borders, responsive sizing, and hover or focus states.'
    Add-Bullet 'Google Chrome for desktop and mobile viewport testing.'
    Add-Bullet 'Visual Studio Code-compatible project files for editing and local review.'

    Add-Subheading 'b' 'Sample Code Snippets HTML CSS JS'
    Add-Body 'The following excerpts show the event metadata, outdoor-event treatment, and responsive adjustment used in the final page. JavaScript was intentionally not added because the task requested a descriptive comment rather than executable click behavior.'
    $htmlSnippet = @'
<li class="outdoor" data-event-type="outdoor" title="Event Type: Outdoor">
    Sports Day - <span style="font-weight: bold; color: red;">June 20</span>
</li>
'@
    $outdoorSnippet = @'
.outdoor {
    background-color: #e7f1ef;
    padding: 5px;
    border: 1px solid #c5dcd6;
}
'@
    $responsiveSnippet = @'
@media (max-width: 600px) {
    .page-container {
        width: min(calc(100% - 20px), 900px);
        margin: 10px auto;
    }
}
'@
    Add-Code $htmlSnippet
    Add-Code $outdoorSnippet
    Add-Code $responsiveSnippet

    $walkthroughHeading = Add-Paragraph -Text 'V. PROJECT SCREENSHOTS AND UI WALKTHROUGH' -Size 14 -Bold $true -Before 6 -After 10 -KeepWithNext -1
    $walkthroughHeading.Format.PageBreakBefore = -1
    Add-Subheading 'a' 'Home Landing Page'
    Add-Body 'The desktop view presents the complete information hierarchy in one centered card, beginning with a navy school header and continuing through clearly separated content sections.'
    Add-Picture -Path "$assets\sunnydale-desktop.png" -WidthPoints 420 -Caption 'Figure 2. Complete desktop landing page with the revised professional color palette.'

    Add-PageBreak
    Add-Subheading 'b' 'Content Service Page'
    Add-Body 'Because the project is a single-page site, the Upcoming Events area serves as its primary content section. Each date is emphasized, each item carries event-type metadata, and outdoor activities receive a subtle tinted background.'
    Add-Picture -Path "$assets\sunnydale-events-crop.png" -WidthPoints 420 -Caption 'Figure 3. Upcoming Events content section showing indoor and outdoor activities.'

    Add-Subheading 'c' 'Contact Page and Form'
    Add-Body 'The project does not include a form; instead, the contact section groups the school email address, telephone number, and office hours in a distinct panel. The email and telephone values are actionable links and include hover titles.'
    Add-Picture -Path "$assets\sunnydale-contact-crop.png" -WidthPoints 420 -Caption 'Figure 4. Contact panel with email and telephone links.'

    Add-PageBreak
    Add-Subheading 'd' 'Mobile Responsive View'
    Add-Body 'At a 500-pixel viewport width, the page reduces its outer margins and internal padding while maintaining a readable vertical flow. The title, content cards, event list, contact information, and footer remain visible without horizontal scrolling.'
    Add-Picture -Path "$assets\sunnydale-mobile-500.png" -WidthPoints 240 -Caption 'Figure 5. Mobile responsive view at a 500-pixel viewport width.'

    Add-SectionHeading 'VI' 'LEARNING OUTCOMES'
    Add-Bullet 'I learned how to organize a small information website with semantic header, main, section, list, contact, and footer elements.'
    Add-Bullet 'I strengthened my ability to select IDs, classes, data attributes, and inline styles for different structural and styling requirements.'
    Add-Bullet 'I learned how media queries and flexible width calculations help the same page remain usable on desktop and mobile screens.'
    Add-Bullet 'I improved my understanding of visual hierarchy by replacing conflicting bright colors with a restrained, consistent palette.'

    Add-SectionHeading 'VII' 'REFERENCES'
    Add-Paragraph -Text 'Lyceum of the Philippines University Laguna. (2026). PT documentation writing guide [Course handout].' -Size 11 -Alignment $wdAlignLeft -After 7 | Out-Null
    Add-Paragraph -Text 'Mozilla Developer Network. (n.d.). CSS: Cascading Style Sheets. https://developer.mozilla.org/en-US/docs/Web/CSS' -Size 11 -Alignment $wdAlignLeft -After 7 | Out-Null
    Add-Paragraph -Text 'Mozilla Developer Network. (n.d.). HTML: HyperText Markup Language. https://developer.mozilla.org/en-US/docs/Web/HTML' -Size 11 -Alignment $wdAlignLeft -After 7 | Out-Null
    Add-Paragraph -Text 'Sunnydale School webpage enhancement. (2026). Performance task instructions [Course activity].' -Size 11 -Alignment $wdAlignLeft -After 7 | Out-Null

    # Normalize appended body content to the template page system.
    foreach ($section in $script:doc.Sections) {
        $section.PageSetup.PageWidth = 612
        $section.PageSetup.PageHeight = 792
        $section.PageSetup.TopMargin = 86.4
        $section.PageSetup.BottomMargin = 72
        $section.PageSetup.LeftMargin = 108
        $section.PageSetup.RightMargin = 75.6
    }

    $script:doc.Save()
    $script:doc.Close($false)
}
finally {
    $word.Quit()
    [Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}

Get-Item -LiteralPath $output | Select-Object FullName, Length, LastWriteTime
