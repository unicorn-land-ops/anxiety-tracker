import { Question } from '../types';

interface Props {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (value: number) => void;
  onBack: () => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onBack,
}: Props) {
  const handleSelect = (value: number) => {
    onAnswer(value);
  };

  return (
    <div className="question-card">
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>

      <div className="progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
        <span className="progress-text">
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>

      <h2 className="question-text">{question.text}</h2>

      <div className="rating-scale">
        <div className="scale-labels">
          <span>Not at all</span>
          <span>Very much</span>
        </div>
        <div className="scale-buttons">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              className="scale-btn"
              onClick={() => handleSelect(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
