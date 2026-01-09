import { Question } from '../types';

export const leavingQuestions: Question[] = [
  {
    id: 'leaving-1',
    text: 'How much anxiety are you noticing right now?',
    scenario: 'leaving',
  },
  {
    id: 'leaving-2',
    text: 'How unprepared do you feel for what lies ahead?',
    scenario: 'leaving',
  },
  {
    id: 'leaving-3',
    text: 'How much anticipatory dread are you experiencing?',
    scenario: 'leaving',
  },
  {
    id: 'leaving-4',
    text: 'How worried are you that things might not go well?',
    scenario: 'leaving',
  },
  {
    id: 'leaving-5',
    text: 'How strong is the pull to stay home instead?',
    scenario: 'leaving',
  },
];

export const outQuestions: Question[] = [
  {
    id: 'out-1',
    text: 'How much anxiety are you noticing in this moment?',
    scenario: 'out',
  },
  {
    id: 'out-2',
    text: 'How uneasy do you feel in your current surroundings?',
    scenario: 'out',
  },
  {
    id: 'out-3',
    text: 'How strong is the urge to return home?',
    scenario: 'out',
  },
  {
    id: 'out-4',
    text: 'How difficult is it to manage your anxiety right now?',
    scenario: 'out',
  },
  {
    id: 'out-5',
    text: 'How overwhelmed are you feeling?',
    scenario: 'out',
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
