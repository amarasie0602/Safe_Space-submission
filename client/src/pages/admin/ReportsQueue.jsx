import PageHeader from '../../components/PageHeader';
import { useContext, useEffect, useState } from 'react';
import api from '../../api/axios';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { ToastContext } from '../../context/ToastContext';
import { AuthContext } from '../../context/AuthContext';

const ReportsQueue = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const { showToast } = useContext(ToastContext);
  const { user } = useContext(AuthContext);
  // Suspend/ban are admin-only on the backend (authMiddleware.adminOnly) —
  // hide the buttons for a moderator rather than show an action that would
  // just 403, since the report itself is still theirs to resolve/dismiss.
  const canModerateUsers = user?.role === 'admin';

  const fetchReports = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const { data } = await api.get('/admin/reports', { params: { status: 'open' } });
      setReports(data);
    } catch {
      setLoadError('Unable to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResolve = async (reportId, status) => {
    try {
      await api.patch(`/admin/reports/${reportId}/resolve`, { status });
      setReports((prev) => prev.filter((report) => report._id !== reportId));
      showToast(status === 'resolved' ? 'Report resolved' : 'Report dismissed');
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to update this report.');
    }
  };

  const handleModerate = async (report, action) => {
    try {
      if (action === 'suspend') {
        await api.patch(`/admin/users/${report.targetId}/suspend`, { days: 7 });
        showToast('User suspended for 7 days');
      } else {
        await api.patch(`/admin/users/${report.targetId}/ban`);
        showToast('User banned');
      }
      await handleResolve(report._id, 'resolved');
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to take that action right now.');
    }
  };

  return (
    <div>
      <PageHeader eyebrow="COMMUNITY CARE" title="Reports" description="Review concerns raised by members and record the appropriate action." />
      {loading && <LoadingSpinner />}
      {!loading && loadError && <><ErrorMessage message={loadError} /><button type="button" className="btn btn-ghost btn-sm" onClick={fetchReports}>Try again</button></>}
      {!loading && !loadError && reports.length === 0 && <div className="empty-state">No open reports.</div>}
      {!loading && !loadError && reports.map((report) => (
        <Card key={report._id}>
          <p>{report.reason}</p>
          <div className="card-meta">
            <span className="badge">{report.targetType}</span>
            {report.reporter?.pseudonym && (
              <span className="badge">Reported by {report.reporter.pseudonym}</span>
            )}
          </div>
          <div className="card-actions">
            <button className="btn btn-primary btn-sm" onClick={() => handleResolve(report._id, 'resolved')}>
              Resolve
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => handleResolve(report._id, 'dismissed')}>
              Dismiss
            </button>
            {report.targetType === 'user' && canModerateUsers && (
              <>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleModerate(report, 'suspend')}
                >
                  Suspend 7 days
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleModerate(report, 'ban')}>
                  Ban user
                </button>
              </>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ReportsQueue;
