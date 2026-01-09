import { Scenario } from '../types';

interface Props {
  onSelect: (scenario: Scenario) => void;
  onOpenHistory: () => void;
}

export function ScenarioSelector({ onSelect, onOpenHistory }: Props) {
  return (
    <div className="scenario-selector">
      <h1>A moment of stillness</h1>
      <p className="subtitle">Let's check in with how you're feeling</p>

      <div className="scenario-buttons">
        <button
          className="scenario-btn leaving"
          onClick={() => onSelect('leaving')}
        >
          <span className="scenario-icon">🚪</span>
          <span className="scenario-label">Heading Out</span>
          <span className="scenario-desc">Preparing to leave home</span>
        </button>

        <button
          className="scenario-btn out"
          onClick={() => onSelect('out')}
        >
          <span className="scenario-icon">🌿</span>
          <span className="scenario-label">Already Out</span>
          <span className="scenario-desc">Currently away from home</span>
        </button>
      </div>

      <button className="history-link" onClick={onOpenHistory}>
        View past entries
      </button>
    </div>
  );
}
