import { Link } from 'react-router-dom';
import ThemedImage from '../ThemedImage';
import { IMAGES } from '../../config/images';

const CounselorPromptCard = () => (
  <div className="card sidebar-card counselor-prompt-card">
    <ThemedImage
      src={IMAGES.counselorPrompt.src}
      alt=""
      width={96}
      height={96}
      sizes="96px"
      overlay={false}
      className="counselor-prompt-image"
    />
    <h2>Need to talk to someone?</h2>
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
