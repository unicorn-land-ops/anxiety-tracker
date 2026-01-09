import { useState } from 'react';
import { AppView, Scenario, QuestionResponse, AnxietyEntry } from './types';
import { useStorage } from './hooks/useStorage';
import { ScenarioSelector } from './components/ScenarioSelector';
import { LocationPicker } from './components/LocationPicker';
import { QuestionFlow } from './components/QuestionFlow';
import { Summary } from './components/Summary';
import { History } from './components/History';
import { ExportSettings } from './components/ExportSettings';

function App() {
  const [view, setView] = useState<AppView>('home');
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [lastEntry, setLastEntry] = useState<AnxietyEntry | null>(null);

  const { entries, saveEntry, getEntriesForExport, copyToClipboard } = useStorage();

  const handleScenarioSelect = (scenario: Scenario) => {
    setCurrentScenario(scenario);
    setView('location');
  };

  const handleLocationSelect = (location: string) => {
    setCurrentLocation(location);
    setView('questions');
  };

  const handleQuestionsComplete = (responses: QuestionResponse[]) => {
    const entry: AnxietyEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      scenario: currentScenario!,
      locationType: currentLocation!,
      responses,
    };

    saveEntry(entry);
    setLastEntry(entry);
    setView('summary');
  };

  const resetFlow = () => {
    setCurrentScenario(null);
    setCurrentLocation(null);
    setLastEntry(null);
    setView('home');
  };

  const entryCounts = {
    week: getEntriesForExport('week').length,
    month: getEntriesForExport('month').length,
    all: entries.length,
  };

  return (
    <div className="app">
      {view === 'home' && (
        <ScenarioSelector
          onSelect={handleScenarioSelect}
          onOpenHistory={() => setView('history')}
        />
      )}

      {view === 'location' && currentScenario && (
        <LocationPicker
          scenario={currentScenario}
          onSelect={handleLocationSelect}
          onBack={() => setView('home')}
        />
      )}

      {view === 'questions' && currentScenario && (
        <QuestionFlow
          scenario={currentScenario}
          onComplete={handleQuestionsComplete}
          onBack={() => setView('location')}
        />
      )}

      {view === 'summary' && lastEntry && (
        <Summary
          entry={lastEntry}
          onDone={resetFlow}
          onViewHistory={() => setView('history')}
        />
      )}

      {view === 'history' && (
        <History
          entries={entries}
          onBack={resetFlow}
          onExport={() => setView('settings')}
        />
      )}

      {view === 'settings' && (
        <ExportSettings
          onCopyToClipboard={copyToClipboard}
          entryCounts={entryCounts}
          onBack={() => setView('history')}
        />
      )}
    </div>
  );
}

export default App;
