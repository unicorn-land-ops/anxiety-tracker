# Unicorn.Land Design System

Shared DNA across all Unicorn.Land projects.

**Mission:** Making the invisible visible.

## What This Is

A single source of truth for design tokens (colors, typography, spacing, radii, shadows) consumed in three ways:

1. **JSON tokens** -- raw W3C Design Token format
2. **CSS custom properties** -- drop-in stylesheet
3. **Tailwind 4 theme** -- `@theme` integration

## Quick Start

### JSON Tokens

```js
import tokens from "@unicorn-land/design-system/tokens";

const opal400 = tokens.color.opal["400"].$value; // "#56dbd0"
```

### CSS Custom Properties

```css
@import "@unicorn-land/design-system/css";

.card {
  background: var(--color-opal-400);
  border-radius: var(--radii-lg);
}
```

### Tailwind 4 Theme

```css
@import "tailwindcss";
@import "@unicorn-land/design-system/tailwind";
```

Then use classes like `bg-opal-400`, `text-stone-900`, `rounded-lg`, etc.

## Product Overrides

Each product can override tokens using the `data-theme` attribute:

```html
<body data-theme="bold-little-oracle">
```

Product themes layer on top of the base tokens via CSS specificity, letting each app feel distinct while sharing the same design bones.

## Tokens Reference

Open `docs/index.html` for a visual reference of all tokens.

## Structure

```
design-system/
  tokens/       -- W3C Design Token JSON files (source of truth)
  css/          -- Generated CSS custom properties
  tailwind/     -- Generated Tailwind 4 theme
  docs/         -- Visual token reference
```
