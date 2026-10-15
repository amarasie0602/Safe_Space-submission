import { Link } from 'react-router-dom';
import Icon from '../Icon';

const CounselorPromptCard = () => (
  <div className="card sidebar-card counselor-prompt-card">
    <div className="sidebar-card-header">
      <Icon name="heart" size={16} />
      <h2>Need to talk to someone?</h2>
    </div>
    <p className="text-muted">
      This community is peer support, not professional care. If you'd like more than that,
      verified counselors here offer confidential, anonymous sessions.
    </p>
    <Link to="/counselors" className="btn btn-primary btn-sm">
      Find a Counselor
    </Link>
  </div>
);

export default CounselorPromptCard;
