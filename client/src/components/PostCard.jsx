import { useContext, useState } from 'react';
import api from '../api/axios';
import AnonymousAvatar from './AnonymousAvatar';
import CategoryTag from './CategoryTag';
import { timeAgo } from '../utils/timeAgo';
import { ToastContext } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';
import { SavedPostsContext } from '../context/SavedPostsContext';
import PostOptionsMenu from './PostOptionsMenu';
import PostReplies from './PostReplies';
import Icon from './Icon';

// Three distinct, real, independently-tracked reaction types (backend:
// Post.reactions, one per user, mutually exclusive) — not decorative, each
// one persists and has its own count.
const REACTIONS = [
  { type: 'heard', label: 'I hear you', icon: 'heart' },
  { type: 'support', label: 'Sending support', icon: 'avatar-embrace' },
  { type: 'beenthere', label: "I've been there", icon: 'avatar-anchor' },
];

const emptyCounts = () => Object.fromEntries(REACTIONS.map((r) => [r.type, 0]));

const countsFromReactions = (reactions = []) => {
  const counts = emptyCounts();
  reactions.forEach((r) => { counts[r.type] = (counts[r.type] || 0) + 1; });
  return counts;
};

const PostCard = ({ post, showFlagged, index = 0, featured = false }) => {
  const { user } = useContext(AuthContext);
  const [counts, setCounts] = useState(() => countsFromReactions(post.reactions));
  const [userReaction, setUserReaction] = useState(
    () => (user ? (post.reactions || []).find((r) => r.user === user.id)?.type ?? null : null)
  );
  const [showReplies, setShowReplies] = useState(false);
  const { showToast } = useContext(ToastContext);
  const { isSaved, toggleSaved } = useContext(SavedPostsContext);
  const saved = isSaved(post._id);

  const handleReact = async (type) => {
    if (!user) {
      showToast('Log in to react to a post');
      return;
    }
    const prevReaction = userReaction;
    const prevCounts = counts;

    const nextReaction = prevReaction === type ? null : type;
    const nextCounts = { ...prevCounts };
    if (prevReaction) nextCounts[prevReaction] -= 1;
    if (nextReaction) nextCounts[nextReaction] += 1;
    setUserReaction(nextReaction);
    setCounts(nextCounts);

    try {
      const { data } = await api.patch(`/posts/${post._id}/react`, { type });
      setUserReaction(data.userReaction);
      setCounts(data.counts);
    } catch {
      setUserReaction(prevReaction);
      setCounts(prevCounts);
      showToast('Unable to update that reaction right now.');
    }
  };

  const handleReply = () => setShowReplies((prev) => !prev);

  const handleSave = async () => {
    if (!user) {
      showToast('Log in to save a post');
      return;
    }
    try {
      const nowSaved = await toggleSaved(post._id);
      showToast(nowSaved ? 'Post saved' : 'Removed from saved posts');
    } catch {
      showToast('Unable to update saved posts right now.');
    }
  };

  return (
    <div
      className={`post-card${featured ? ' post-card-featured' : ''}`}
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      {featured && (
        <span className="featured-badge">
          <Icon name="star" size={13} /> Featured Discussion
        </span>
      )}
      <div className="post-card-header">
        <AnonymousAvatar seed={post.author?._id} avatarId={post.author?.avatarId} />
        <div className="post-card-authorline">
          <div className="post-card-meta">
            <strong>{post.author?.pseudonym}</strong>
            <CategoryTag category={post.category} />
          </div>
          <span className="text-muted">{timeAgo(post.createdAt)}</span>
        </div>
        {showFlagged && post.flagged && <span className="badge badge-danger">flagged</span>}
        <PostOptionsMenu post={post} />
      </div>
      <p className="post-card-content">{post.content}</p>
      <div className="post-card-reactions">
        {REACTIONS.map((reaction) => (
          <button
            key={reaction.type}
            type="button"
            className={`reaction-btn${userReaction === reaction.type ? ' active' : ''}`}
            onClick={() => handleReact(reaction.type)}
            aria-pressed={userReaction === reaction.type}
            aria-label={reaction.label}
          >
            <Icon name={reaction.icon} size={16} />
            {counts[reaction.type] > 0 && <span className="reaction-count">{counts[reaction.type]}</span>}
            <span className="reaction-label">{reaction.label}</span>
          </button>
        ))}
        <button type="button" className={`reaction-btn${showReplies ? ' active' : ''}`} onClick={handleReply}>
          <Icon name="message" size={16} /> Reply
        </button>
        <button
          type="button"
          className={`reaction-btn reaction-btn-icon-only${saved ? ' active' : ''}`}
          onClick={handleSave}
          aria-label={saved ? 'Remove from saved posts' : 'Save this post'}
          title={saved ? 'Remove from saved posts' : 'Save this post'}
        >
          <Icon name="bookmark" size={16} />
        </button>
      </div>
      {showReplies && <PostReplies postId={post._id} />}
    </div>
  );
};

export default PostCard;
