import { useState } from 'react';
import { locationTypes } from '../data/questions';
import { Scenario } from '../types';

interface Props {
  scenario: Scenario;
  onSelect: (location: string) => void;
  onBack: () => void;
}

export function LocationPicker({ scenario, onSelect, onBack }: Props) {
  const [customLocation, setCustomLocation] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleLocationClick = (location: { label: string; emoji: string }) => {
    if (location.label === 'Other') {
      setShowCustomInput(true);
    } else {
      onSelect(location.label);
    }
  };

  const handleCustomSubmit = () => {
    if (customLocation.trim()) {
      onSelect(customLocation.trim());
    }
  };

  const heading = scenario === 'leaving' ? 'Where are you going?' : 'Where are you now?';

  return (
    <div className="location-picker">
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>

      <h2>{heading}</h2>

      {!showCustomInput ? (
        <div className="location-grid">
          {locationTypes.map((location) => (
            <button
              key={location.label}
              className="location-btn"
              onClick={() => handleLocationClick(location)}
            >
              <span className="location-emoji">{location.emoji}</span>
              <span className="location-label">{location.label}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="custom-location">
          <input
            type="text"
            placeholder="Describe your location..."
            value={customLocation}
            onChange={(e) => setCustomLocation(e.target.value)}
            autoFocus
          />
          <div className="custom-actions">
            <button
              className="cancel-btn"
              onClick={() => setShowCustomInput(false)}
            >
              Cancel
            </button>
            <button
              className="confirm-btn"
              onClick={handleCustomSubmit}
              disabled={!customLocation.trim()}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
