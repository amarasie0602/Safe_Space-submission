import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="footer-disclaimer">
      <p>
        SafeSpace is a peer support platform and is not a substitute for emergency services or
        professional medical care.
      </p>
      <p>If you are experiencing an immediate emergency, contact your local emergency service.</p>
    </div>
    <div className="footer-links">
      <div className="footer-column">
        <h2>Company</h2>
        <Link to="/about">About SafeSpace</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="footer-column">
        <h2>Support</h2>
        <Link to="/contact">Help Center</Link>
        <Link to="/inspiration">Healing Reads</Link>
        <Link to="/guidelines">Community Guidelines</Link>
        <Link to="/crisis-resources">Crisis Resources</Link>
        <Link to="/counselors">Professional Support</Link>
      </div>
      <div className="footer-column">
        <h2>Legal</h2>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
      </div>
      <div className="footer-column">
        <h2>Counselors</h2>
        <Link to="/counselor-login">Counselor Login</Link>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} SafeSpace. A peer support community.</span>
    </div>
  </footer>
);

export default Footer;
