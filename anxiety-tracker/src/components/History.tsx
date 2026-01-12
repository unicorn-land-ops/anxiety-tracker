import { useState, useRef } from 'react';
import { AnxietyEntry } from '../types';
import { getQuestionsForScenario } from '../data/questions';

interface Props {
  entries: AnxietyEntry[];
  onBack: () => void;
  onExport: () => void;
  onDelete: (entryId: string) => void;
}

interface SwipeState {
  entryId: string | null;
  offset: number;
  startX: number;
  isDragging: boolean;
}

interface ConfirmDeleteState {
  entryId: string | null;
  timestamp: string | null;
}

function formatValue(value: boolean | number, type: 'boolean' | 'scale3'): string {
  if (type === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  return `${value}/3`;
}

export function History({ entries, onBack, onExport, onDelete }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [swipeState, setSwipeState] = useState<SwipeState>({
    entryId: null,
    offset: 0,
    startX: 0,
    isDragging: false,
  });
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDeleteState>({
    entryId: null,
    timestamp: null,
  });
  const swipeThreshold = 80; // Minimum swipe distance to reveal delete button
  const deleteThreshold = 150; // Distance to auto-trigger delete
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

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
    if (!swipeState.isDragging) {
      setExpandedId(expandedId === id ? null : id);
    }
  };

  const handleTouchStart = (e: React.TouchEvent, entryId: string) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setSwipeState({
      entryId,
      offset: 0,
      startX: touch.clientX,
      isDragging: false,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !swipeState.entryId) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - swipeState.startX;
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

    // Only start dragging if horizontal movement is more significant than vertical
    if (!swipeState.isDragging && Math.abs(deltaX) > 10) {
      if (deltaY < Math.abs(deltaX)) {
        setSwipeState((prev) => ({ ...prev, isDragging: true }));
      }
    }

    if (swipeState.isDragging) {
      // Only allow left swipes (negative deltaX)
      const newOffset = Math.min(0, deltaX);
      setSwipeState((prev) => ({ ...prev, offset: newOffset }));
    }
  };

  const handleTouchEnd = () => {
    if (!swipeState.entryId) return;

    const { offset, entryId } = swipeState;

    // If swiped past delete threshold, show confirmation
    if (offset <= -deleteThreshold) {
      const entry = entries.find((e) => e.id === entryId);
      if (entry) {
        setConfirmDelete({ entryId, timestamp: entry.timestamp });
      }
      setSwipeState({ entryId: null, offset: 0, startX: 0, isDragging: false });
      return;
    }

    // If swiped past swipe threshold, snap to reveal delete button
    if (offset <= -swipeThreshold) {
      setSwipeState((prev) => ({ ...prev, offset: -120, isDragging: false }));
    } else {
      // Otherwise, snap back
      setSwipeState({ entryId: null, offset: 0, startX: 0, isDragging: false });
    }

    touchStartRef.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent, entryId: string) => {
    e.preventDefault();
    touchStartRef.current = { x: e.clientX, y: e.clientY };
    setSwipeState({
      entryId,
      offset: 0,
      startX: e.clientX,
      isDragging: false,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!touchStartRef.current || !swipeState.entryId) return;

    const deltaX = e.clientX - swipeState.startX;
    const deltaY = Math.abs(e.clientY - touchStartRef.current.y);

    if (!swipeState.isDragging && Math.abs(deltaX) > 10) {
      if (deltaY < Math.abs(deltaX)) {
        setSwipeState((prev) => ({ ...prev, isDragging: true }));
      }
    }

    if (swipeState.isDragging) {
      const newOffset = Math.min(0, deltaX);
      setSwipeState((prev) => ({ ...prev, offset: newOffset }));
    }
  };

  const handleMouseUp = () => {
    handleTouchEnd();
  };

  const handleDeleteClick = (entryId: string, timestamp: string) => {
    setConfirmDelete({ entryId, timestamp });
    setSwipeState({ entryId: null, offset: 0, startX: 0, isDragging: false });
  };

  const confirmDeleteEntry = () => {
    if (confirmDelete.entryId) {
      onDelete(confirmDelete.entryId);
      setConfirmDelete({ entryId: null, timestamp: null });
      setSwipeState({ entryId: null, offset: 0, startX: 0, isDragging: false });
    }
  };

  const cancelDelete = () => {
    setConfirmDelete({ entryId: null, timestamp: null });
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
            const isSwiping = swipeState.entryId === entry.id;
            const offset = isSwiping ? swipeState.offset : 0;

            return (
              <div
                key={entry.id}
                className="entry-card-wrapper"
              >
                <div className="entry-delete-bg">
                  <button
                    className="delete-reveal-btn"
                    onClick={() => handleDeleteClick(entry.id, entry.timestamp)}
                  >
                    Delete
                  </button>
                </div>
                <div
                  className={`entry-card ${isExpanded ? 'expanded' : ''} ${isSwiping ? 'swiping' : ''}`}
                  style={{
                    transform: `translateX(${offset}px)`,
                    transition: swipeState.isDragging ? 'none' : 'transform 0.3s ease-out',
                  }}
                  onTouchStart={(e) => handleTouchStart(e, entry.id)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={(e) => handleMouseDown(e, entry.id)}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
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
              </div>
            );
          })}
        </div>
      )}

      {confirmDelete.entryId && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Entry?</h3>
            <p>
              Are you sure you want to delete this entry from{' '}
              <strong>{confirmDelete.timestamp && formatDate(confirmDelete.timestamp)}</strong>?
            </p>
            <p className="modal-warning">This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="modal-delete" onClick={confirmDeleteEntry}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
