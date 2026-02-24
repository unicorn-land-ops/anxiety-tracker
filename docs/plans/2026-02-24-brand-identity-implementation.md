# Brand Identity Assets Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Produce production-ready brand identity assets — SVG logo files, favicon, social media templates, and the "Made in Unicorn.Land" badge component.

**Architecture:** Static SVG/HTML assets in `design-system/brand/`. No build tools needed. The refracted dot and wordmark are defined as SVGs that can be embedded anywhere. Social templates are HTML files that render at exact platform dimensions for screenshot export.

**Tech Stack:** SVG, HTML, CSS (using existing `--ul-*` tokens from `design-system/css/unicorn-land.css`)

---

### Task 1: Create the Refracted Dot as Production SVG

**Files:**
- Create: `design-system/brand/refracted-dot.svg`
- Create: `design-system/brand/refracted-dot-static.svg`

**Step 1: Create animated refracted dot SVG**

The dot is a circle in Opal `#56dbd0` with a conic-gradient refraction effect (a lighter sweep rotating across the surface). The animated version uses SVG `<animateTransform>`.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <clipPath id="dot-clip">
      <circle cx="32" cy="32" r="32"/>
    </clipPath>
    <radialGradient id="highlight" cx="35%" cy="35%" r="50%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <!-- Base circle -->
  <circle cx="32" cy="32" r="32" fill="#56dbd0"/>
  <!-- Refraction sweep -->
  <g clip-path="url(#dot-clip)">
    <ellipse cx="32" cy="32" rx="44" ry="44" fill="none" stroke="url(#refract-grad)" stroke-width="18" opacity="0.5">
      <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="6s" repeatCount="indefinite"/>
    </ellipse>
  </g>
  <!-- Highlight -->
  <circle cx="32" cy="32" r="24" fill="url(#highlight)"/>
  <!-- Refraction gradient -->
  <defs>
    <linearGradient id="refract-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#7ae8db" stop-opacity="0"/>
      <stop offset="30%" stop-color="#7ae8db" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="#aeeae0" stop-opacity="0.4"/>
      <stop offset="70%" stop-color="#7ae8db" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#7ae8db" stop-opacity="0"/>
    </linearGradient>
  </defs>
</svg>
```

**Step 2: Create static variant (no animation)**

Same SVG but with the refraction sweep at a fixed 200-degree rotation (the most visually appealing angle) and no `<animateTransform>`. This is for contexts that don't support SVG animation (social media, print, static exports).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <clipPath id="dot-clip">
      <circle cx="32" cy="32" r="32"/>
    </clipPath>
    <radialGradient id="highlight" cx="35%" cy="35%" r="50%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="refract-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#7ae8db" stop-opacity="0"/>
      <stop offset="30%" stop-color="#7ae8db" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="#aeeae0" stop-opacity="0.4"/>
      <stop offset="70%" stop-color="#7ae8db" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#7ae8db" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <circle cx="32" cy="32" r="32" fill="#56dbd0"/>
  <g clip-path="url(#dot-clip)">
    <ellipse cx="32" cy="32" rx="44" ry="44" fill="none" stroke="url(#refract-grad)" stroke-width="18" opacity="0.5" transform="rotate(200 32 32)"/>
  </g>
  <circle cx="32" cy="32" r="24" fill="url(#highlight)"/>
</svg>
```

**Step 3: Verify SVGs render correctly**

Open both files in the browser. The animated version should show a slow rotating light sweep. The static version should show the dot with a fixed highlight.

Run: `open design-system/brand/refracted-dot.svg && open design-system/brand/refracted-dot-static.svg`

**Step 4: Commit**

```bash
git add design-system/brand/refracted-dot.svg design-system/brand/refracted-dot-static.svg
git commit -m "feat: add refracted dot SVG — animated and static variants"
```

---

### Task 2: Create Wordmark SVG

**Files:**
- Create: `design-system/brand/wordmark.svg`
- Create: `design-system/brand/wordmark-dark.svg`

**Step 1: Create light wordmark SVG**

The wordmark is `UNICORN.LAND` in Silkscreen with the period in Opal. Since Silkscreen is a pixel font, we render text as SVG `<text>` with the font embedded via Google Fonts reference, AND provide a path-based fallback.

For maximum portability, convert the Silkscreen text to paths. Use the design system docs page to render the wordmark, then trace the text.

Alternative approach (simpler, works in browsers): SVG with embedded `@font-face` pointing to Silkscreen from Google Fonts.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 40" width="400" height="40">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Silkscreen&amp;display=swap');
    </style>
  </defs>
  <text x="0" y="30" font-family="'Silkscreen', cursive" font-size="32" fill="#1c1917">UNICORN</text>
  <text x="224" y="30" font-family="'Silkscreen', cursive" font-size="32" fill="#56dbd0">.</text>
  <text x="240" y="30" font-family="'Silkscreen', cursive" font-size="32" fill="#1c1917">LAND</text>
</svg>
```

Note: The x-positions will need tuning once rendered. Silkscreen at 32px: each character is roughly 28px wide. "UNICORN" = 7 chars x ~28 = ~196, period = ~28, "LAND" = 4 chars x ~28 = ~112. Total viewBox width ~336. Adjust after visual inspection.

**Step 2: Create dark variant**

Same SVG but text fill is `#fafaf9` (warm white) instead of `#1c1917`. Opal period stays `#56dbd0`.

**Step 3: Verify in browser**

Run: `open design-system/brand/wordmark.svg && open design-system/brand/wordmark-dark.svg`

Adjust x-positions and viewBox width until the spacing looks right. The period should have slightly less space around it than between letters — it's part of the word, not a separator.

**Step 4: Commit**

```bash
git add design-system/brand/wordmark.svg design-system/brand/wordmark-dark.svg
git commit -m "feat: add wordmark SVGs — light and dark variants"
```

---

### Task 3: Generate Favicon from Refracted Dot

**Files:**
- Create: `design-system/brand/favicon.svg` (optimized for favicon use)
- Create: `design-system/brand/favicon.ico` (if tooling allows, otherwise skip)
- Modify: `design-system/docs/index.html` — add favicon link

**Step 1: Create favicon SVG**

The favicon is the static refracted dot, optimized for 16x16 and 32x32 rendering. At favicon size, simplify: just the Opal circle with a subtle radial highlight. No animation, no complex gradients.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <defs>
    <radialGradient id="fav-hl" cx="38%" cy="38%" r="50%">
      <stop offset="0%" stop-color="#aeeae0"/>
      <stop offset="100%" stop-color="#56dbd0"/>
    </radialGradient>
  </defs>
  <circle cx="16" cy="16" r="16" fill="url(#fav-hl)"/>
</svg>
```

**Step 2: Add favicon to design system docs page**

In `design-system/docs/index.html`, add inside `<head>`:

```html
<link rel="icon" type="image/svg+xml" href="../brand/favicon.svg">
```

**Step 3: Verify favicon appears**

Open the design system docs page in a browser. Check the browser tab — should show the opal dot.

**Step 4: Commit**

```bash
git add design-system/brand/favicon.svg design-system/docs/index.html
git commit -m "feat: add favicon — refracted dot simplified for small sizes"
```

---

### Task 4: Create "Made in Unicorn.Land" Badge SVG

**Files:**
- Create: `design-system/brand/badge-light.svg`
- Create: `design-system/brand/badge-dark.svg`

**Step 1: Create light badge SVG**

Pill shape containing the refracted dot (12px, static) + "Made in UNICORN.LAND" in Silkscreen at 10px.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 28" width="200" height="28">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Silkscreen&amp;display=swap');
    </style>
    <radialGradient id="badge-hl" cx="38%" cy="38%" r="50%">
      <stop offset="0%" stop-color="#aeeae0"/>
      <stop offset="100%" stop-color="#56dbd0"/>
    </radialGradient>
  </defs>
  <!-- Pill background -->
  <rect x="0" y="0" width="200" height="28" rx="14" fill="#fafaf9" stroke="#e7e5e4" stroke-width="1"/>
  <!-- Dot -->
  <circle cx="20" cy="14" r="6" fill="url(#badge-hl)"/>
  <!-- Text -->
  <text x="34" y="18" font-family="'Silkscreen', cursive" font-size="10" fill="#1c1917" font-weight="400">Made in UNICORN.LAND</text>
</svg>
```

Note: Text x-position and total width will need tuning after rendering. Silkscreen at 10px is approximately 8px per character. "Made in UNICORN.LAND" = 21 chars x ~8 = ~168. Total SVG width: 20 (left padding) + 12 (dot) + 8 (gap) + 168 (text) + 12 (right padding) = ~220. Adjust viewBox after visual inspection.

**Step 2: Create dark badge SVG**

Same structure but: pill fill `#292524`, stroke `#44403c`, text fill `#fafaf9`.

**Step 3: Verify in browser**

Run: `open design-system/brand/badge-light.svg && open design-system/brand/badge-dark.svg`

**Step 4: Commit**

```bash
git add design-system/brand/badge-light.svg design-system/brand/badge-dark.svg
git commit -m "feat: add 'Made in Unicorn.Land' badge SVGs — light and dark"
```

---

### Task 5: Create Social Media Templates

**Files:**
- Create: `design-system/brand/social-avatar.html`
- Create: `design-system/brand/social-cover.html`

These are HTML files that render at exact platform dimensions. Open in a browser and screenshot to export.

**Step 1: Create avatar template**

Renders a square at multiple sizes (400x400 for general use). Refracted dot centered on warm white.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; display: flex; align-items: center; justify-content: center; width: 400px; height: 400px; background: #fafaf9; }
    .dot { width: 160px; height: 160px; border-radius: 50%; background: #56dbd0; position: relative; overflow: hidden; }
    .dot::before { content: ''; position: absolute; top: -20%; left: -20%; width: 140%; height: 140%; background: conic-gradient(from 200deg, transparent 0deg, rgba(122,232,219,0.6) 30deg, rgba(174,234,224,0.4) 90deg, transparent 120deg); }
    .dot::after { content: ''; position: absolute; top: 15%; left: 15%; width: 70%; height: 70%; border-radius: 50%; background: radial-gradient(circle at 35% 35%, rgba(255,255,255,0.5), transparent 60%); }
  </style>
</head>
<body><div class="dot"></div></body>
</html>
```

**Step 2: Create cover/banner template**

Renders at 1500x500 (Twitter/X cover size). Wordmark centered, tagline below, Opal rule line.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Silkscreen&family=Outfit:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 1500px; height: 500px; background: #fafaf9; gap: 24px; }
    .wordmark { font-family: 'Silkscreen', cursive; font-size: 56px; color: #1c1917; letter-spacing: 0.02em; }
    .wordmark .dot { color: #56dbd0; }
    .rule { width: 64px; height: 2px; background: #56dbd0; }
    .tagline { font-family: 'Outfit', sans-serif; font-size: 20px; color: #78716c; font-weight: 400; letter-spacing: 0.02em; }
  </style>
</head>
<body>
  <div class="wordmark">UNICORN<span class="dot">.</span>LAND</div>
  <div class="rule"></div>
  <div class="tagline">Making the invisible visible</div>
</body>
</html>
```

**Step 3: Verify in browser**

Run: `open design-system/brand/social-avatar.html && open design-system/brand/social-cover.html`

Check: avatar is a centered dot on warm white at 400x400. Cover is wordmark + rule + tagline centered on warm white at 1500x500.

**Step 4: Commit**

```bash
git add design-system/brand/social-avatar.html design-system/brand/social-cover.html
git commit -m "feat: add social media templates — avatar and cover/banner"
```

---

### Task 6: Add brand/ directory README

**Files:**
- Create: `design-system/brand/README.md`

**Step 1: Write the README**

```markdown
# Unicorn.Land Brand Assets

Production-ready brand identity files.

## Files

| File | Description | Usage |
|------|-------------|-------|
| `refracted-dot.svg` | Animated refracted dot (standalone mark) | Web, interactive contexts |
| `refracted-dot-static.svg` | Static refracted dot | Print, social, static exports |
| `favicon.svg` | Simplified dot for browser tabs | `<link rel="icon">` |
| `wordmark.svg` | UNICORN.LAND wordmark (light) | Light backgrounds |
| `wordmark-dark.svg` | UNICORN.LAND wordmark (dark) | Dark backgrounds |
| `badge-light.svg` | "Made in Unicorn.Land" badge | Light sub-product contexts |
| `badge-dark.svg` | "Made in Unicorn.Land" badge | Dark sub-product contexts |
| `social-avatar.html` | Social media avatar template | Screenshot at 400x400 |
| `social-cover.html` | Social media cover template | Screenshot at 1500x500 |

## Exporting

Social templates are HTML files. Open in a browser and screenshot to export as PNG.

## Brand Guidelines

See `docs/plans/2026-02-24-brand-identity-design.md` for full brand identity specification.
```

**Step 2: Commit**

```bash
git add design-system/brand/README.md
git commit -m "docs: add brand assets README"
```
