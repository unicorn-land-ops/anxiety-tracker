import { Question } from '../types';

export const leavingQuestions: Question[] = [
  {
    id: 'leaving-bathroom',
    text: 'Bathroom prep?',
    scenario: 'leaving',
    type: 'boolean',
  },
  {
    id: 'leaving-stomach',
    text: 'Empty stomach?',
    scenario: 'leaving',
    type: 'boolean',
  },
  {
    id: 'leaving-toilet',
    text: 'Toilet urge?',
    scenario: 'leaving',
    type: 'scale3',
  },
  {
    id: 'leaving-familiar',
    text: 'Familiar destination?',
    scenario: 'leaving',
    type: 'boolean',
  },
];

export const outQuestions: Question[] = [
  {
    id: 'out-stomach',
    text: 'Empty stomach?',
    scenario: 'out',
    type: 'boolean',
  },
  {
    id: 'out-crowded',
    text: 'Crowded?',
    scenario: 'out',
    type: 'boolean',
  },
  {
    id: 'out-stress',
    text: 'Stress level?',
    scenario: 'out',
    type: 'scale3',
  },
  {
    id: 'out-familiar',
    text: 'Familiar place?',
    scenario: 'out',
    type: 'boolean',
  },
  {
    id: 'out-focus',
    text: 'Focus level?',
    scenario: 'out',
    type: 'scale3',
  },
  {
    id: 'out-anxiety',
    text: 'Anxiety level?',
    scenario: 'out',
    type: 'scale3',
  },
  {
    id: 'out-toilet',
    text: 'Toilet urge?',
    scenario: 'out',
    type: 'scale3',
  },
];

export const locationTypes = [
  { label: 'School', emoji: '🏫' },
  { label: 'Shopping', emoji: '🛒' },
  { label: 'Cafe', emoji: '☕' },
  { label: 'Medical', emoji: '🏥' },
  { label: 'Social', emoji: '👥' },
  { label: 'Transit', emoji: '🚌' },
  { label: 'Nature', emoji: '🌿' },
  { label: 'Other', emoji: '📍' },
];

export function getQuestionsForScenario(scenario: 'leaving' | 'out'): Question[] {
  return scenario === 'leaving' ? leavingQuestions : outQuestions;
}
