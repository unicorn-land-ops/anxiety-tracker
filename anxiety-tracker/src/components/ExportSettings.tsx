import { useState } from 'react';

interface Props {
  onCopyToClipboard: (range: 'week' | 'month' | 'all') => Promise<boolean>;
  entryCounts: { week: number; month: number; all: number };
  onBack: () => void;
}

export function ExportSettings({ onCopyToClipboard, entryCounts, onBack }: Props) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const handleCopy = async (range: 'week' | 'month' | 'all') => {
    const success = await onCopyToClipboard(range);
    if (success) {
      setCopyStatus(`Copied ${entryCounts[range]} entries to clipboard`);
    } else {
      setCopyStatus('Unable to copy. Please try again.');
    }
    setTimeout(() => setCopyStatus(null), 3000);
  };

  return (
    <div className="export-settings">
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>

      <h2>Export your data</h2>
      <p className="export-desc">
        Copy your entries as JSON to save or share with a therapist or healthcare provider.
      </p>

      <div className="export-buttons">
        <button className="export-option" onClick={() => handleCopy('week')}>
          <span className="export-label">Past 7 days</span>
          <span className="export-count">{entryCounts.week} entries</span>
        </button>

        <button className="export-option" onClick={() => handleCopy('month')}>
          <span className="export-label">Past 30 days</span>
          <span className="export-count">{entryCounts.month} entries</span>
        </button>

        <button className="export-option" onClick={() => handleCopy('all')}>
          <span className="export-label">Everything</span>
          <span className="export-count">{entryCounts.all} entries</span>
        </button>
      </div>

      {copyStatus && <div className="copy-status">{copyStatus}</div>}
    </div>
  );
}
