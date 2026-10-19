import { useContext, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import Icon from './Icon';
import NotificationsDropdown from './NotificationsDropdown';
import AccountMenu from './AccountMenu';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import logo from '../assets/logo-icon.png';

const navLinkClass = ({ isActive }) => (isActive ? 'active' : undefined);
const desktopOnlyNavLinkClass = ({ isActive }) =>
  `navbar-desktop-only${isActive ? ' active' : ''}`;

const DRAWER_FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const Navbar = ({ overlay = false }) => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuToggleRef = useRef(null);
  const drawerRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const closeMenu = () => setMobileOpen(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const compactNavigation = window.matchMedia('(max-width: 960px)');
    const closeOnDesktop = () => { if (!compactNavigation.matches) setMobileOpen(false); };
    compactNavigation.addEventListener('change', closeOnDesktop);
    return () => compactNavigation.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    document.body.style.overflow = 'hidden';
    drawerRef.current?.querySelector('a, button')?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = drawerRef.current?.querySelectorAll(DRAWER_FOCUSABLE);
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const toggleButton = menuToggleRef.current;
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      toggleButton?.focus();
    };
  }, [mobileOpen]);

  return (
    <nav aria-label="Primary navigation" className={`navbar${overlay ? ' navbar-home' : ''}${scrolled ? ' navbar-scrolled' : ''}`}>
      <NavLink to="/" className="navbar-brand" onClick={closeMenu} aria-label="SafeSpace home">
        <span className="navbar-brand-icon">
          <img src={logo} alt="" width={22} height={22} />
        </span>
        <span className="navbar-brand-text">SafeSpace</span>
      </NavLink>
      <div className="navbar-tabs navbar-desktop-only">
        <NavLink to="/" end className={navLinkClass}>
          Posts
        </NavLink>
        <NavLink to="/threads" className={navLinkClass}>
          Threads
        </NavLink>
        <NavLink to="/inspiration" className={navLinkClass}>
          Inspiration
        </NavLink>
        <NavLink to="/calm" className={navLinkClass}>
          Calm Corner
        </NavLink>
        <NavLink to="/counselors" className={navLinkClass}>
          Counselors
        </NavLink>
      </div>
      <div className="navbar-links">
        {user?.role === 'admin' && (
          <NavLink to="/admin" className={desktopOnlyNavLinkClass}>
            Admin
          </NavLink>
        )}
        {!user && (
          <NavLink to="/login" className="btn btn-primary btn-sm">
            Log in
          </NavLink>
        )}
        <button
          className="icon-btn navbar-theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              className="navbar-theme-icon"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, rotate: -90 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, rotate: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
            </motion.span>
          </AnimatePresence>
        </button>
        {user && <NotificationsDropdown />}
        {user && <AccountMenu />}
        <button
          type="button"
          ref={menuToggleRef}
          className="icon-btn navbar-menu-toggle"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="navbar-mobile-panel"
        >
          <Icon name={mobileOpen ? 'close' : 'menu'} size={18} />
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="navbar-drawer-backdrop"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="navbar-mobile-panel"
              id="navbar-mobile-panel"
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={prefersReducedMotion ? { opacity: 0 } : { x: '100%' }}
              animate={prefersReducedMotion ? { opacity: 1 } : { x: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { x: '100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
                <Icon name="home" size={15} /> Posts
              </NavLink>
              <NavLink to="/threads" className={navLinkClass} onClick={closeMenu}>
                <Icon name="message" size={15} /> Threads
              </NavLink>
              <NavLink to="/inspiration" className={navLinkClass} onClick={closeMenu}>
                <Icon name="sun" size={15} /> Inspiration
              </NavLink>
              <NavLink to="/calm" className={navLinkClass} onClick={closeMenu}>
                <Icon name="leaf" size={15} /> Calm Corner
              </NavLink>
              <NavLink to="/counselors" className={navLinkClass} onClick={closeMenu}>
                <Icon name="users" size={15} /> Counselors
              </NavLink>
              {user?.role === 'admin' && (
                <NavLink to="/admin" className={navLinkClass} onClick={closeMenu}>
                  Admin
                </NavLink>
              )}
              {user && (
                <NavLink to="/my-activity" className={navLinkClass} onClick={closeMenu}>
                  My Activity
                </NavLink>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
