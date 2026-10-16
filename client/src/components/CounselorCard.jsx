import { Link } from 'react-router-dom';
import CategoryTag from './CategoryTag';
import AnonymousAvatar from './AnonymousAvatar';
import Icon from './Icon';

const isOpenForBooking = (counselor) => {
  if (counselor.weeklySchedule?.length) {
    return counselor.weeklySchedule.some((entry) => entry.slots?.length > 0);
  }
  const availability = counselor.availability || '';
  return /available|open/i.test(availability) && !/booked|unavailable/i.test(availability);
};

const CounselorCard = ({ counselor }) => {
  const open = isOpenForBooking(counselor);

  return (
    <div className="counselor-row">
      <AnonymousAvatar seed={counselor._id} size={56} />
      <div className="counselor-row-body">
        <div className="counselor-row-title">
          <Link to={`/counselors/${counselor._id}`}>
            <strong>{counselor.name}</strong>
          </Link>
          {counselor.verified && (
            <span className="badge badge-success">
              <Icon name="shield" size={12} /> Verified Professional
            </span>
          )}
        </div>
        {counselor.credentials && <p className="text-muted">{counselor.credentials}</p>}
        <div className="card-meta">
          {counselor.specialties?.map((specialty) => (
            <CategoryTag key={specialty} category={specialty} />
          ))}
          {typeof counselor.rating === 'number' && (
            <span className="badge badge-success">
              <Icon name="star" size={12} /> {counselor.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
      <div className="counselor-row-actions">
        <div className="counselor-availability">
          <span className={`availability-dot${open ? ' open' : ''}`} aria-hidden="true" />
          {counselor.availability}
        </div>
        <Link to={`/counselors/${counselor._id}`} className="btn btn-primary btn-sm">
          {open ? 'View profile & booking' : 'View profile'}
        </Link>
      </div>
    </div>
  );
};

export default CounselorCard;
