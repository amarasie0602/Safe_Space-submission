import { IMAGES } from '../config/images';
import logo from '../assets/logo-icon.png';

const AuthCard = ({ title, subtitle, children }) => (
  <div className="auth-split">
    <aside className="auth-welcome">
      <img src={IMAGES.landingHero.src} alt="" width="800" height="534" />
      <div><span className="eyebrow">A LITTLE ROOM FOR YOU</span><h2>You can come<br />as you are.</h2><p>No perfect words needed. Just a space to feel heard.</p></div>
    </aside>
    <div className="auth-card">
      <div className="auth-card-brand">
        <img src={logo} alt="SafeSpace" />
      </div>
      <h1>{title}</h1>
      {subtitle && <p className="text-muted auth-card-subtitle">{subtitle}</p>}
      {children}
    </div>
  </div>
);

export default AuthCard;
