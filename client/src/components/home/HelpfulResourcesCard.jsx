import { Link } from 'react-router-dom';
import Icon from '../Icon';

// Only links to pages that actually exist — nothing invented.
const RESOURCES = [
  {
    to: '/calm#breathing-heading',
    label: 'A guided breathing break',
    icon: 'sun',
  },
  {
    to: '/inspiration',
    label: 'Healing Reads',
    icon: 'bookmark',
  },
  {
    to: '/crisis-resources',
    label: 'If you need to talk to someone now',
    icon: 'heart',
  },
];

const HelpfulResourcesCard = () => (
  <div className="card sidebar-card">
    <div className="sidebar-card-header">
      <Icon name="leaf" size={16} />
      <h2>A little support</h2>
    </div>
    <ul className="helpful-resources">
      {RESOURCES.map((resource) => (
        <li key={resource.to}>
          <Link to={resource.to}>
            <span className="helpful-resource-thumb" aria-hidden="true"><Icon name={resource.icon} size={17} /></span>
            <span>{resource.label}</span>
            <Icon name="chevron-down" size={12} className="helpful-resource-arrow" />
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default HelpfulResourcesCard;
