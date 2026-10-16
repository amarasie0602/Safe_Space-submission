import { useContext, useEffect, useState } from 'react';
import api from '../../api/axios';
import Card from '../../components/Card';
import { ToastContext } from '../../context/ToastContext';
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
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    const fetchActions = async () => {
      const { data } = await api.get('/admin/actions');
      setActions(data);
    };
    fetchActions().catch(() => showToast('Unable to load the audit log.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (actions === null) {
    return <div>Loading…</div>;
  }

  return (
    <div>
      <h1>Audit Log</h1>
      <p className="text-muted">
        Every suspend, ban, reinstate, and counselor verify/reject decision, for accountability:
        who made the call, when, and why.
      </p>
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
