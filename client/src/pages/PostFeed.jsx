import { Suspense, lazy, useContext, useEffect, useState } from 'react';
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
import { CATEGORIES } from '../utils/categories';
import { BlockedUsersContext } from '../context/BlockedUsersContext';
import useDelayedLoading from '../hooks/useDelayedLoading';
import SupportBanner from '../components/SupportBanner';
import WelcomeHero from '../components/home/WelcomeHero';
import HomeSidebar from '../components/home/HomeSidebar';
import { pickFeaturedPost, totalReactions } from '../utils/pickFeaturedPost';

// Load the optional welcome section separately from feed content.
const IntroStory = lazy(() => import('../components/home/IntroStory'));

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
    <div className="community-page">
      <WelcomeHero user={user} />
      <SupportBanner />
      <Suspense fallback={null}><IntroStory /></Suspense>
      <div className="home-layout community-layout">
      <div className="home-main" id="community-feed" tabIndex={-1}>
        <div className="feed-heading">
          <h2>The conversation</h2>
          <Link to="/threads" className="feed-browse-link">Browse threads &rarr;</Link>
        </div>

        {user ? (
          <div className="composer-teaser community-composer">
            <button
              type="button"
              className="composer-teaser-input"
              onClick={() => navigate('/posts/new')}
            >
              <AnonymousAvatar seed={user.id} avatarId={user.avatarId} />
              <span>What would you like to share?</span>
              <span className="composer-write-label">Write a post <span aria-hidden="true">&#8599;</span></span>
            </button>
            <p className="reassurance">
              Your nickname is all anyone sees.
            </p>
            <div className="composer-starters"><span>Need a starting point?</span><MoodQuickOptions onSelect={(mood) => navigate('/posts/new', { state: { mood } })} /></div>
          </div>
        ) : (
          <p className="feed-guest-note">Just looking around? You can read without an account. <Link to="/register">Join when you are ready.</Link></p>
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
      <HomeSidebar onSelectCategory={(value) => {
        setCategory(value);
        document.getElementById('community-feed')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }} />
      </div>
      <section className="community-invitation">
        <span className="eyebrow">THERE’S NO RIGHT WAY TO BEGIN</span>
        <h2>Reading is participating, too.</h2>
        <p>Stay for a story, take a quiet moment, or share when you’re ready. This space is yours to make your own.</p>
        <Link to="/threads" className="text-link">Find a conversation <span aria-hidden="true">&#8599;</span></Link>
        <Link to="/calm" className="text-link">Take a breathing break <span aria-hidden="true">&#8599;</span></Link>
      </section>
    </div>
  );
};

export default PostFeed;
