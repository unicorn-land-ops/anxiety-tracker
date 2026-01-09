import { useState } from 'react';
import { AnxietyEntry } from '../types';
import { getQuestionsForScenario } from '../data/questions';

interface Props {
  entries: AnxietyEntry[];
  onBack: () => void;
  onExport: () => void;
}

function formatValue(value: boolean | number, type: 'boolean' | 'scale3'): string {
  if (type === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  return `${value}/3`;
}

export function History({ entries, onBack, onExport }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="history">
      <div className="history-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>Your Journey</h2>
        <button className="export-btn" onClick={onExport}>
          Export
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <p>No entries yet</p>
          <p>Your check-ins will appear here over time.</p>
        </div>
      ) : (
        <div className="entry-list">
          {sortedEntries.map((entry) => {
            const questions = getQuestionsForScenario(entry.scenario);
            const isExpanded = expandedId === entry.id;

            return (
              <div
                key={entry.id}
                className={`entry-card ${isExpanded ? 'expanded' : ''}`}
              >
                <button
                  className="entry-summary"
                  onClick={() => toggleExpanded(entry.id)}
                >
                  <div className="entry-info">
                    <span className="entry-date">{formatDate(entry.timestamp)}</span>
                    <span className="entry-meta">
                      {entry.scenario === 'leaving' ? 'Heading out' : 'Out'} · {entry.locationType}
                    </span>
                  </div>
                  <div className="entry-expand-icon">
                    {isExpanded ? '−' : '+'}
                  </div>
                </button>

                {isExpanded && (
                  <div className="entry-details">
                    {entry.responses.map((response) => {
                      const question = questions.find(
                        (q) => q.id === response.questionId
                      );
                      if (!question) return null;
                      return (
                        <div key={response.questionId} className="detail-row">
                          <span className="detail-question">{question.text}</span>
                          <span className="detail-value">
                            {formatValue(response.value, question.type)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
