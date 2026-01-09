export type Scenario = 'leaving' | 'out';

export type QuestionType = 'boolean' | 'scale3';

export interface Question {
  id: string;
  text: string;
  scenario: Scenario;
  type: QuestionType;
}

export interface QuestionResponse {
  questionId: string;
  value: boolean | number;
}

export interface AnxietyEntry {
  id: string;
  timestamp: string;
  scenario: Scenario;
  locationType: string;
  responses: QuestionResponse[];
}

export type AppView = 'home' | 'location' | 'questions' | 'summary' | 'history' | 'settings';
