import { useState } from 'react';
import { QuestionResponse, Scenario } from '../types';
import { getQuestionsForScenario } from '../data/questions';

interface Props {
  scenario: Scenario;
  onComplete: (responses: QuestionResponse[]) => void;
  onBack: () => void;
}

export function QuestionPanel({ scenario, onComplete, onBack }: Props) {
  const questions = getQuestionsForScenario(scenario);
  const [answers, setAnswers] = useState<Record<string, boolean | number>>({});

  const handleBooleanAnswer = (questionId: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleScaleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  const handleSubmit = () => {
    const responses: QuestionResponse[] = questions.map((q) => ({
      questionId: q.id,
      value: answers[q.id],
    }));
    onComplete(responses);
  };

  const title = scenario === 'leaving' ? 'Before you go' : 'While you\'re out';

  return (
    <div className="question-panel">
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>

      <h2 className="panel-title">{title}</h2>

      <div className="questions-list">
        {questions.map((question) => (
          <div key={question.id} className="question-row">
            <span className="question-label">{question.text}</span>

            {question.type === 'boolean' ? (
              <div className="toggle-group">
                <button
                  className={`toggle-btn ${answers[question.id] === true ? 'active' : ''}`}
                  onClick={() => handleBooleanAnswer(question.id, true)}
                >
                  Yes
                </button>
                <button
                  className={`toggle-btn ${answers[question.id] === false ? 'active' : ''}`}
                  onClick={() => handleBooleanAnswer(question.id, false)}
                >
                  No
                </button>
              </div>
            ) : (
              <div className="scale-group">
                {[1, 2, 3].map((value) => (
                  <button
                    key={value}
                    className={`scale-btn-sm ${answers[question.id] === value ? 'active' : ''}`}
                    onClick={() => handleScaleAnswer(question.id, value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={!allAnswered}
      >
        Save check-in
      </button>
    </div>
  );
}
