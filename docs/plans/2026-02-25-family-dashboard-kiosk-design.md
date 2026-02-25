# Family Dashboard Kiosk Redesign — "Living Canvas"

**Date:** 2026-02-25
**Project:** family-dashboard (Vite + React 19 + Tailwind 4 + Supabase)
**Scope:** Kiosk mode visual redesign (portrait orientation, wall display at 6-10 feet)

## Design Goals

- **Elegant + alive** — sophisticated with subtle delights, ambient color shifts, gentle motion
- **Time-of-day palette** — 5 phases that evolve through the day, driven by sunrise/sunset data
- **Better hierarchy** — Today dominates, near-future is clear, far-future is glanceable
- **Wall readability** — typography and spacing optimized for 6-10 foot viewing distance
- **Fun** — personality and delight without being childish
- **Shared DNA, own personality** — Outfit font + warm stone neutrals from Unicorn.Land design system, warm amber/gold accent unique to this product
- **Pi-safe** — no backdrop-filter, no JS animation loops, compositor-friendly transitions only

## Non-goals

- Content/emoji changes (later pass)
- Default/mobile dashboard changes (kiosk only)
- Data layer changes (all hooks stay the same)
- Ambient generative background (future enhancement, architecture supports it)

---

## 1. Time-of-Day Theme Engine

### 5 Phases

Sunrise/sunset data already fetched via Open-Meteo API (`useWeather()` hook).

| Phase | Trigger | Background Gradient | Card Surface | Card Border | Accent |
|-------|---------|-------------------|-------------|-------------|--------|
| **Night** | Sunset +90min → Sunrise -60min | `#1a1814` → `#201e1a` | `rgba(255,255,255,0.04)` | `rgba(255,255,255,0.06)` | `#f0a030` (rich warm gold) |
| **Dawn** | Sunrise -60min → Sunrise +30min | `#2a2018` → `#3d2c1e` | `rgba(255,220,180,0.05)` | `rgba(255,200,150,0.08)` | `#f5883a` (sunrise orange) |
| **Day** | Sunrise +30min → Sunset -90min | `#faf8f5` → `#f2efe8` | `rgba(255,255,255,0.85)` | `rgba(0,0,0,0.06)` | `#d96a1a` (burnt orange) |
| **Golden Hour** | Sunset -90min → Sunset | `#2d2218` → `#3a2a1a` | `rgba(255,200,120,0.06)` | `rgba(255,180,80,0.10)` | `#ffb833` (bright warm gold) |
| **Dusk** | Sunset → Sunset +90min | `#1e1a1f` → `#252028` | `rgba(200,180,230,0.04)` | `rgba(180,160,210,0.07)` | `#e88540` (amber-orange glow) |

Text colors:
- **Dark phases** (Night/Dawn/Golden Hour/Dusk): primary `rgba(255,255,255,0.90-0.95)`, secondary `rgba(255,255,255,0.55-0.68)`
- **Day phase**: primary `rgba(28,25,23,0.95)`, secondary `rgba(28,25,23,0.60)`

### Implementation

- `useTimeOfDay(sunrise, sunset)` hook — computes current phase string, updates every 60 seconds
- Sets CSS custom properties on `:root`: `--fd-bg-1`, `--fd-bg-2`, `--fd-card-bg`, `--fd-card-border`, `--fd-accent`, `--fd-text-1`, `--fd-text-2`
- `:root` has `transition: all 120s ease` — slow 2-minute fade between phases
- All components reference these custom properties instead of hardcoded values

---

## 2. Portrait Kiosk Layout

Replace the current 7-column equal grid with a hierarchical layout:

```
┌──────────────────────────────┐
│  HEADER                      │
│  Clock (shimmer) + Weather   │
├──────────────────────────────┤
│                              │
│  TODAY — Hero Card (~30%)    │
│  Full event list, weather,   │
│  expanded details, emojis    │
│                              │
├──────────────┬───────────────┤
│  Tomorrow    │  Day After    │
│  3-4 events  │  3-4 events   │
├──────────────┴───────────────┤
│  [Day4] [Day5] [Day6] [Day7]│
│  Compact: 2-3 events each   │
├──────────────┬───────────────┤
│  Rotating    │  Groceries    │
│  (Transit/   │  ────────────│
│  Horoscope/  │  Chores       │
│  Country)    │               │
├──────────────┴───────────────┤
│  STATUS BAR                  │
└──────────────────────────────┘
```

### Grid Definition

```css
.kiosk-grid {
  display: grid;
  grid-template-areas:
    'header'
    'today'
    'next'
    'compact'
    'utility'
    'status';
  grid-template-columns: 1fr;
  grid-template-rows: auto minmax(0, 1.4fr) minmax(0, 0.7fr) minmax(0, 0.5fr) minmax(0, 0.8fr) auto;
}
```

### Component Breakdown

- `KioskTodayCard` — hero treatment: large day title, full event list (uncapped), full weather detail, emoji person indicators sized up
- `KioskNextDayCard` — used for Tomorrow + Day After in a 2-column sub-grid. 3-4 events, weather badge, medium type
- `KioskCompactRow` — 4-column sub-grid for remaining days. Day name, weather icon, event count or brief summaries
- `KioskDashboard` — orchestrates all above + utility row + header

---

## 3. Clock Shimmer

The clock is the single "jewel" element — rainbow gradient shimmer on the time text, same technique as the Unicorn.Land wordmark.

### Phase-aware Palettes

| Phase | Gradient Colors |
|-------|----------------|
| **Night** | Sapphire → amethyst → deep gold |
| **Dawn** | Peach → rose → gold → amber |
| **Day** | Coral → gold → teal → sky |
| **Golden Hour** | Amber → orange → rose → gold |
| **Dusk** | Lavender → mauve → amber → indigo |

### CSS Technique

```css
.clock-shimmer {
  background: linear-gradient(90deg, var(--fd-shimmer-1), var(--fd-shimmer-2), var(--fd-shimmer-3), var(--fd-shimmer-4), var(--fd-shimmer-1));
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 8s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

Shimmer palette colors (`--fd-shimmer-1` through `--fd-shimmer-4`) are set by the time-of-day hook alongside the other theme properties. Transition between phase palettes uses the same 120s CSS transition.

---

## 4. Typography

**Font:** Outfit (Google Fonts, geometric sans) — shared Unicorn.Land DNA. Replaces Inter.

### Type Scale

| Element | Size | Weight |
|---------|------|--------|
| Clock | `clamp(4rem, 12vw, 11rem)` | 300 (light) |
| Today title ("Today") | `clamp(1.6rem, 2.5vw, 2.2rem)` | 700 |
| Today event summary | `clamp(1rem, 1.5vw, 1.4rem)` | 400 |
| Today event time | `clamp(0.85rem, 1.2vw, 1.1rem)` | 400 |
| Tomorrow/Next day title | `clamp(1.2rem, 1.8vw, 1.6rem)` | 600 |
| Tomorrow event summary | `clamp(0.85rem, 1.2vw, 1.1rem)` | 400 |
| Compact day title | `clamp(0.9rem, 1.1vw, 1.15rem)` | 600 |
| Compact event | `clamp(0.75rem, 0.9vw, 0.95rem)` | 400 |
| Weather temperature | `clamp(1.1rem, 1.6vw, 1.5rem)` | 500 |
| Status bar | `clamp(0.65rem, 0.8vw, 0.85rem)` | 400 |

All sizes bumped 20-40% from current values. Today content is dramatically larger for wall readability.

---

## 5. Card Design

- **Border radius:** `1.25rem` (up from `1rem`) — softer, friendlier with Outfit
- **Today card:** 4px left accent border in `var(--fd-accent)`, slightly higher surface opacity
- **Event person indicators:** Emojis (existing system), sized appropriately per card tier
- **Card surfaces:** Phase-aware (see Section 1 table)
- **No backdrop-filter** (Pi GPU constraint preserved)
- **No new animations** beyond clock shimmer and 120s phase transitions

---

## 6. Spacing

- Card padding: `clamp(14px, 1.5vw, 22px)` (up from `clamp(7-12px)`)
- Event row gaps: `clamp(6px, 0.8vw, 10px)` (up from `5px`)
- Section gaps between Today/Next/Compact: `clamp(12px, 1.5vw, 20px)`
- Header bottom margin increased for breathing room

---

## 7. What Changes vs. What Stays

### New systems
- `useTimeOfDay(sunrise, sunset)` hook
- CSS custom property theme engine (5 phase variable sets)
- Clock shimmer component

### Modified
- `index.css` — new kiosk grid, CSS custom properties, Outfit font
- `KioskDashboard.tsx` — new layout structure
- `KioskWeekGrid.tsx` → split into `KioskTodayCard`, `KioskNextDayCard`, `KioskCompactRow`
- `Header.tsx` — integrate shimmer clock for kiosk variant
- `constants.ts` — update COLORS to reference theme system

### Unchanged
- All data hooks (weather, calendar, timers, groceries, chores, transit, horoscope, country)
- All utility panels (internal rendering)
- Content rotation system
- Error boundaries
- Default/mobile dashboard
- Supabase schema & API integrations

---

## 8. Performance Budget

- No `backdrop-filter`
- No JS animation loops
- CSS `transition` for phase changes (compositor-only color interpolation)
- One `background-position` keyframe animation (clock shimmer, single composited layer)
- Phase computation: simple time comparison, runs once per minute via `setInterval`
- Total new CSS: ~200 lines of custom properties + grid definitions
- Total new JS: ~80 lines (useTimeOfDay hook + shimmer component)

---

## 9. Future Enhancement: Ambient Background (Approach C)

The architecture supports layering a generative CSS gradient mesh or canvas background behind all cards. The theme engine already provides phase-aware color tokens that a background layer can consume. This is intentionally deferred to avoid Pi GPU risk, but the door is open.
