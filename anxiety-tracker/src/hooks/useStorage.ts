import { useState, useEffect, useCallback } from 'react';
import { AnxietyEntry } from '../types';

const STORAGE_KEY = 'anxiety-tracker-entries';

export function useStorage() {
  const [entries, setEntries] = useState<AnxietyEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch {
        setEntries([]);
      }
    }
  }, []);

  const saveEntry = useCallback((entry: AnxietyEntry) => {
    setEntries((prev) => {
      const updated = [...prev, entry];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getEntriesForExport = useCallback(
    (range: 'week' | 'month' | 'all'): AnxietyEntry[] => {
      if (range === 'all') return entries;

      const now = new Date();
      const cutoff = new Date();

      if (range === 'week') {
        cutoff.setDate(now.getDate() - 7);
      } else if (range === 'month') {
        cutoff.setMonth(now.getMonth() - 1);
      }

      return entries.filter((entry) => new Date(entry.timestamp) >= cutoff);
    },
    [entries]
  );

  const exportToJson = useCallback(
    (range: 'week' | 'month' | 'all'): string => {
      const data = getEntriesForExport(range);
      return JSON.stringify(data, null, 2);
    },
    [getEntriesForExport]
  );

  const copyToClipboard = useCallback(
    async (range: 'week' | 'month' | 'all'): Promise<boolean> => {
      try {
        const json = exportToJson(range);
        await navigator.clipboard.writeText(json);
        return true;
      } catch {
        return false;
      }
    },
    [exportToJson]
  );

  const deleteEntry = useCallback((entryId: string) => {
    setEntries((prev) => {
      const updated = prev.filter((entry) => entry.id !== entryId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    entries,
    saveEntry,
    getEntriesForExport,
    exportToJson,
    copyToClipboard,
    deleteEntry,
  };
}
