import { useContext, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import Card from '../../components/Card';
import CategoryTag from '../../components/CategoryTag';
import ConfirmDialog from '../../components/ConfirmDialog';
import { ToastContext } from '../../context/ToastContext';
import { timeAgo } from '../../utils/timeAgo';

const RejectReasonPrompt = ({ reason, onReasonChange }) => (
  <>
    <p>This removes their application entirely — they can re-register if this was a mistake.</p>
    <label className="field">
      Reason (kept in the admin audit log)
      <input
        value={reason}
        onChange={(e) => onReasonChange(e.target.value)}
        placeholder="e.g. Credentials could not be verified"
      />
    </label>
  </>
);

const CounselorVerificationList = () => {
  const [counselors, setCounselors] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const { showToast } = useContext(ToastContext);

  const fetchPending = async () => {
    const { data } = await api.get('/admin/counselors/pending');
    setCounselors(data);
  };

  useEffect(() => {
    fetchPending().catch(() => showToast('Unable to load pending applications.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = async (counselor) => {
    await api.post(`/admin/counselors/verify/${counselor._id}`);
    setCounselors((prev) => prev.filter((c) => c._id !== counselor._id));
    showToast(`${counselor.name} is now verified and listed publicly.`);
  };

  const handleReject = async () => {
    const counselor = rejectTarget;
    setRejectTarget(null);
    await api.post(`/admin/counselors/reject/${counselor._id}`, { reason: rejectReason.trim() || undefined });
    setRejectReason('');
    setCounselors((prev) => prev.filter((c) => c._id !== counselor._id));
    showToast(`${counselor.name}'s application was declined.`);
  };

  if (counselors === null) {
    return <div>Loading…</div>;
  }

  return (
    <div>
      <h1>Counselor Applications</h1>
      <p className="text-muted">
        Review each applicant&apos;s stated credentials before verifying — once verified, they appear
        publicly and can accept bookings.
      </p>
      {counselors.length === 0 && <div className="empty-state">No pending applications.</div>}
      {counselors.map((counselor) => (
        <Card key={counselor._id}>
          <h3>{counselor.name}</h3>
          <p className="text-muted">{counselor.email}</p>
          <p>{counselor.credentials || 'No credentials text provided.'}</p>
          <div className="card-meta">
            {counselor.specialties?.map((specialty) => (
              <CategoryTag key={specialty} category={specialty} />
            ))}
            <span className="badge">Applied {timeAgo(counselor.createdAt)}</span>
          </div>
          <div className="card-actions">
            <button className="btn btn-primary btn-sm" onClick={() => handleVerify(counselor)}>
              Verify
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => setRejectTarget(counselor)}>
              Reject
            </button>
          </div>
        </Card>
      ))}
      <AnimatePresence>
      {rejectTarget && (
        <ConfirmDialog
          key="reject"
          title={`Reject ${rejectTarget.name}'s application?`}
          message={<RejectReasonPrompt reason={rejectReason} onReasonChange={setRejectReason} />}
          confirmLabel="Reject application"
          danger
          onConfirm={handleReject}
          onCancel={() => {
            setRejectTarget(null);
            setRejectReason('');
          }}
        />
      )}
      </AnimatePresence>
    </div>
  );
};

export default CounselorVerificationList;
