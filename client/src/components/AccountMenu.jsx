import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AnonymousAvatar from './AnonymousAvatar';
import Icon from './Icon';

const AccountMenu = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape' && ref.current?.contains(document.activeElement)) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="account-menu" ref={ref}>
      <button
        type="button"
        className="icon-btn navbar-avatar-btn"
        ref={triggerRef}
        aria-expanded={open}
        aria-controls="account-dropdown"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Account menu for ${user.pseudonym}`}
        title={user.pseudonym}
      >
        <AnonymousAvatar seed={user.id} avatarId={user.avatarId} />
        <span className="navbar-avatar-label navbar-desktop-only">{user.pseudonym}</span>
        <Icon name="chevron-down" size={13} className="navbar-desktop-only" />
      </button>
      {open && (
        <div className="account-menu-dropdown" id="account-dropdown">
          <p className="account-menu-name">{user.pseudonym}</p>
          <Link to="/profile" onClick={() => setOpen(false)}>
            View Profile
          </Link>
          <Link to="/my-activity" onClick={() => setOpen(false)}>My Activity</Link>
          <button type="button" onClick={logout}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
