# Template execution contract

## Reference

- Source: `D:\Users\willi\Downloads\PT Documentation Template_ITC.docx`
- SHA-256: `4055678B6B3AB71609290EF4BB2B45D43B60BE9E54AAB784EF3185ED6DFA6D14`
- Reference render: `D:\Users\willi\Downloads\School OEs\.qa\pt1-documentation\template-reference.pdf`
- Page count: 2
- Section count: 1

## Page system

- Letter portrait, 612 by 792 points.
- Margins: top 86.4 pt, bottom 72 pt, left 108 pt, right 75.6 pt.
- Header and footer distance: 36 pt.
- One continuous section. The first-page header uses the LPU Laguna identity, two logos, red guide borders, and a page-number field.
- Subsequent pages preserve the same header/footer relationship unless the original template suppresses it.

## Typography and paragraph roles

- Arial is the template typeface.
- Cover and table-of-contents text use 12 pt Arial; list entries use 11 pt Arial with 13.8 pt line spacing.
- Cover title lines are centered. Main labels and major table-of-contents entries are bold.
- Body pages will reuse Arial with 12 pt body text, black headings, and the template margins.
- Major body headings use bold Arial and Roman numerals. Subheadings follow the guide's lowercase-letter sequence.

## Lists and components

- The table of contents uses Word list paragraphs with Roman numerals for major sections and lowercase letters for subsections.
- Major entries: Introduction; User and System Requirements; Web Design and Architecture; Development and Implementation; Project Screenshots and UI Walkthrough; Learning Outcomes; References.
- Cover-page editable slots: performance task number, project title, submitted-by name, course and section, and date.
- The header artwork and both institutional logos are preserve-only.
- Body content, screenshots, wireframe, sitemap, code excerpts, and references may be appended after the existing table of contents.

## Slot map

- `word/document.xml`, cover text paragraphs: replace generic labels with Performance Task 1, Sunnydale School Webpage Enhancement, John William Togonon, CS 1-1, and 25 September 2026.
- `word/document.xml`, table-of-contents list: preserve wording and numbering while adding page numbers only if stable after authoring.
- `word/document.xml`, after the table of contents: append the seven guide sections and their required subsections.
- Screenshots: insert desktop, content/contact, and mobile views generated from the completed local `index.html`.
- Wireframe: insert a digital box model showing the single-page hierarchy.

## Package preservation

- Preserve `[Content_Types].xml`, root relationships, theme, styles, numbering, settings, font table, web settings, endnotes, footnotes, footer, header, and existing media unless Word must add relationships for inserted images.
- Preserve `word/header1.xml`, `word/footer1.xml`, `word/media/image1.png`, and `word/media/image2.jpeg` visually unchanged.
- Expected editable parts are the main document XML, its relationships, core/app properties, and content types needed for added images.

## Fidelity gates

- Retain the two-page cover and table-of-contents design as recognizable template-derived pages.
- Keep page size, margins, institutional header, logos, and black Arial typography.
- Do not alter the source template file.
- Render and inspect every final page for clipping, overlap, broken image placement, awkward page breaks, and missing text.
- Confirm the source template SHA-256 is unchanged before delivery.
