# Nav Tab Font & Color Issue Artifact (Wittle Guys Ecommerce, July 2024)

## Goal
- Nav tab text should use the “Kirby No Kira Kizzu BRK” font.
- Each letter in the nav tab text should be a random color from a Super Monkey Ball–style palette on every page load.
- The font should be crisp, not blurry, and not default to a single color (e.g., blue).

---

## Current Implementation

### Font Setup
- `Kirby No Kira Kizzu BRK.ttf` is in `static/fonts/`.
- CSS includes:
  ```css
  @font-face {
      font-family: 'Kirby';
      src: url('/fonts/Kirby No Kira Kizzu BRK.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
  }
  ```
- Nav tab text is wrapped in a `<span>` for each tab.

### CSS for Nav Tabs
```css
.main-nav ul li a {
    font-size: 1.6rem;
    font-weight: 700;
    padding: 0.7rem 2rem;
    margin: 0 0.3rem;
    border-radius: 999px;
    box-shadow: 0 6px 24px rgba(255, 200, 0, 0.28), 0 2px 8px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.08);
    border: 3px solid #fffbe7;
    background: radial-gradient(circle at 30% 30%, #ffe066 70%, #ffb347 100%);
    display: inline-block;
    transition: background 0.18s, box-shadow 0.18s, transform 0.1s;
    color: inherit !important;
    letter-spacing: 0;
}
.main-nav ul li a span {
    font-family: 'Kirby', Arial, sans-serif !important;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: none !important;
    background-clip: initial !important;
    -webkit-background-clip: initial !important;
    -webkit-text-fill-color: initial !important;
    color: inherit !important;
    text-fill-color: initial !important;
    letter-spacing: 0;
}
```

### JavaScript for Random Colors
- Script in `baseof.html` (before `</body>`) that:
  - Selects all `.main-nav ul li a span`
  - Splits their text into individual `<span>`s per letter
  - Assigns each letter a random color from a palette

### Observed Problems
- **Font is still blue** (not random colors).
- **Font is blurry** (especially at small sizes).
- **Random color JS is not taking effect**—CSS color is overriding or not being applied.
- **No color, background, or text-fill rules remain in the CSS for the nav tab spans.**

### Recent Fixes
- All color/background/text-fill rules removed from `.main-nav ul li a span` in CSS.
- Font size increased for clarity.
- Only font and smoothing properties remain for the Kirby font.

---

## What’s Needed
- Diagnose why the JS-assigned color is not showing (likely a CSS specificity or inheritance issue, or a parent color is still overriding).
- Fix the blurriness (may require adjusting font size, smoothing, or using a different font rendering approach).

---

**For Claude:**
Please provide step-by-step troubleshooting and a fix to ensure:
- Each nav tab letter is a random color (set by JS, not CSS).
- The Kirby font is crisp and not blurry.
- No parent or inherited color overrides the JS color. 