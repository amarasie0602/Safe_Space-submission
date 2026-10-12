import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

// Day-to-day moderation (flagged posts, reports) is open to both
// moderators and admins. `adminOnly` narrows a specific nested route (e.g.
// counselor verification, analytics, the audit log) to full admins only —
// matching the backend's staffOnly vs adminOnly split in authMiddleware.js.
const AdminRoute = ({ children, adminOnly = false }) => {
  const { user } = useContext(AuthContext);
  const allowedRoles = adminOnly ? ['admin'] : ['admin', 'moderator'];

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
