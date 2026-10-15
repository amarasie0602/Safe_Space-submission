import { Link } from 'react-router-dom';
import Icon from '../Icon';

// Only links to pages that actually exist — nothing invented.
const RESOURCES = [
  { to: '/calm#breathing-heading', label: 'Breathing techniques for instant calm', icon: 'leaf' },
  { to: '/inspiration', label: 'Healing Reads', icon: 'sun' },
  { to: '/crisis-resources', label: 'If you need to talk to someone now', icon: 'shield' },
];

const HelpfulResourcesCard = () => (
  <div className="card sidebar-card">
    <div className="sidebar-card-header">
      <Icon name="leaf" size={16} />
      <h2>You Might Find Helpful</h2>
    </div>
    <ul className="helpful-resources">
      {RESOURCES.map((resource) => (
        <li key={resource.to}>
          <Link to={resource.to}>
            <Icon name={resource.icon} size={14} />
            <span>{resource.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default HelpfulResourcesCard;
