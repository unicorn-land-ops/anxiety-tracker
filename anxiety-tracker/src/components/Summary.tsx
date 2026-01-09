import { AnxietyEntry } from '../types';
import { getQuestionsForScenario } from '../data/questions';

interface Props {
  entry: AnxietyEntry;
  onDone: () => void;
  onViewHistory: () => void;
}

export function Summary({ entry, onDone, onViewHistory }: Props) {
  const questions = getQuestionsForScenario(entry.scenario);
  const avgScore =
    entry.responses.reduce((sum, r) => sum + r.value, 0) / entry.responses.length;

  return (
    <div className="summary">
      <div className="summary-header">
        <span className="checkmark">✓</span>
        <h2>Moment captured</h2>
      </div>

      <div className="summary-details">
        <div className="detail-row">
          <span className="label">Context</span>
          <span className="value">
            {entry.scenario === 'leaving' ? 'Heading out' : 'Already out'}
          </span>
        </div>
        <div className="detail-row">
          <span className="label">Location</span>
          <span className="value">{entry.locationType}</span>
        </div>
        <div className="detail-row">
          <span className="label">Average</span>
          <span className="value">{avgScore.toFixed(1)} / 5</span>
        </div>
      </div>

      <div className="summary-responses">
        <h3>Your responses</h3>
        {entry.responses.map((response, index) => {
          const question = questions.find((q) => q.id === response.questionId);
          return (
            <div key={response.questionId} className="response-row">
              <span className="response-question">
                {index + 1}. {question?.text}
              </span>
              <span className="response-value">{response.value}/5</span>
            </div>
          );
        })}
      </div>

      <div className="summary-actions">
        <button className="primary-btn" onClick={onDone}>
          Done
        </button>
        <button className="secondary-btn" onClick={onViewHistory}>
          View past entries
        </button>
      </div>
    </div>
  );
}
