import Icon from '../Icon';

const CONSIDERATIONS = [
  { icon: 'message', title: 'What would you like to talk about?', body: "It can help to think about what's been on your mind." },
  { icon: 'star', title: 'What are your goals?', body: 'You might want support, guidance, or coping strategies.' },
  { icon: 'heart', title: 'What type of session feels right?', body: 'Write down any questions you may want to ask before requesting a session.' },
  { icon: 'lock', title: "Remember, it's anonymous", body: 'Your identity stays private, always.' },
];

const CounselorsSidebar = () => (
  <aside className="home-sidebar" aria-label="Counselor discovery guidance">
    <div className="card sidebar-card counselors-intro-card">
      <span className="consideration-icon counselors-sidebar-icon" aria-hidden="true"><Icon name="users" size={24} /></span>
      <h2>Choosing a professional</h2>
      <p className="text-muted">
        Compare listed credentials and specialties, then open a profile to review the booking
        details each professional provides.
      </p>
    </div>

    <div className="card sidebar-card">
      <div className="sidebar-card-header">
        <Icon name="star" size={16} />
        <h2>Before you book</h2>
      </div>
      <ul className="consideration-list">
        {CONSIDERATIONS.map((item) => (
          <li key={item.title}>
            <span className="consideration-icon"><Icon name={item.icon} size={15} /></span>
            <div>
              <strong>{item.title}</strong>
              <p className="text-muted">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </aside>
);

export default CounselorsSidebar;
