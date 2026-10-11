import { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const navLinkClass = ({ isActive }) => (isActive ? 'active' : undefined);

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <NavLink to="/admin/posts" className={navLinkClass}>
          Flagged Posts
        </NavLink>
        <NavLink to="/admin/reports" className={navLinkClass}>
          Reports
        </NavLink>
        {/* Credential review, booking oversight, aggregate analytics, and the
            audit log are reserved for full admins — a moderator's token is
            rejected by the backend on these routes, so the links are hidden
            rather than shown-then-blocked. */}
        {isAdmin && (
          <>
            <NavLink to="/admin/counselors" className={navLinkClass}>
              Counselors
            </NavLink>
            <NavLink to="/admin/bookings" className={navLinkClass}>
              Bookings
            </NavLink>
            <NavLink to="/admin/analytics" className={navLinkClass}>
              Analytics
            </NavLink>
            <NavLink to="/admin/audit-log" className={navLinkClass}>
              Audit Log
            </NavLink>
          </>
        )}
      </nav>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
