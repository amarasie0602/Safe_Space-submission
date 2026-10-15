import { Link } from 'react-router-dom';
import Icon from '../Icon';
import ThemedImage from '../ThemedImage';
import { IMAGES } from '../../config/images';

const CONSIDERATIONS = [
  { icon: 'message', title: 'What would you like to talk about?', body: "It can help to think about what's been on your mind." },
  { icon: 'star', title: 'What are your goals?', body: 'You might want support, guidance, or coping strategies.' },
  { icon: 'heart', title: 'What type of session feels right?', body: 'Every counselor here sets their own real availability.' },
  { icon: 'lock', title: "Remember, it's anonymous", body: 'Your identity stays private, always.' },
];

const CounselorsSidebar = () => (
  <aside className="home-sidebar" aria-label="Counselor support sidebar">
    <div className="card sidebar-card counselors-intro-card">
      <ThemedImage src={IMAGES.counselorPrompt.src} alt="" width={240} height={220} sizes="200px" overlay={false} />
      <h2>Finding the right support</h2>
      <p className="text-muted">
        Taking care of your mental health is a sign of strength. Verified, licensed professionals
        here are ready to listen, support, and guide you — all in a safe and confidential space.
      </p>
    </div>

    <div className="card sidebar-card">
      <div className="sidebar-card-header">
        <Icon name="leaf" size={16} />
        <h2>Things to consider before a session</h2>
      </div>
      <ul className="consideration-list">
        {CONSIDERATIONS.map((item) => (
          <li key={item.title}>
            <span className="consideration-icon">
              <Icon name={item.icon} size={15} />
            </span>
            <div>
              <strong>{item.title}</strong>
              <p className="text-muted">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>

    <div className="card sidebar-card counselor-prompt-card">
      <h2>Need immediate support?</h2>
      <p className="text-muted">
        If you're in crisis or need urgent help, please reach out to a local helpline or
        emergency service right away.
      </p>
      <Link to="/crisis-resources" className="btn btn-primary btn-sm">
        View Support Resources
      </Link>
    </div>
  </aside>
);

export default CounselorsSidebar;
