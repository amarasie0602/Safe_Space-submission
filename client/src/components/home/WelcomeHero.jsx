import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

const POSTER = '/media/dream-journal.jpg';

const WelcomeHero = ({ user }) => {
  const reducedMotion = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const videoRef = useRef(null);
  const showVideo = !reducedMotion && !unavailable;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    let visible = true;
    const syncPlayback = () => {
      if (paused || document.hidden || !visible) video.pause();
      else video.play().catch(() => setUnavailable(true));
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(video);
    document.addEventListener('visibilitychange', syncPlayback);
    syncPlayback();
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      video.pause();
    };
  }, [paused, showVideo]);

  return (
    <header className="welcome-hero">
      <div className="welcome-scene" aria-hidden="true">
        <img src={POSTER} alt="" width="1920" height="1080" fetchPriority="high" />
        {showVideo && <video ref={videoRef} autoPlay muted loop playsInline controls={false}
          disablePictureInPicture disableRemotePlayback poster={POSTER} preload="metadata"
          onError={() => setUnavailable(true)}>
          <source src="/media/dream-journal.mp4" type="video/mp4" />
        </video>}
      </div>
      <div className="welcome-copy">
        <h1>Some things are<br />easier to share here.</h1>
        <p>Whatever today feels like, you don’t have to carry it alone. A quiet space to share, listen, and find your people.</p>
        <div className="welcome-actions">
          <Link className="btn btn-primary" to={user ? '/posts/new' : '/register'}>{user ? 'Share what’s on your mind' : 'Find your safe space'} <span aria-hidden="true">&#8599;</span></Link>
          <a href="#community-feed" className="text-link">Explore the community <span aria-hidden="true">&#8595;</span></a>
        </div>
        <p className="welcome-note">Anonymous by choice. Welcome as you are.</p>
      </div>
      <div className="welcome-caption">
        <Link to="/crisis-resources" className="welcome-support-link">Need support now?</Link>
        {showVideo && <button type="button" className="scene-toggle" onClick={() => setPaused(value => !value)}>{paused ? 'Resume background' : 'Pause background'}</button>}
      </div>
    </header>
  );
};
export default WelcomeHero;
