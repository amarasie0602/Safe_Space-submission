import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Icon from '../Icon';

// Real numbers only — "members" and "posts shared", not a live-presence
// count the app has no way to track honestly.
const CommunityStatsCard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get('/community/stats')
      .then(({ data }) => {
        if (active) setStats(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (!stats) return null;

  return (
    <div className="card sidebar-card">
      <div className="sidebar-card-header">
        <Icon name="users" size={16} />
        <h2>You&apos;re not alone</h2>
      </div>
      <div className="community-stats">
        <div className="community-stat">
          <Icon name="users" size={18} />
          <div>
            <strong>{stats.members.toLocaleString()}</strong>
            <span className="text-muted">Members</span>
          </div>
        </div>
        <div className="community-stat">
          <Icon name="heart" size={18} />
          <div>
            <strong>{stats.postsShared.toLocaleString()}</strong>
            <span className="text-muted">Posts shared</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityStatsCard;
