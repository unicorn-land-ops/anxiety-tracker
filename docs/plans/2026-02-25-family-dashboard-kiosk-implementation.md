# Family Dashboard Kiosk Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the kiosk view into a "Living Canvas" — a portrait-optimized wall display with a 5-phase time-of-day palette, hierarchical calendar layout, Outfit typography, and a shimmering clock.

**Architecture:** New `useTimeOfDay` hook reads sunrise/sunset from the existing weather API data and sets CSS custom properties on `:root` every 60 seconds. All color tokens become CSS variables that transition over 120s. The kiosk layout splits from a 7-column grid into a hierarchical Today-hero / Tomorrow-Next / Compact-rest layout. Clock gets a gradient shimmer effect with phase-aware palettes.

**Tech Stack:** React 19, Tailwind CSS 4, CSS custom properties, date-fns/date-fns-tz, existing Open-Meteo weather API (sunrise/sunset fields)

**Design doc:** `docs/plans/2026-02-25-family-dashboard-kiosk-design.md`

---

## Task 1: Swap Inter → Outfit Font

**Files:**
- Modify: `index.html` (line 9 — Google Fonts link)
- Modify: `src/index.css` (line 5 — `--font-family-sans`)

**Step 1: Update Google Fonts link in index.html**

Replace the Inter font link:
```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

**Step 2: Update Tailwind theme font-family in index.css**

Change line 5 of `src/index.css`:
```css
--font-family-sans: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Step 3: Verify in browser**

Run: `cd /Users/joshua/Documents/Unicorn.Land/family-dashboard && npm run dev`
Open `http://localhost:5173/family-dashboard/?view=kiosk` — confirm Outfit font renders everywhere.

**Step 4: Commit**

```bash
git add index.html src/index.css
git commit -m "style(kiosk): swap Inter → Outfit font family"
```

---

## Task 2: Create useTimeOfDay Hook

**Files:**
- Create: `src/hooks/useTimeOfDay.ts`

**Step 1: Create the hook**

```typescript
import { useState, useEffect } from 'react';
import { useWeather } from './useWeather';

export type TimePhase = 'night' | 'dawn' | 'day' | 'golden' | 'dusk';

function parseISOToMinutes(iso: string): number {
  const date = new Date(iso);
  return date.getHours() * 60 + date.getMinutes();
}

function computePhase(nowMinutes: number, sunriseMin: number, sunsetMin: number): TimePhase {
  const dawnStart = sunriseMin - 60;
  const dawnEnd = sunriseMin + 30;
  const goldenStart = sunsetMin - 90;
  const duskEnd = sunsetMin + 90;

  if (nowMinutes >= dawnStart && nowMinutes < dawnEnd) return 'dawn';
  if (nowMinutes >= dawnEnd && nowMinutes < goldenStart) return 'day';
  if (nowMinutes >= goldenStart && nowMinutes < sunsetMin) return 'golden';
  if (nowMinutes >= sunsetMin && nowMinutes < duskEnd) return 'dusk';
  return 'night';
}

export function useTimeOfDay(): TimePhase {
  const { data: weather } = useWeather();

  const getPhase = (): TimePhase => {
    if (!weather?.daily?.sunrise?.[0] || !weather?.daily?.sunset?.[0]) {
      // Fallback: assume day if no weather data yet
      const hour = new Date().getHours();
      return hour >= 7 && hour < 17 ? 'day' : 'night';
    }
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const sunriseMin = parseISOToMinutes(weather.daily.sunrise[0]);
    const sunsetMin = parseISOToMinutes(weather.daily.sunset[0]);
    return computePhase(nowMinutes, sunriseMin, sunsetMin);
  };

  const [phase, setPhase] = useState<TimePhase>(getPhase);

  useEffect(() => {
    // Recompute immediately when weather data arrives
    setPhase(getPhase());

    const id = setInterval(() => {
      setPhase(getPhase());
    }, 60_000);

    return () => clearInterval(id);
  }, [weather?.daily?.sunrise?.[0], weather?.daily?.sunset?.[0]]);

  return phase;
}
```

**Step 2: Verify TypeScript compiles**

Run: `cd /Users/joshua/Documents/Unicorn.Land/family-dashboard && npx tsc --noEmit`
Expected: No errors.

**Step 3: Commit**

```bash
git add src/hooks/useTimeOfDay.ts
git commit -m "feat(kiosk): add useTimeOfDay hook with 5-phase sunrise/sunset logic"
```

---

## Task 3: Add CSS Theme Variables for All 5 Phases

**Files:**
- Modify: `src/index.css` — add phase-specific custom properties and transition

**Step 1: Add the theme variable system**

After the existing `@theme` block in `src/index.css`, add:

```css
/* Time-of-day theme phases — set via JS on :root */
:root {
  /* Default: night phase */
  --fd-bg-1: #1a1814;
  --fd-bg-2: #201e1a;
  --fd-card-bg: rgba(255, 255, 255, 0.04);
  --fd-card-border: rgba(255, 255, 255, 0.06);
  --fd-accent: #f0a030;
  --fd-text-1: rgba(255, 255, 255, 0.90);
  --fd-text-2: rgba(255, 255, 255, 0.55);
  --fd-shimmer-1: #1a5ab8;
  --fd-shimmer-2: #7c3aed;
  --fd-shimmer-3: #d4a017;
  --fd-shimmer-4: #1a5ab8;

  transition: --fd-bg-1 120s ease,
              --fd-bg-2 120s ease,
              --fd-accent 120s ease;
}

:root[data-phase="night"] {
  --fd-bg-1: #1a1814;
  --fd-bg-2: #201e1a;
  --fd-card-bg: rgba(255, 255, 255, 0.04);
  --fd-card-border: rgba(255, 255, 255, 0.06);
  --fd-accent: #f0a030;
  --fd-text-1: rgba(255, 255, 255, 0.90);
  --fd-text-2: rgba(255, 255, 255, 0.55);
  --fd-shimmer-1: #1a5ab8;
  --fd-shimmer-2: #7c3aed;
  --fd-shimmer-3: #d4a017;
  --fd-shimmer-4: #1a5ab8;
}

:root[data-phase="dawn"] {
  --fd-bg-1: #2a2018;
  --fd-bg-2: #3d2c1e;
  --fd-card-bg: rgba(255, 220, 180, 0.05);
  --fd-card-border: rgba(255, 200, 150, 0.08);
  --fd-accent: #f5883a;
  --fd-text-1: rgba(255, 255, 255, 0.95);
  --fd-text-2: rgba(255, 255, 255, 0.65);
  --fd-shimmer-1: #f5a070;
  --fd-shimmer-2: #e87090;
  --fd-shimmer-3: #f0c040;
  --fd-shimmer-4: #d4802a;
}

:root[data-phase="day"] {
  --fd-bg-1: #faf8f5;
  --fd-bg-2: #f2efe8;
  --fd-card-bg: rgba(255, 255, 255, 0.85);
  --fd-card-border: rgba(0, 0, 0, 0.06);
  --fd-accent: #d96a1a;
  --fd-text-1: rgba(28, 25, 23, 0.95);
  --fd-text-2: rgba(28, 25, 23, 0.60);
  --fd-shimmer-1: #e86040;
  --fd-shimmer-2: #d4a017;
  --fd-shimmer-3: #2aa8a0;
  --fd-shimmer-4: #4a90d0;
}

:root[data-phase="golden"] {
  --fd-bg-1: #2d2218;
  --fd-bg-2: #3a2a1a;
  --fd-card-bg: rgba(255, 200, 120, 0.06);
  --fd-card-border: rgba(255, 180, 80, 0.10);
  --fd-accent: #ffb833;
  --fd-text-1: rgba(255, 255, 255, 0.95);
  --fd-text-2: rgba(255, 255, 255, 0.68);
  --fd-shimmer-1: #d4802a;
  --fd-shimmer-2: #e86040;
  --fd-shimmer-3: #e87090;
  --fd-shimmer-4: #f0c040;
}

:root[data-phase="dusk"] {
  --fd-bg-1: #1e1a1f;
  --fd-bg-2: #252028;
  --fd-card-bg: rgba(200, 180, 230, 0.04);
  --fd-card-border: rgba(180, 160, 210, 0.07);
  --fd-accent: #e88540;
  --fd-text-1: rgba(255, 255, 255, 0.90);
  --fd-text-2: rgba(255, 255, 255, 0.58);
  --fd-shimmer-1: #a07ad0;
  --fd-shimmer-2: #c070a0;
  --fd-shimmer-3: #d4a050;
  --fd-shimmer-4: #5050a0;
}
```

**Step 2: Update the body background to use new variables**

Replace the existing `body` rule (line 20-24 of `src/index.css`):

```css
body {
  font-family: var(--font-family-sans);
  background: linear-gradient(135deg, var(--fd-bg-1) 0%, var(--fd-bg-2) 100%);
  color: var(--fd-text-1);
  overflow: hidden;
}
```

**Step 3: Update the `@theme` block color tokens**

Replace the hardcoded color tokens in the `@theme` block:
```css
@theme {
  --font-family-sans: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --color-bg-primary: var(--fd-bg-1);
  --color-bg-secondary: var(--fd-bg-2);
  --color-accent-gold: var(--fd-accent);
  --color-text-primary: var(--fd-text-1);
  --color-text-secondary: var(--fd-text-2);
  --color-surface: var(--fd-card-bg);
}
```

Note: Tailwind 4's `@theme` may not support `var()` references for all properties. If this causes issues, keep the `@theme` block with static fallback values and instead override in the `:root` selectors directly. The `.card-glass` class and component styles should reference `var(--fd-*)` directly.

**Step 4: Update `.card-glass` to use theme variables**

```css
.card-glass {
  background: var(--fd-card-bg);
  border-radius: 1.25rem;
  border: 1px solid var(--fd-card-border);
}
```

**Step 5: Commit**

```bash
git add src/index.css
git commit -m "style(kiosk): add 5-phase time-of-day CSS theme variables"
```

---

## Task 4: Wire useTimeOfDay to the DOM

**Files:**
- Modify: `src/components/kiosk/KioskDashboard.tsx` — set `data-phase` attribute on `:root`

**Step 1: Add phase attribute setter**

At the top of `KioskDashboard`, import and use the hook, then sync to the DOM:

```typescript
import { useTimeOfDay } from '../../hooks/useTimeOfDay';
```

Inside the component function, before the return:

```typescript
const phase = useTimeOfDay();

useEffect(() => {
  document.documentElement.setAttribute('data-phase', phase);
  return () => document.documentElement.removeAttribute('data-phase');
}, [phase]);
```

Add `useEffect` to the imports from React (it's not currently imported):
```typescript
import { useEffect } from 'react';
```

**Step 2: Verify in browser**

Open kiosk view. Inspect `<html>` element — should have `data-phase="day"` (or whatever phase matches current time). Background and card colors should update based on the phase.

**Step 3: Commit**

```bash
git add src/components/kiosk/KioskDashboard.tsx
git commit -m "feat(kiosk): wire useTimeOfDay hook to set data-phase on root element"
```

---

## Task 5: Add Clock Shimmer Effect

**Files:**
- Modify: `src/index.css` — add shimmer keyframe and class
- Modify: `src/components/clock/Clock.tsx` — apply shimmer class in kiosk mode

**Step 1: Add shimmer CSS to index.css**

Add after the phase variable blocks:

```css
/* Clock shimmer — gradient text animation */
@keyframes clock-shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.clock-shimmer {
  background: linear-gradient(
    90deg,
    var(--fd-shimmer-1),
    var(--fd-shimmer-2),
    var(--fd-shimmer-3),
    var(--fd-shimmer-4),
    var(--fd-shimmer-1)
  );
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: clock-shimmer 8s ease-in-out infinite;
}
```

**Step 2: Apply shimmer class to Clock component**

In `src/components/clock/Clock.tsx`, replace the clock time `<div>` (lines 31-40):

```typescript
<div
  className={`font-light tracking-tight leading-none tabular-nums ${
    isKiosk ? 'clock-shimmer' : 'text-text-primary'
  }`}
  style={{
    fontSize: isKiosk
      ? 'clamp(4rem, 12vw, 11rem)'
      : 'clamp(2rem, 6vw, 6rem)',
  }}
>
  {time}
</div>
```

Note: Changed `font-extralight` to `font-light` (weight 300) for better shimmer readability on Outfit.

**Step 3: Verify in browser**

Kiosk clock should have a slow-moving gradient shimmer. Non-kiosk clock should still be plain white text.

**Step 4: Commit**

```bash
git add src/index.css src/components/clock/Clock.tsx
git commit -m "feat(kiosk): add rainbow gradient shimmer to clock with phase-aware palette"
```

---

## Task 6: Create KioskTodayCard Component

**Files:**
- Create: `src/components/kiosk/KioskTodayCard.tsx`

**Step 1: Create the hero Today card**

```typescript
import { format, isToday } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { CALENDAR_FEEDS, HOME_TIMEZONE } from '../../lib/calendar/config';
import type { CalendarEvent } from '../../lib/calendar/types';
import type { WeatherResponse } from '../../lib/api/openMeteo';
import { WeatherIcon } from '../weather/WeatherIcon';

interface KioskTodayCardProps {
  day: {
    date: Date;
    dateStr: string;
    events: CalendarEvent[];
  };
  weather: WeatherResponse | null | undefined;
}

function getEventTimeLabel(event: CalendarEvent): string {
  if (event.isAllDay) return 'All day';
  return formatInTimeZone(event.startTime, HOME_TIMEZONE, 'HH:mm');
}

function getEventPeopleLabel(event: CalendarEvent): string {
  const emojis = event.persons
    .map((id) => CALENDAR_FEEDS.find((feed) => feed.id === id)?.emoji ?? '')
    .filter(Boolean)
    .join('');
  return emojis || '•';
}

export function KioskTodayCard({ day, weather }: KioskTodayCardProps) {
  const today = isToday(day.date);
  const dayTitle = today ? 'Today' : format(day.date, 'EEEE');
  const dateLabel = format(day.date, 'MMMM d');
  const dailyWeather = weather?.daily
    ? {
        high: weather.daily.temperature_2m_max[0],
        low: weather.daily.temperature_2m_min[0],
        weatherCode: weather.daily.weather_code[0],
      }
    : null;

  return (
    <section className="kiosk-today-card">
      <header className="flex items-center justify-between mb-[clamp(8px,1vw,14px)]">
        <div>
          <h2
            className="font-bold leading-none"
            style={{
              fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
              color: 'var(--fd-accent)',
            }}
          >
            {dayTitle}
          </h2>
          <span
            className="block mt-1"
            style={{
              fontSize: 'clamp(0.9rem, 1.3vw, 1.15rem)',
              color: 'var(--fd-text-2)',
            }}
          >
            {dateLabel}
          </span>
        </div>
        {dailyWeather && (
          <div className="flex items-center gap-[clamp(6px,0.8vw,10px)]">
            <WeatherIcon
              code={dailyWeather.weatherCode}
              style={{ color: 'var(--fd-accent)' }}
              size="clamp(1.6rem, 2vw, 2.2rem)"
            />
            <span
              className="font-medium tabular-nums"
              style={{
                fontSize: 'clamp(1.1rem, 1.6vw, 1.5rem)',
                color: 'var(--fd-text-1)',
              }}
            >
              {Math.round(dailyWeather.high)}&deg; / {Math.round(dailyWeather.low)}&deg;
            </span>
          </div>
        )}
      </header>

      {day.events.length > 0 ? (
        <ul className="flex flex-col gap-[clamp(6px,0.8vw,10px)]">
          {day.events.map((event) => (
            <li
              key={`${event.id}-${event.startTime.toISOString()}`}
              className="kiosk-today-event-row"
            >
              <span
                className="tabular-nums whitespace-nowrap"
                style={{
                  fontSize: 'clamp(0.85rem, 1.2vw, 1.1rem)',
                  color: 'var(--fd-text-2)',
                }}
              >
                {getEventTimeLabel(event)}
              </span>
              <span
                style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.2rem)' }}
              >
                {getEventPeopleLabel(event)}
              </span>
              <span
                className="min-w-0 truncate"
                style={{
                  fontSize: 'clamp(1rem, 1.5vw, 1.4rem)',
                  color: 'var(--fd-text-1)',
                }}
                title={event.summary}
              >
                {event.summary}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p
          style={{
            fontSize: 'clamp(0.95rem, 1.3vw, 1.2rem)',
            color: 'var(--fd-text-2)',
            opacity: 0.6,
          }}
        >
          No events today
        </p>
      )}
    </section>
  );
}
```

**Step 2: Add CSS for the today card**

In `src/index.css`, add after the existing kiosk styles:

```css
.kiosk-today-card {
  min-height: 0;
  display: flex;
  flex-direction: column;
  border-left: 4px solid var(--fd-accent);
  border-radius: 1.25rem;
  background: var(--fd-card-bg);
  border-top: 1px solid var(--fd-card-border);
  border-right: 1px solid var(--fd-card-border);
  border-bottom: 1px solid var(--fd-card-border);
  padding: clamp(14px, 1.5vw, 22px);
  overflow: hidden;
}

.kiosk-today-event-row {
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr);
  gap: clamp(8px, 0.8vw, 12px);
  align-items: center;
  border-radius: 0.65rem;
  padding: clamp(6px, 0.6vw, 10px);
  background: rgba(255, 255, 255, 0.03);
}

:root[data-phase="day"] .kiosk-today-event-row {
  background: rgba(0, 0, 0, 0.03);
}
```

**Step 3: Verify TypeScript compiles**

Run: `cd /Users/joshua/Documents/Unicorn.Land/family-dashboard && npx tsc --noEmit`

**Step 4: Commit**

```bash
git add src/components/kiosk/KioskTodayCard.tsx src/index.css
git commit -m "feat(kiosk): add KioskTodayCard hero component with large typography"
```

---

## Task 7: Create KioskNextDayCard Component

**Files:**
- Create: `src/components/kiosk/KioskNextDayCard.tsx`

**Step 1: Create the secondary day card**

```typescript
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { CALENDAR_FEEDS, HOME_TIMEZONE } from '../../lib/calendar/config';
import type { CalendarEvent } from '../../lib/calendar/types';
import { WeatherIcon } from '../weather/WeatherIcon';

interface KioskNextDayCardProps {
  day: {
    date: Date;
    dateStr: string;
    events: CalendarEvent[];
  };
  dailyWeather: {
    high: number;
    low: number;
    weatherCode: number;
  } | null;
}

const MAX_EVENTS = 4;

function getEventTimeLabel(event: CalendarEvent): string {
  if (event.isAllDay) return 'All day';
  return formatInTimeZone(event.startTime, HOME_TIMEZONE, 'HH:mm');
}

function getEventPeopleLabel(event: CalendarEvent): string {
  const emojis = event.persons
    .map((id) => CALENDAR_FEEDS.find((feed) => feed.id === id)?.emoji ?? '')
    .filter(Boolean)
    .join('');
  return emojis || '•';
}

export function KioskNextDayCard({ day, dailyWeather }: KioskNextDayCardProps) {
  const dayTitle = format(day.date, 'EEEE');
  const dateLabel = format(day.date, 'MMM d');
  const visibleEvents = day.events.slice(0, MAX_EVENTS);
  const hiddenCount = Math.max(0, day.events.length - MAX_EVENTS);

  return (
    <section className="kiosk-next-day-card">
      <header className="mb-[clamp(4px,0.6vw,8px)]">
        <div className="flex items-center justify-between gap-2">
          <h3
            className="font-semibold leading-none"
            style={{
              fontSize: 'clamp(1.2rem, 1.8vw, 1.6rem)',
              color: 'var(--fd-text-1)',
            }}
          >
            {dayTitle}
          </h3>
          <span
            style={{
              fontSize: 'clamp(0.78rem, 0.9vw, 1rem)',
              color: 'var(--fd-text-2)',
            }}
          >
            {dateLabel}
          </span>
        </div>
        {dailyWeather && (
          <div
            className="mt-1 inline-flex items-center gap-1"
            style={{
              color: 'var(--fd-text-2)',
              fontSize: 'clamp(0.78rem, 0.9vw, 1rem)',
            }}
          >
            <WeatherIcon
              code={dailyWeather.weatherCode}
              style={{ color: 'var(--fd-accent)' }}
              size="clamp(1.1rem, 1.3vw, 1.5rem)"
            />
            <span className="tabular-nums">
              {Math.round(dailyWeather.high)}&deg; / {Math.round(dailyWeather.low)}&deg;
            </span>
          </div>
        )}
      </header>

      {visibleEvents.length > 0 ? (
        <ul className="flex flex-col gap-[clamp(4px,0.5vw,6px)]">
          {visibleEvents.map((event) => (
            <li
              key={`${event.id}-${event.startTime.toISOString()}`}
              className="kiosk-next-event-row"
            >
              <span
                className="tabular-nums whitespace-nowrap"
                style={{
                  fontSize: 'clamp(0.72rem, 0.85vw, 0.95rem)',
                  color: 'var(--fd-text-2)',
                }}
              >
                {getEventTimeLabel(event)}
              </span>
              <span style={{ fontSize: 'clamp(0.78rem, 0.9vw, 1rem)' }}>
                {getEventPeopleLabel(event)}
              </span>
              <span
                className="min-w-0 truncate"
                style={{
                  fontSize: 'clamp(0.85rem, 1.2vw, 1.1rem)',
                  color: 'var(--fd-text-1)',
                }}
                title={event.summary}
              >
                {event.summary}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p
          style={{
            fontSize: 'clamp(0.78rem, 0.9vw, 1rem)',
            color: 'var(--fd-text-2)',
            opacity: 0.5,
          }}
        >
          No events
        </p>
      )}

      {hiddenCount > 0 && (
        <p
          className="mt-auto pt-1"
          style={{
            fontSize: 'clamp(0.72rem, 0.82vw, 0.92rem)',
            color: 'var(--fd-accent)',
          }}
        >
          +{hiddenCount} more
        </p>
      )}
    </section>
  );
}
```

**Step 2: Add CSS**

In `src/index.css`:

```css
.kiosk-next-day-card {
  min-height: 0;
  display: flex;
  flex-direction: column;
  border-radius: 1.25rem;
  background: var(--fd-card-bg);
  border: 1px solid var(--fd-card-border);
  padding: clamp(10px, 1.2vw, 18px);
  overflow: hidden;
}

.kiosk-next-event-row {
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr);
  gap: clamp(6px, 0.6vw, 8px);
  align-items: center;
  border-radius: 0.55rem;
  padding: clamp(4px, 0.4vw, 7px);
  background: rgba(255, 255, 255, 0.03);
}

:root[data-phase="day"] .kiosk-next-event-row {
  background: rgba(0, 0, 0, 0.03);
}
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

**Step 4: Commit**

```bash
git add src/components/kiosk/KioskNextDayCard.tsx src/index.css
git commit -m "feat(kiosk): add KioskNextDayCard for tomorrow and day-after cards"
```

---

## Task 8: Create KioskCompactRow Component

**Files:**
- Create: `src/components/kiosk/KioskCompactRow.tsx`

**Step 1: Create the compact 4-day row**

```typescript
import { format } from 'date-fns';
import type { CalendarEvent } from '../../lib/calendar/types';
import { WeatherIcon } from '../weather/WeatherIcon';

interface CompactDay {
  date: Date;
  dateStr: string;
  events: CalendarEvent[];
}

interface KioskCompactRowProps {
  days: CompactDay[];
  dailyWeather: Array<{
    high: number;
    low: number;
    weatherCode: number;
  } | null>;
}

const MAX_EVENTS_COMPACT = 3;

export function KioskCompactRow({ days, dailyWeather }: KioskCompactRowProps) {
  return (
    <div className="kiosk-compact-grid">
      {days.map((day, i) => {
        const dayTitle = format(day.date, 'EEE');
        const weather = dailyWeather[i];
        const visibleEvents = day.events.slice(0, MAX_EVENTS_COMPACT);
        const hiddenCount = Math.max(0, day.events.length - MAX_EVENTS_COMPACT);

        return (
          <section key={day.dateStr} className="kiosk-compact-card">
            <header className="mb-1">
              <div className="flex items-center justify-between">
                <h4
                  className="font-semibold leading-none"
                  style={{
                    fontSize: 'clamp(0.9rem, 1.1vw, 1.15rem)',
                    color: 'var(--fd-text-1)',
                  }}
                >
                  {dayTitle}
                </h4>
                {weather && (
                  <div
                    className="flex items-center gap-0.5"
                    style={{
                      fontSize: 'clamp(0.68rem, 0.75vw, 0.85rem)',
                      color: 'var(--fd-text-2)',
                    }}
                  >
                    <WeatherIcon
                      code={weather.weatherCode}
                      style={{ color: 'var(--fd-accent)' }}
                      size="clamp(0.9rem, 1vw, 1.2rem)"
                    />
                    <span className="tabular-nums">
                      {Math.round(weather.high)}&deg;
                    </span>
                  </div>
                )}
              </div>
            </header>

            {visibleEvents.length > 0 ? (
              <ul className="flex flex-col gap-[clamp(2px,0.3vw,4px)]">
                {visibleEvents.map((event) => (
                  <li
                    key={`${event.id}-${event.startTime.toISOString()}`}
                    className="truncate"
                    style={{
                      fontSize: 'clamp(0.75rem, 0.9vw, 0.95rem)',
                      color: 'var(--fd-text-1)',
                      opacity: 0.85,
                    }}
                    title={event.summary}
                  >
                    {event.summary}
                  </li>
                ))}
              </ul>
            ) : (
              <p
                style={{
                  fontSize: 'clamp(0.72rem, 0.82vw, 0.9rem)',
                  color: 'var(--fd-text-2)',
                  opacity: 0.4,
                }}
              >
                Free
              </p>
            )}

            {hiddenCount > 0 && (
              <p
                className="mt-auto"
                style={{
                  fontSize: 'clamp(0.66rem, 0.72vw, 0.82rem)',
                  color: 'var(--fd-accent)',
                }}
              >
                +{hiddenCount}
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
```

**Step 2: Add CSS**

In `src/index.css`:

```css
.kiosk-compact-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(8px, 0.8vw, 12px);
  min-height: 0;
}

.kiosk-compact-card {
  min-height: 0;
  display: flex;
  flex-direction: column;
  border-radius: 1.25rem;
  background: var(--fd-card-bg);
  border: 1px solid var(--fd-card-border);
  padding: clamp(8px, 0.8vw, 14px);
  overflow: hidden;
}
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

**Step 4: Commit**

```bash
git add src/components/kiosk/KioskCompactRow.tsx src/index.css
git commit -m "feat(kiosk): add KioskCompactRow for remaining 4 days in compact grid"
```

---

## Task 9: Rewrite KioskDashboard Layout

**Files:**
- Modify: `src/components/kiosk/KioskDashboard.tsx` — new hierarchical layout
- Modify: `src/index.css` — new kiosk grid definition

**Step 1: Update the kiosk grid CSS**

Replace the existing `.kiosk-grid` rule in `src/index.css`:

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

Add a new grid area for the next-day row:

```css
.kiosk-next-row {
  grid-area: next;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(10px, 1vw, 16px);
  min-height: 0;
}

.kiosk-compact-area {
  grid-area: compact;
  min-height: 0;
}
```

**Step 2: Rewrite KioskDashboard.tsx**

Replace the entire file:

```typescript
import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Header } from '../layout/Header';
import { StatusBar } from '../layout/StatusBar';
import { KioskTodayCard } from './KioskTodayCard';
import { KioskNextDayCard } from './KioskNextDayCard';
import { KioskCompactRow } from './KioskCompactRow';
import { TimerPanel } from '../timer/TimerPanel';
import { ContentRotator } from '../sidebar/ContentRotator';
import { TransitPanel } from '../sidebar/TransitPanel';
import { HoroscopePanel } from '../sidebar/HoroscopePanel';
import { CountryPanel } from '../sidebar/CountryPanel';
import { RotationIndicator } from '../sidebar/RotationIndicator';
import { GroceryPanel } from '../grocery/GroceryPanel';
import { ChorePanel } from '../chore/ChorePanel';
import { PanelFallback, GlobalFallback, logError } from '../ErrorFallback';
import { useTimers } from '../../hooks/useTimers';
import { usePriorityInterrupt } from '../../hooks/usePriorityInterrupt';
import { useContentRotation } from '../../hooks/useContentRotation';
import { useCalendar } from '../../hooks/useCalendar';
import { useWeather } from '../../hooks/useWeather';
import { useTimeOfDay } from '../../hooks/useTimeOfDay';

function getDailyWeather(weather: ReturnType<typeof useWeather>['data'], dayIndex: number) {
  if (!weather?.daily || dayIndex >= weather.daily.time.length) return null;
  return {
    high: weather.daily.temperature_2m_max[dayIndex],
    low: weather.daily.temperature_2m_min[dayIndex],
    weatherCode: weather.daily.weather_code[dayIndex],
  };
}

export function KioskDashboard() {
  const { activeCount: activeTimerCount, completedTimers } = useTimers();
  const priority = usePriorityInterrupt(activeTimerCount, completedTimers.length);
  const { activeIndex, goTo, panelCount } = useContentRotation(priority.rotationPaused);
  const { days } = useCalendar();
  const { data: weather } = useWeather();
  const phase = useTimeOfDay();

  useEffect(() => {
    document.documentElement.setAttribute('data-phase', phase);
    return () => document.documentElement.removeAttribute('data-phase');
  }, [phase]);

  const todayDay = days[0];
  const tomorrowDay = days[1];
  const dayAfterDay = days[2];
  const compactDays = days.slice(3, 7);
  const compactWeather = compactDays.map((_, i) => getDailyWeather(weather, i + 3));

  return (
    <ErrorBoundary FallbackComponent={GlobalFallback} onError={logError}>
      <div className="kiosk-grid h-dvh w-screen overflow-hidden p-[clamp(14px,1.5vw,24px)] gap-[clamp(10px,1vw,18px)]">
        <ErrorBoundary FallbackComponent={PanelFallback} onError={logError}>
          <Header variant="kiosk" />
        </ErrorBoundary>

        {todayDay && (
          <ErrorBoundary FallbackComponent={PanelFallback} onError={logError}>
            <div style={{ gridArea: 'today', minHeight: 0, overflow: 'hidden' }}>
              <KioskTodayCard day={todayDay} weather={weather} />
            </div>
          </ErrorBoundary>
        )}

        <div className="kiosk-next-row">
          {tomorrowDay && (
            <ErrorBoundary FallbackComponent={PanelFallback} onError={logError}>
              <KioskNextDayCard
                day={tomorrowDay}
                dailyWeather={getDailyWeather(weather, 1)}
              />
            </ErrorBoundary>
          )}
          {dayAfterDay && (
            <ErrorBoundary FallbackComponent={PanelFallback} onError={logError}>
              <KioskNextDayCard
                day={dayAfterDay}
                dailyWeather={getDailyWeather(weather, 2)}
              />
            </ErrorBoundary>
          )}
        </div>

        <ErrorBoundary FallbackComponent={PanelFallback} onError={logError}>
          <div className="kiosk-compact-area">
            <KioskCompactRow days={compactDays} dailyWeather={compactWeather} />
          </div>
        </ErrorBoundary>

        <div className="kiosk-utility-row">
          <ErrorBoundary FallbackComponent={PanelFallback} onError={logError}>
            <div className="kiosk-utility-primary">
              {priority.mode === 'priority' ? (
                <TimerPanel variant="compact" />
              ) : (
                <div className="flex flex-col h-full">
                  <ContentRotator activeIndex={activeIndex}>
                    <TransitPanel />
                    <HoroscopePanel />
                    <CountryPanel />
                  </ContentRotator>
                  <div className="pointer-events-none">
                    <RotationIndicator
                      activeIndex={activeIndex}
                      panelCount={panelCount}
                      labels={['Transit', 'Horoscopes', 'Country']}
                      onSelect={goTo}
                    />
                  </div>
                </div>
              )}
            </div>
          </ErrorBoundary>

          <div className="kiosk-utility-secondary">
            <ErrorBoundary FallbackComponent={PanelFallback} onError={logError}>
              <GroceryPanel variant="compact" />
            </ErrorBoundary>
            <ErrorBoundary FallbackComponent={PanelFallback} onError={logError}>
              <ChorePanel variant="compact" />
            </ErrorBoundary>
          </div>
        </div>

        <StatusBar variant="kiosk" />
      </div>
    </ErrorBoundary>
  );
}
```

**Step 3: Verify in browser**

Open kiosk view. Should see:
- Today as a large hero card at top
- Tomorrow + Day After in a 2-column row below
- 4 remaining days in a compact 4-column row
- Utility row (rotating content + groceries/chores) at bottom
- Phase-aware colors everywhere

**Step 4: Commit**

```bash
git add src/components/kiosk/KioskDashboard.tsx src/index.css
git commit -m "feat(kiosk): rewrite layout with hierarchical Today-hero / Next / Compact structure"
```

---

## Task 10: Update Remaining Kiosk Components to Use Theme Variables

**Files:**
- Modify: `src/components/weather/SunTimes.tsx` — `text-accent-gold` → `var(--fd-accent)`
- Modify: `src/components/layout/StatusBar.tsx` — text colors
- Modify: `src/lib/constants.ts` — update COLORS to reference theme

**Step 1: Update SunTimes.tsx**

Replace `className="text-accent-gold"` on both WiSunrise and WiSunset icons with:
```typescript
style={{ color: 'var(--fd-accent)' }}
```

And replace `className="text-text-secondary tabular-nums"` on the time spans with:
```typescript
className="tabular-nums" style={{ color: 'var(--fd-text-2)' }}
```

**Step 2: Update constants.ts COLORS**

The COLORS object is used by JS components. Update it to document that CSS custom properties are the source of truth for kiosk mode:

```typescript
// Color tokens — kiosk mode uses CSS custom properties (--fd-*) set by useTimeOfDay.
// These static values are fallbacks for non-kiosk (default dashboard) usage.
export const COLORS = {
  bgPrimary: '#1a1814',
  bgSecondary: '#201e1a',
  accentGold: '#f0a030',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  surface: 'rgba(255, 255, 255, 0.1)',
} as const;
```

**Step 3: Check for any other hardcoded `#FFD700` or `#0a0a1a` references in kiosk components**

Search the kiosk component files and utility panels for hardcoded colors. Update any remaining `text-accent-gold`, `bg-bg-primary`, `text-text-primary`, `text-text-secondary` Tailwind classes in kiosk-rendered components to use `var(--fd-*)` inline styles instead.

**Step 4: Verify in browser**

Kiosk view: all text, icons, and card colors should reflect the current time-of-day phase. No stale navy or `#FFD700` yellow should remain visible.

**Step 5: Commit**

```bash
git add -A
git commit -m "style(kiosk): migrate remaining components to phase-aware theme variables"
```

---

## Task 11: Clean Up Old KioskWeekGrid

**Files:**
- Delete or archive: `src/components/kiosk/KioskWeekGrid.tsx` — no longer used
- Modify: `src/index.css` — remove old `.kiosk-week-grid`, `.kiosk-day-card`, `.kiosk-day-card-today`, `.kiosk-day-title`, `.kiosk-day-date`, `.kiosk-day-weather`, `.kiosk-day-events`, `.kiosk-event-row`, `.kiosk-event-time`, `.kiosk-event-people`, `.kiosk-event-summary`, `.kiosk-empty-day`, `.kiosk-overflow` CSS classes

**Step 1: Delete KioskWeekGrid.tsx**

```bash
rm src/components/kiosk/KioskWeekGrid.tsx
```

**Step 2: Remove old CSS classes from index.css**

Delete the old kiosk week grid CSS rules (`.kiosk-week-grid` through `.kiosk-overflow`). These have been replaced by the new component-specific styles.

**Step 3: Verify nothing references the old component**

Search for `KioskWeekGrid` imports — should find none (the new KioskDashboard doesn't import it).

**Step 4: Verify the app still builds**

Run: `cd /Users/joshua/Documents/Unicorn.Land/family-dashboard && npm run build`
Expected: Clean build, no errors.

**Step 5: Commit**

```bash
git add -A
git commit -m "refactor(kiosk): remove old KioskWeekGrid and legacy CSS classes"
```

---

## Task 12: Visual QA and Spacing Polish

**Files:**
- Modify: `src/index.css` — fine-tune spacing, padding, gaps
- Possibly modify: any kiosk component that needs spacing adjustments

**Step 1: Open kiosk view and visually inspect**

Check each section for:
- Adequate spacing between sections
- Font sizes readable from a distance (hold your phone at arm's length as a rough check)
- Cards not overflowing or leaving excessive empty space
- Phase colors rendering correctly (manually test by setting `data-phase` attribute in devtools)
- Clock shimmer animating smoothly
- Emojis displaying correctly in event rows

**Step 2: Test all 5 phases in devtools**

In browser devtools, manually set `<html data-phase="night">`, `dawn`, `day`, `golden`, `dusk` and verify each phase looks cohesive.

**Step 3: Test with real content**

Verify the layout works with:
- Days with many events (5+)
- Days with no events
- Long event names (truncation works)
- Multiple-person events (emoji stacking)

**Step 4: Adjust spacing as needed**

Tune any `clamp()` values, gaps, or padding that don't feel right at kiosk scale.

**Step 5: Commit**

```bash
git add -A
git commit -m "polish(kiosk): fine-tune spacing and visual QA for wall readability"
```

---

## Task 13: Update html background color for kiosk

**Files:**
- Modify: `src/index.css` — the `html` background should also be phase-aware

**Step 1: Update the html rule**

Replace:
```css
html {
  background: var(--color-bg-primary);
}
```
With:
```css
html {
  background: var(--fd-bg-1);
}
```

This ensures the background behind the body gradient matches the phase.

**Step 2: Commit**

```bash
git add src/index.css
git commit -m "style(kiosk): make html background phase-aware"
```

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Swap Inter → Outfit font | `index.html`, `src/index.css` |
| 2 | Create `useTimeOfDay` hook | `src/hooks/useTimeOfDay.ts` |
| 3 | Add 5-phase CSS theme variables | `src/index.css` |
| 4 | Wire hook to DOM (`data-phase`) | `src/components/kiosk/KioskDashboard.tsx` |
| 5 | Clock shimmer effect | `src/index.css`, `src/components/clock/Clock.tsx` |
| 6 | KioskTodayCard (hero) | `src/components/kiosk/KioskTodayCard.tsx`, `src/index.css` |
| 7 | KioskNextDayCard (tomorrow/day-after) | `src/components/kiosk/KioskNextDayCard.tsx`, `src/index.css` |
| 8 | KioskCompactRow (remaining 4 days) | `src/components/kiosk/KioskCompactRow.tsx`, `src/index.css` |
| 9 | Rewrite KioskDashboard layout | `src/components/kiosk/KioskDashboard.tsx`, `src/index.css` |
| 10 | Migrate remaining components to theme vars | `SunTimes.tsx`, `StatusBar.tsx`, `constants.ts` |
| 11 | Clean up old KioskWeekGrid | Delete `KioskWeekGrid.tsx`, clean CSS |
| 12 | Visual QA and spacing polish | Various |
| 13 | Phase-aware html background | `src/index.css` |

**Dependencies:** Tasks 1-5 are foundational (can be done in order). Tasks 6-8 are independent of each other but depend on Task 3 (CSS variables). Task 9 depends on Tasks 6-8. Tasks 10-13 depend on Task 9.
