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
    <div>
      <div className="hero">
        <div className="hero-text">
          <h1>Threads</h1>
          <p>
            Browse ongoing conversations, or start one of your own. You can join in at your own pace.
          </p>
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
      {loading && <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>}
      {!loading && error && <ErrorMessage message={error} />}
      {!loading && !error && threads.length === 0 && <div className="empty-state">No threads found. You can start a conversation when you feel ready.</div>}
      {!loading && !error && sortedThreads.map((thread, index) => (
        <ThreadCard key={thread._id} thread={thread} index={index} />
      ))}
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
