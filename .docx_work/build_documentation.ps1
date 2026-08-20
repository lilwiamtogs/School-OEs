$ErrorActionPreference = 'Stop'

$reference = 'D:\Users\willi\Downloads\PT Documentation Template.docx'
$output = 'D:\Users\willi\Downloads\School OEs\Computing\OE1\Computing OE1 Documentation.docx'
$screenshot = 'D:\Users\willi\Downloads\School OEs\.docx_work\computing-oe1.png'

Copy-Item -LiteralPath $reference -Destination $output -Force

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
$doc = $word.Documents.Open($output)

function Replace-All([string]$findText, [string]$replaceText) {
    $range = $doc.Content
    $find = $range.Find
    $find.ClearFormatting()
    $find.Replacement.ClearFormatting()
    $find.Text = $findText
    $find.Replacement.Text = $replaceText
    $find.Forward = $true
    $find.Wrap = 1
    [void]$find.Execute($findText, $false, $false, $false, $false, $false, $true, 1, $false, $replaceText, 2)
}

Replace-All 'COLLEGE OF ENGINERING AND COMPUTER STUDIES' 'COLLEGE OF ENGINEERING AND COMPUTER STUDIES'
Replace-All 'PERFORMANCE TASK #' 'PERFORMANCE TASK #1'
Replace-All 'Cisco 3 / Computer Networking 3' 'COMPUTING'
Replace-All '[Title of activity]' 'MY FIRST WEBSITE'
Replace-All 'DESCRIPTION ' 'DESCRIPTION'
Replace-All 'Problem Statement' 'PROBLEM STATEMENT'
Replace-All 'Objectives' 'OBJECTIVES'
Replace-All 'TOPOLOGY' 'WEBSITE STRUCTURE'
Replace-All 'SCREEN SHOTS' 'SCREENSHOTS'
Replace-All 'Packet Tracer (On Activity)' 'Completed Website Interface'
Replace-All 'Verification (ping, traceroute, etc.)' 'FUNCTIONAL VERIFICATION'
Replace-All 'CONFIGURATION COMMANDS (Per Packet Tracer Activity) ' 'IMPLEMENTATION CODE'
Replace-All 'REFERENCES (If any…)' 'REFERENCES'

$selection = $word.Selection
$selection.EndKey(6) | Out-Null

function Add-PageBreak {
    $selection.InsertBreak(7)
}

function Add-Heading([string]$text, [int]$level = 1) {
    $selection.Font.Name = 'Arial'
    $selection.Font.Bold = 1
    $selection.Font.Color = 0x5F2F05
    if ($level -eq 1) { $selection.Font.Size = 16 } else { $selection.Font.Size = 12 }
    $selection.ParagraphFormat.SpaceBefore = 8
    $selection.ParagraphFormat.SpaceAfter = 6
    $selection.TypeText($text)
    $selection.TypeParagraph()
}

function Add-Body([string]$text) {
    $selection.Font.Name = 'Arial'
    $selection.Font.Size = 10.5
    $selection.Font.Bold = 0
    $selection.Font.Color = 0
    $selection.ParagraphFormat.Alignment = 0
    $selection.ParagraphFormat.SpaceAfter = 6
    $selection.ParagraphFormat.LineSpacingRule = 0
    $selection.TypeText($text)
    $selection.TypeParagraph()
}

function Add-Bullet([string]$text) {
    $selection.Font.Name = 'Arial'
    $selection.Font.Size = 10.5
    $selection.Font.Bold = 0
    $selection.Font.Color = 0
    $selection.ParagraphFormat.LeftIndent = 18
    $selection.ParagraphFormat.FirstLineIndent = -9
    $selection.ParagraphFormat.SpaceAfter = 3
    $selection.TypeText([char]0x2022 + ' ' + $text)
    $selection.TypeParagraph()
    $selection.ParagraphFormat.LeftIndent = 0
    $selection.ParagraphFormat.FirstLineIndent = 0
}

function Add-Code([string]$text) {
    $selection.Font.Name = 'Consolas'
    $selection.Font.Size = 8.5
    $selection.Font.Bold = 0
    $selection.Font.Color = 0
    $selection.ParagraphFormat.LeftIndent = 14
    $selection.ParagraphFormat.RightIndent = 14
    $selection.ParagraphFormat.SpaceBefore = 3
    $selection.ParagraphFormat.SpaceAfter = 8
    $selection.TypeText($text)
    $selection.TypeParagraph()
    $selection.ParagraphFormat.LeftIndent = 0
    $selection.ParagraphFormat.RightIndent = 0
}

Add-PageBreak
Add-Heading '1. DESCRIPTION'
Add-Body 'Computing OE1 is a responsive single-page website titled "My First Website." It demonstrates the core roles of HTML, CSS, and JavaScript through a structured page containing a navigation header, hero banner, features section, article section, interactive button, and social-media footer.'

Add-Heading '2. PROBLEM STATEMENT'
Add-Body 'The activity requires the creation of a clear and attractive introductory website that applies fundamental front-end development concepts. The page must organize content using semantic HTML, present it through consistent CSS styling, include locally stored photographs, adapt to smaller screens, and demonstrate a basic JavaScript interaction.'

Add-Heading '3. OBJECTIVES'
Add-Bullet 'Build a complete webpage using HTML for structure.'
Add-Bullet 'Apply CSS for layout, typography, color, spacing, images, and responsive behavior.'
Add-Bullet 'Use JavaScript to provide a simple user interaction.'
Add-Bullet 'Organize the page into recognizable header, content, article, and footer sections.'
Add-Bullet 'Use real web-sourced photographs stored locally so the page also works offline.'
Add-Bullet 'Verify that all local assets load correctly during a normal page refresh.'

Add-Heading '4. WEBSITE STRUCTURE'
Add-Body 'The website follows a top-to-bottom information flow:'
Add-Bullet 'Header - website title and navigation links for Home, Features, Articles, and Contact.'
Add-Bullet 'Hero section - full-width coding photograph, welcome message, supporting text, and Learn More button.'
Add-Bullet 'Features section - image and explanation of the technologies and design principles demonstrated.'
Add-Bullet 'Article section - short introduction to HTML, CSS, and JavaScript.'
Add-Bullet 'Footer - copyright notice and links to common social platforms.'

Add-PageBreak
Add-Heading '5. SCREENSHOTS'
Add-Heading '5.1 Completed Website Interface' 2
Add-Body 'Figure 1 shows the completed desktop view of Computing OE1.'
$shape = $selection.InlineShapes.AddPicture($screenshot, $false, $true)
$shape.LockAspectRatio = -1
$shape.Width = 350
$selection.TypeParagraph()
$selection.ParagraphFormat.Alignment = 1
$selection.Font.Name = 'Arial'
$selection.Font.Size = 9
$selection.Font.Italic = 1
$selection.TypeText('Figure 1. Completed Computing OE1 webpage')
$selection.TypeParagraph()
$selection.Font.Italic = 0
$selection.ParagraphFormat.Alignment = 0

Add-PageBreak
Add-Heading '6. IMPLEMENTATION CODE'
Add-Heading '6.1 HTML Structure' 2
Add-Body 'The HTML file defines the semantic content and connects the stylesheet and script.'
Add-Code @'
<header>
    <h1><span>&lt;/&gt;</span> My First Website</h1>
    <nav>
        <a href="#">Home</a>
        <a href="#">Features</a>
        <a href="#">Articles</a>
        <a href="#">Contact</a>
    </nav>
</header>

<section class="hero">
    <div class="hero-content">
        <h2>Welcome to My Website</h2>
        <p>This webpage demonstrates the basic use of HTML, CSS,
        and JavaScript in building a modern website.</p>
        <button onclick="showMessage()">Learn More</button>
    </div>
</section>
'@

Add-Heading '6.2 CSS Styling' 2
Add-Body 'CSS creates the color scheme, responsive layout, image treatment, button states, and mobile breakpoint.'
Add-Code @'
.hero {
    height: 380px;
    background: linear-gradient(rgba(0,43,81,.12), rgba(0,43,81,.12)),
                url("images/header.jpg?v=2") center/cover no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #fff;
}

@media (max-width: 768px) {
    header { flex-direction: column; }
    .features-content, .article-content { grid-template-columns: 1fr; }
}
'@

Add-Heading '6.3 JavaScript Interaction' 2
Add-Body 'The Learn More button calls a function that displays a welcome message.'
Add-Code @'
function showMessage() {
    alert(
        "Welcome to My First Website!\n\n" +
        "Thank you for visiting our webpage.\n\n" +
        "This webpage was created using HTML, CSS, and JavaScript."
    );
}
'@

Add-PageBreak
Add-Heading '7. FUNCTIONAL VERIFICATION'
Add-Bullet 'The page opens from index.html without requiring an internet connection for its local assets.'
Add-Bullet 'The stylesheet, script, and all three JPG image files exist at the referenced paths.'
Add-Bullet 'The hero background, feature photograph, and article photograph load correctly.'
Add-Bullet 'The Learn More button runs showMessage() and displays the expected alert.'
Add-Bullet 'The layout changes to a single-column arrangement on screens 768 pixels wide or smaller.'
Add-Bullet 'Versioned asset references reduce stale browser caching during normal refreshes.'

Add-Heading '8. LEARNING OUTCOMES'
Add-Body 'Through this activity, the student practiced dividing a webpage into meaningful sections, linking external CSS and JavaScript files, using Flexbox and Grid for layout, placing responsive images, applying a media query, and connecting an HTML event to a JavaScript function. The activity also demonstrated the importance of local file organization, descriptive alternative text, and cache-aware asset references.'

Add-Heading '9. REFERENCES'
Add-Bullet 'Unsplash License: https://unsplash.com/license'
Add-Bullet 'Christopher Gower, laptop displaying code: https://unsplash.com/photos/m_HRfLhgABo'
Add-Bullet 'Dawit, laptop displaying code on a desk: https://unsplash.com/photos/dTmj5aXbKp4'
Add-Bullet 'Daniil Komov, coding workspace: https://unsplash.com/photos/41cG8-U74lc'
Add-Bullet 'MDN Web Docs, HTML, CSS, and JavaScript references: https://developer.mozilla.org/'

$doc.Save()
$doc.Close($false)
$word.Quit()

Get-Item -LiteralPath $output | Select-Object FullName, Length, LastWriteTime
