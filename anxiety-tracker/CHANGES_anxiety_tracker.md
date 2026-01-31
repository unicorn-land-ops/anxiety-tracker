# Anxiety Tracker Changes - January 31, 2026

## Summary

Three urgent fixes implemented for Joshua:

### 1. Scale Now Includes 0

**Files changed:** `src/components/QuestionPanel.tsx`

**What:** Changed the scale options from `[1, 2, 3]` to `[0, 1, 2, 3]`.

**Why:** The previous scale starting at 1 implied an issue always exists. Adding 0 allows users to indicate "no issue" for scale-based questions like toilet urge, stress level, anxiety level, and focus level.

### 2. Timestamps Use Local Time

**Files changed:** `src/App.tsx`

**What:** Changed from `new Date().toISOString()` (which produces UTC/GMT timestamps) to a local timezone-aware timestamp.

**Why:** Entries were being recorded with UTC time, which could be hours off from the user's actual local time. Now timestamps reflect the user's phone/device local time.

**Implementation:** The timestamp is calculated by adjusting for the timezone offset:
```typescript
const now = new Date();
const localTimestamp = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, -1);
```

### 3. "Undownloaded" Export Option with Tracking

**Files changed:**
- `src/types/index.ts` - Added optional `downloaded` field to `AnxietyEntry`
- `src/hooks/useStorage.ts` - Added tracking logic and undownloaded filter
- `src/components/ExportSettings.tsx` - Added "Undownloaded" button
- `src/App.tsx` - Added undownloaded count to entry counts

**What:** Added a new "Undownloaded" export option that:
1. Shows only entries that haven't been exported yet
2. Marks entries as downloaded when any export is performed
3. Displays the count of undownloaded entries

**Why:** Users needed a way to export only new entries since their last export, rather than re-downloading everything or guessing which date range to use.

**How it works:**
- Each entry now has an optional `downloaded` boolean field
- When any export is performed (week, month, all, or undownloaded), all exported entries are marked as `downloaded: true`
- The "Undownloaded" option filters to show only entries where `downloaded` is falsy
- Existing entries will appear as undownloaded until their first export
