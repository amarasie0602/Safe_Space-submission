import { useState } from 'react';
import { Link } from 'react-router-dom';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

const AuthScene = ({ children, mode = 'login' }) => {
  const reducedMotion = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  return (
    <div className="auth-experience" data-still={paused || reducedMotion}>
      <div className="auth-scene-light" aria-hidden="true">
        <svg viewBox="0 0 1440 1000" preserveAspectRatio="none" fill="none">
          <g className="auth-wave auth-wave-back">
            <path d="M-240 430C0 290 220 580 480 440S940 300 1200 440S1580 570 1740 400V1120H-240Z" />
          </g>
          <g className="auth-wave auth-wave-middle">
            <path d="M-240 650C20 490 250 750 530 600S980 470 1230 620S1600 730 1740 550V1120H-240Z" />
          </g>
          <g className="auth-wave auth-wave-front">
            <path d="M-240 840C10 670 270 960 550 780S1030 690 1280 800S1590 880 1740 740V1120H-240Z" />
          </g>
        </svg>
      </div>
      <div className="auth-scene-layout">
        <div className="auth-scene-intro">
          <span className="eyebrow">A LITTLE ROOM FOR YOU</span>
          <p className="auth-scene-title">{mode === 'register' ? <>A space to <em>be yourself.</em></> : <>Come back to <em>your space.</em></>}</p>
          <p>{mode === 'register' ? 'No real names. No email. Just you.' : 'Somewhere to share. Someone who understands.'}</p>
        </div>
        <div className="auth-scene-form">
          {children}
        </div>
        <p className="auth-scene-privacy">Your nickname is all anyone sees. <Link to="/privacy">How we protect your privacy</Link></p>
        <Link to="/crisis-resources" className="auth-scene-support">Need support now?</Link>
      </div>
      {!reducedMotion && <button type="button" className="auth-scene-toggle" onClick={() => setPaused(value => !value)}>
        {paused ? 'Resume background' : 'Pause background'}
      </button>}
    </div>
  );
};
export default AuthScene;
