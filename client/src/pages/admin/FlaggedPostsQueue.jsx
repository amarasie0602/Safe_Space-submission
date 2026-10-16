import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Card from '../../components/Card';
import CategoryTag from '../../components/CategoryTag';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';

const FlaggedPostsQueue = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyPostId, setBusyPostId] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/admin/posts');
      setPosts(data.filter((post) => post.status === 'under_review'));
    } catch {
      setError('Unable to load flagged posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleStatusUpdate = async (postId, status) => {
    setBusyPostId(postId);
    setError('');
    try {
      await api.patch(`/admin/posts/${postId}/status`, { status });
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch {
      setError('Unable to update this post. Please try again.');
    } finally {
      setBusyPostId('');
    }
  };

  const handleDelete = async (postId) => {
    setBusyPostId(postId);
    setError('');
    try {
      await api.delete(`/admin/posts/${postId}`);
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch {
      setError('Unable to delete this post. Please try again.');
    } finally {
      setBusyPostId('');
    }
  };

  return (
    <div>
      <h1>Flagged Posts</h1>
      {loading && <LoadingSpinner />}
      {!loading && error && <><ErrorMessage message={error} /><button className="btn btn-ghost btn-sm" onClick={fetchPosts}>Try again</button></>}
      {!loading && !error && posts.length === 0 && <div className="empty-state">No flagged posts need review.</div>}
      {!loading && !error && posts.map((post) => (
        <Card key={post._id}>
          <p>{post.content}</p>
          <div className="card-meta">
            <CategoryTag category={post.category} />
          </div>
          <div className="card-actions">
            <button className="btn btn-primary btn-sm" disabled={!!busyPostId} onClick={() => handleStatusUpdate(post._id, 'visible')}>
              Approve
            </button>
            <button className="btn btn-ghost btn-sm" disabled={!!busyPostId} onClick={() => handleStatusUpdate(post._id, 'removed')}>
              Remove
            </button>
            <button className="btn btn-danger btn-sm" disabled={!!busyPostId} onClick={() => handleDelete(post._id)}>
              Delete
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FlaggedPostsQueue;
