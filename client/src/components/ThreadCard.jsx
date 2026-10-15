import { Link } from 'react-router-dom';
import AnonymousAvatar from './AnonymousAvatar';
import CategoryTag from './CategoryTag';
import { timeAgo } from '../utils/timeAgo';
import Icon from './Icon';

const ThreadCard = ({ thread, index = 0 }) => (
  <Link
    to={`/threads/${thread._id}`}
    className="thread-card"
    style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
  >
    <div className="post-card-header">
      <AnonymousAvatar seed={thread.author?._id} avatarId={thread.author?.avatarId} />
      <div className="post-card-authorline">
        <div className="post-card-meta">
          <strong>{thread.author?.pseudonym}</strong>
          <CategoryTag category={thread.category} />
        </div>
        <span className="text-muted">{timeAgo(thread.createdAt)}</span>
      </div>
    </div>
    <h3 className="thread-card-title">{thread.title}</h3>
    <p className="thread-card-excerpt">{thread.body}</p>
    <div className="post-card-reactions">
      <span className="reaction-btn reaction-static">
        <Icon name="heart" size={16} /> {thread.upvotes || 0}
      </span>
      <span className="reaction-btn reaction-static">
        <Icon name="message" size={16} /> {thread.replyCount || 0}{' '}
        {thread.replyCount === 1 ? 'reply' : 'replies'}
      </span>
    </div>
  </Link>
);

export default ThreadCard;
