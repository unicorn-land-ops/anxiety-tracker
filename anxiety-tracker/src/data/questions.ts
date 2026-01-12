import { Question } from '../types';

export const leavingQuestions: Question[] = [
  {
    id: 'leaving-bathroom-routine',
    text: 'Bathroom prep?',
    scenario: 'leaving',
    type: 'boolean',
  },
  {
    id: 'leaving-empty-stomach',
    text: 'Empty stomach?',
    scenario: 'leaving',
    type: 'boolean',
  },
  {
    id: 'leaving-toilet-urge',
    text: 'Toilet urge?',
    scenario: 'leaving',
    type: 'scale3',
  },
  {
    id: 'leaving-familiar-destination',
    text: 'Familiar destination?',
    scenario: 'leaving',
    type: 'boolean',
  },
  {
    id: 'leaving-lemon-squirt',
    text: 'Lemon squirt?',
    scenario: 'leaving',
    type: 'boolean',
  },
];

export const outQuestions: Question[] = [
  {
    id: 'out-empty-stomach',
    text: 'Empty stomach?',
    scenario: 'out',
    type: 'boolean',
  },
  {
    id: 'out-is-crowded',
    text: 'Crowded?',
    scenario: 'out',
    type: 'boolean',
  },
  {
    id: 'out-stress-level',
    text: 'Stress level?',
    scenario: 'out',
    type: 'scale3',
  },
  {
    id: 'out-familiar-location',
    text: 'Familiar place?',
    scenario: 'out',
    type: 'boolean',
  },
  {
    id: 'out-focus-level',
    text: 'Focus level?',
    scenario: 'out',
    type: 'scale3',
  },
  {
    id: 'out-anxiety-level',
    text: 'Anxiety level?',
    scenario: 'out',
    type: 'scale3',
  },
  {
    id: 'out-toilet-urge',
    text: 'Toilet urge?',
    scenario: 'out',
    type: 'scale3',
  },
  {
    id: 'out-lemon-squirt',
    text: 'Lemon squirt?',
    scenario: 'out',
    type: 'boolean',
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
