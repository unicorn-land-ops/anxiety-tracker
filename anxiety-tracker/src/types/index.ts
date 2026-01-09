export type Scenario = 'leaving' | 'out';

export interface Question {
  id: string;
  text: string;
  scenario: Scenario;
}

export interface QuestionResponse {
  questionId: string;
  value: number;
}

export interface AnxietyEntry {
  id: string;
  timestamp: string;
  scenario: Scenario;
  locationType: string;
  responses: QuestionResponse[];
}

export type AppView = 'home' | 'location' | 'questions' | 'summary' | 'history' | 'settings';
