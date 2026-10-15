import { useState } from 'react';
import Icon from '../Icon';
import { getTodaysAffirmation, getRandomAffirmation } from '../../utils/affirmations';

const AffirmationCard = () => {
  const [affirmation, setAffirmation] = useState(getTodaysAffirmation);

  return (
    <div className="card sidebar-card">
      <div className="sidebar-card-header">
        <Icon name="sun" size={16} />
        <h2>Today&apos;s Affirmation</h2>
      </div>
      <p className="affirmation-text">{affirmation}</p>
      <button
        type="button"
        className="btn btn-ghost btn-sm sidebar-card-action"
        onClick={() => setAffirmation((prev) => getRandomAffirmation(prev))}
      >
        Show me another
      </button>
    </div>
  );
};

export default AffirmationCard;
