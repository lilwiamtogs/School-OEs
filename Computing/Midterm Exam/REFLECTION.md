# Midterm Exam Reflection

## 1. Why use semantic HTML elements?

Semantic elements such as `header`, `nav`, `main`, `section`, `article`, and `footer` explain the role of each part of the page. This makes the code easier to read and maintain, helps screen readers navigate the website, and gives browsers and search engines a clearer understanding of the content than generic `div` elements would.

## 2. How does an external CSS file help?

The shared `styles.css` file keeps design rules separate from the HTML content. All four pages use the same colors, typography, navigation, buttons, cards, and footer styles, so one CSS change can update the entire website. This reduces repeated code and makes visual problems easier to find and fix.

## 3. How was Flexbox used for the article layout?

The drink articles are placed inside `.drink-list`, which uses `display: flex`, `flex-wrap: wrap`, and a consistent gap. Each `.drink-card` takes about half of the row, creating two columns on larger screens. In the `@media (max-width: 800px)` rule, the container changes to `flex-direction: column`, so every card becomes full width on smaller screens.

## 4. How did the visual choices improve the blog?

I used white and warm cream as the main surfaces, then borrowed cobalt blue from the Koffee Haus logo for borders, shadows, links, orbit drawings, and navigation accents. Black display type creates a strong hierarchy, while yellow and green add the playful energy of a handmade café poster. The transparent drink photos sit inside irregular shapes so they remain clear focal points without requiring a heavy background color.

## 5. What problems appeared, and how were they resolved?

The starting project had one unfinished home page, three empty pages, a stray character after the closing script tag, CSS written with nested selectors, and links that were not yet functional. I rebuilt the pages with semantic HTML, moved all shared styling into `styles.css`, organized the assets in an `images` folder, and added consistent navigation. I then tested every page at 1440-pixel desktop width and 390-pixel mobile width, checked every local link and image path, verified the JavaScript syntax, and confirmed that there was no horizontal overflow or broken image.

## 6. What would I add with more time?

I would add a searchable drink menu with filters for coffee, matcha, fruit, sweetness level, and dairy-free options. It would help visitors find a drink that matches their preferences quickly while keeping the same visual style and accessible keyboard controls.
