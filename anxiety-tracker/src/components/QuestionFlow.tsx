import { useState } from 'react';
import { QuestionResponse, Scenario } from '../types';
import { getQuestionsForScenario } from '../data/questions';
import { QuestionCard } from './QuestionCard';

interface Props {
  scenario: Scenario;
  onComplete: (responses: QuestionResponse[]) => void;
  onBack: () => void;
}

export function QuestionFlow({ scenario, onComplete, onBack }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);

  const questions = getQuestionsForScenario(scenario);
  const currentQuestion = questions[currentIndex];

  const handleAnswer = (value: number) => {
    const newResponse: QuestionResponse = {
      questionId: currentQuestion.id,
      value,
    };

    const updatedResponses = [...responses, newResponse];

    if (currentIndex === questions.length - 1) {
      onComplete(updatedResponses);
    } else {
      setResponses(updatedResponses);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      onBack();
    } else {
      setCurrentIndex(currentIndex - 1);
      setResponses(responses.slice(0, -1));
    }
  };

  return (
    <QuestionCard
      question={currentQuestion}
      questionNumber={currentIndex + 1}
      totalQuestions={questions.length}
      onAnswer={handleAnswer}
      onBack={handleBack}
    />
  );
}
