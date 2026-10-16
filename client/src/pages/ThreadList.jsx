import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ThreadCard from '../components/ThreadCard';
import Icon from '../components/Icon';
import SearchBar from '../components/SearchBar';
import ErrorMessage from '../components/ErrorMessage';
import SkeletonCard from '../components/SkeletonCard';
import { AuthContext } from '../context/AuthContext';
import { CATEGORIES } from '../utils/categories';

const ThreadList = () => {
  const { user } = useContext(AuthContext);
  const [threads, setThreads] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/threads', {
          params: { page: 1, limit: 10, ...(category && { category }), ...(search && { search }) },
        });
        setThreads(data.threads);
        setHasMore(data.hasMore);
        setPage(1);
      } catch {
        setError('Unable to load threads right now. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchThreads();
  }, [category, search]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    setLoadMoreError('');
    try {
      const nextPage = page + 1;
      const { data } = await api.get('/threads', {
        params: {
          page: nextPage,
          limit: 10,
          ...(category && { category }),
          ...(search && { search }),
        },
      });
      setThreads((prev) => [...prev, ...data.threads]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch {
      setLoadMoreError('Unable to load more threads right now.');
    } finally {
      setLoadingMore(false);
    }
  };

  const searchSuggestions = search
    ? [...new Set(threads.map((thread) => thread.title))].filter((title) =>
        title.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const sortedThreads = [...threads].sort((a, b) => {
    if (sort === 'supported') {
      return (b.upvotes || 0) - (a.upvotes || 0);
    }
    return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
  });

  return (
    <div className="threads-page">
      <div className="hero threads-hero">
        <div className="hero-text">
          <span className="threads-eyebrow"><Icon name="message" size={14} /> Community conversations</span>
          <h1>Talk it through.</h1>
          <p>Start a conversation or find one that feels familiar. Take part at your own pace.</p>
        </div>
        <div className="threads-art" aria-hidden="true">
          <svg viewBox="0 0 280 190" fill="none">
            <path d="M44 34h129c13 0 23 10 23 23v43c0 13-10 23-23 23h-18l-23 22v-22H44c-13 0-23-10-23-23V57c0-13 10-23 23-23Z" className="threads-bubble threads-bubble-back" />
            <path d="M110 71h126c12 0 22 10 22 22v39c0 12-10 22-22 22h-50l-21 20v-20h-55c-12 0-22-10-22-22V93c0-12 10-22 22-22Z" className="threads-bubble threads-bubble-front" />
            <circle cx="72" cy="79" r="5" className="threads-dot" />
            <circle cx="96" cy="79" r="5" className="threads-dot" />
            <circle cx="120" cy="79" r="5" className="threads-dot" />
            <path d="m218 32 3.2 8.8L230 44l-8.8 3.2L218 56l-3.2-8.8L206 44l8.8-3.2L218 32Z" className="threads-spark" />
          </svg>
        </div>
      </div>
      <div className="thread-toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search thread titles..."
          suggestions={searchSuggestions}
        />
        {user && (
          <Link to="/threads/new" className="btn btn-primary btn-sm">
            New Thread
          </Link>
        )}
      </div>
      <div className="threads-discovery">
        <div className="threads-topics">
          <span className="threads-control-label">Browse by topic</span>
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
        </div>
        <label className="sort-select threads-sort">
          <span>Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="recent">Most Recent</option>
            <option value="supported">Most Supported</option>
          </select>
        </label>
      </div>
      {!loading && !error && sortedThreads.length > 0 && (
        <div className="thread-list-heading">
          <h2>{category ? CATEGORIES.find((item) => item.value === category)?.label : 'Open conversations'}</h2>
          <span>{threads.length}{hasMore ? '+' : ''} {threads.length === 1 ? 'conversation' : 'conversations'}</span>
        </div>
      )}
      <div className="thread-grid">
        {loading && <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>}
        {!loading && error && <ErrorMessage message={error} />}
        {!loading && !error && threads.length === 0 && <div className="empty-state">No threads found. You can start a conversation when you feel ready.</div>}
        {!loading && !error && sortedThreads.map((thread, index) => (
          <ThreadCard key={thread._id} thread={thread} featured={index === 0} />
        ))}
      </div>
      {loadMoreError && <ErrorMessage message={loadMoreError} />}
      {hasMore && (
        <div className="load-more">
          <button type="button" className="btn btn-ghost" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading more...' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ThreadList;
