import ThemedImage from './ThemedImage';
import { IMAGES } from '../config/images';
import logo from '../assets/logo-icon.png';

const AuthCard = ({ title, subtitle, children }) => (
  <div className="auth-split">
    <div className="auth-split-image">
      <ThemedImage src={IMAGES.authSplit.src} alt="" width={235} height={360} sizes="40vw" overlay={false} />
    </div>
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
