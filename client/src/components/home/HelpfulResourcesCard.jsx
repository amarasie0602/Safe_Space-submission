import { Link } from 'react-router-dom';
import Icon from '../Icon';
import ThemedImage from '../ThemedImage';
import { IMAGES } from '../../config/images';

// Only links to pages that actually exist — nothing invented.
const RESOURCES = [
  {
    to: '/calm#breathing-heading',
    label: 'Breathing techniques for instant calm',
    thumb: IMAGES.helpfulResources.breathing,
  },
  {
    to: '/inspiration',
    label: 'Healing Reads',
    thumb: IMAGES.helpfulResources.healingReads,
  },
  {
    to: '/crisis-resources',
    label: 'If you need to talk to someone now',
    thumb: IMAGES.helpfulResources.crisisResources,
  },
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
            <ThemedImage
              src={resource.thumb.src}
              alt=""
              width={44}
              height={44}
              sizes="44px"
              className="helpful-resource-thumb"
              overlay={false}
            />
            <span>{resource.label}</span>
            <Icon name="chevron-down" size={12} className="helpful-resource-arrow" />
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default HelpfulResourcesCard;
