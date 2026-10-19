import PageHeader from '../../components/PageHeader';
import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { timeAgo } from '../../utils/timeAgo';

const ACTION_LABELS = {
  user_suspended: 'Suspended user',
  user_banned: 'Banned user',
  user_reinstated: 'Reinstated user',
  counselor_verified: 'Verified counselor',
  counselor_rejected: 'Rejected counselor application',
};

const describeTarget = (entry) => {
  const name = entry.metadata?.pseudonym || entry.metadata?.name;
  return name || `${entry.targetType} ${entry.targetId}`;
};

const AuditLog = () => {
  const [actions, setActions] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    setLoadError('');
    api.get('/admin/actions').then(({ data }) => setActions(data))
      .catch(() => setLoadError('Unable to load the audit log. Please try again.'));
  }, [retry]);

  if (loadError) return <div><PageHeader eyebrow="COMMUNITY CARE" title="Audit Log" /><ErrorMessage message={loadError} /><button className="btn btn-ghost" onClick={() => setRetry(value => value + 1)}>Try again</button></div>;
  if (actions === null) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader eyebrow="COMMUNITY CARE" title="Audit Log" description="A record of moderation decisions, with who acted, when, and why." />
      {actions.length === 0 && <div className="empty-state">No admin actions recorded yet.</div>}
      {actions.map((entry) => (
        <Card key={entry._id}>
          <p>
            <strong>{entry.actor?.pseudonym || 'Unknown admin'}</strong>{' '}
            {(ACTION_LABELS[entry.action] || entry.action).toLowerCase()}{' '}
            <strong>{describeTarget(entry)}</strong>
          </p>
          {entry.reason && <p className="text-muted">Reason: {entry.reason}</p>}
          <div className="card-meta">
            <span className="badge">{timeAgo(entry.createdAt)}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AuditLog;
