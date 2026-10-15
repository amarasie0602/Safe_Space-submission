import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import SkeletonCard from '../components/SkeletonCard';
import ErrorMessage from '../components/ErrorMessage';
import NetworkError from '../components/NetworkError';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import Icon from '../components/Icon';
import AnonymousAvatar from '../components/AnonymousAvatar';
import MoodQuickOptions from '../components/MoodQuickOptions';
import DailyAffirmation from '../components/DailyAffirmation';
import { CATEGORIES } from '../utils/categories';
import { BlockedUsersContext } from '../context/BlockedUsersContext';
import useDelayedLoading from '../hooks/useDelayedLoading';
import ThemedImage from '../components/ThemedImage';
import { IMAGES } from '../config/images';
import HomeSidebar from '../components/home/HomeSidebar';
import { pickFeaturedPost, totalReactions } from '../utils/pickFeaturedPost';

const PostFeed = () => {
  const { user } = useContext(AuthContext);
  const { isBlocked } = useContext(BlockedUsersContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [loading, setLoading] = useState(true);
  const showLoading = useDelayedLoading(loading);
  const [error, setError] = useState('');
  const [loadMoreError, setLoadMoreError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/posts', { params: { page: 1, limit: 10 } });
      setPosts(data.posts);
      setHasMore(data.hasMore);
      setPage(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load content right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    setLoadMoreError('');
    try {
      const nextPage = page + 1;
      const { data } = await api.get('/posts', { params: { page: nextPage, limit: 10 } });
      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch {
      setLoadMoreError('Unable to load more posts right now.');
    } finally {
      setLoadingMore(false);
    }
  };

  const visiblePosts = posts
    .filter((post) => !category || post.category === category)
    .filter((post) => !isBlocked(post.author?._id))
    .filter((post) => !search || post.content.toLowerCase().includes(search.toLowerCase()));

  const searchSuggestions = search
    ? [...new Set(posts.map((post) => post.content))].filter((content) =>
        content.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const sortedPosts = [...visiblePosts].sort((a, b) => {
    if (sort === 'supported') {
      return totalReactions(b) - totalReactions(a);
    }
    return 0;
  });

  // Only spotlight a featured post on the default, unfiltered view — once
  // someone's searching or filtering by category, pulling a post out of
  // order would just be confusing.
  const showFeatured = !category && !search && sort === 'recent';
  const featuredPost = showFeatured ? pickFeaturedPost(sortedPosts) : null;
  const remainingPosts = featuredPost
    ? sortedPosts.filter((post) => post._id !== featuredPost._id)
    : sortedPosts;

  return (
    <div className="home-layout">
      <div className="home-main">
        <div className="hero">
          <div className="hero-text">
            <h1>Welcome to SafeSpace</h1>
            <p>A place to share your thoughts anonymously and connect with people who understand.</p>
            <div className="hero-badges">
              <span className="badge tag-sage">
                <Icon name="shield" size={13} /> Always anonymous
              </span>
              <span className="badge tag-mocha">
                <Icon name="users" size={13} /> Supportive community
              </span>
            </div>
          </div>
          <div className="hero-photo">
            <ThemedImage
              src={IMAGES.landingHero.src}
              alt=""
              width={792}
              height={370}
              sizes="(max-width: 860px) 100vw, 420px"
              loading="eager"
              fetchPriority="high"
              overlay={false}
            />
          </div>
        </div>

        <DailyAffirmation />

        {user ? (
          <div className="card composer-teaser">
            <button
              type="button"
              className="composer-teaser-input"
              onClick={() => navigate('/posts/new')}
            >
              <AnonymousAvatar seed={user.id} avatarId={user.avatarId} />
              <span>Share what&apos;s on your mind...</span>
            </button>
            <p className="reassurance">
              <Icon name="lock" size={14} /> Your identity remains anonymous. Express yourself
              freely in a safe environment.
            </p>
            <MoodQuickOptions onSelect={(mood) => navigate('/posts/new', { state: { mood } })} />
          </div>
        ) : (
          <p className="reassurance">
            <Icon name="lock" size={14} /> Your identity is safe here.
          </p>
        )}

        <SearchBar value={search} onChange={setSearch} placeholder="Search posts..." suggestions={searchSuggestions} />
        <div className="filter-row">
          <label className="sort-select">
            Sort by
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="recent">Most Recent</option>
              <option value="supported">Most Supported</option>
            </select>
          </label>
        </div>
        <div className="tabs tabs-scroll">
          <button className={`tab${category === '' ? ' active' : ''}`} onClick={() => setCategory('')}>
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              className={`tab${category === c.value ? ' active' : ''}`}
              onClick={() => setCategory(c.value)}
            >
              <Icon name={c.icon} size={14} /> {c.label}
            </button>
          ))}
        </div>
        {showLoading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
        {!loading && error && <NetworkError message={error} onRetry={fetchPosts} />}
        {!loading && !error && visiblePosts.length === 0 && posts.length > 0 && (
          <div className="empty-state">No posts found. Try a different search or category.</div>
        )}
        {!loading && !error && visiblePosts.length === 0 && posts.length === 0 && (
          <EmptyState message="You're not alone. Share when you're ready." />
        )}
        {!loading && !error && featuredPost && (
          <PostCard post={featuredPost} index={0} showFlagged={user?.role === 'admin'} featured />
        )}
        {!loading &&
          !error &&
          remainingPosts.map((post, index) => (
            <PostCard
              key={post._id}
              post={post}
              index={featuredPost ? index + 1 : index}
              showFlagged={user?.role === 'admin'}
            />
          ))}
        {loadMoreError && <ErrorMessage message={loadMoreError} />}
        {!loading && !error && !category && !search && hasMore && (
          <div className="load-more">
            <button type="button" className="btn btn-ghost" onClick={handleLoadMore} disabled={loadingMore}>
              {loadingMore ? 'Loading more...' : 'Load more'}
            </button>
          </div>
        )}
        {user && (
          <Link to="/posts/new" className="fab" aria-label="Create a new post" title="Create a new post">
            +
          </Link>
        )}
      </div>
      <HomeSidebar onSelectCategory={setCategory} />
    </div>
  );
};

export default PostFeed;
