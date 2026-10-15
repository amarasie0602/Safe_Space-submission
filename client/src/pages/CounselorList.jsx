import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import CounselorCard from '../components/CounselorCard';
import SkeletonCard from '../components/SkeletonCard';
import NetworkError from '../components/NetworkError';
import SearchBar from '../components/SearchBar';
import ThemedImage from '../components/ThemedImage';
import { IMAGES } from '../config/images';
import { CATEGORIES } from '../utils/categories';
import CounselorsSidebar from '../components/counselors/CounselorsSidebar';

const CounselorList = () => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');

  const fetchCounselors = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/counselors');
      setCounselors(data);
    } catch {
      setError('Unable to load content right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounselors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(
    () =>
      counselors
        .filter((c) => !specialty || c.specialties?.includes(specialty))
        .filter((c) => {
          if (!search) return true;
          const haystack = `${c.name} ${c.credentials || ''}`.toLowerCase();
          return haystack.includes(search.toLowerCase());
        }),
    [counselors, search, specialty]
  );

  return (
    <div className="home-layout">
      <div className="home-main">
        <div className="hero">
          <div className="hero-text">
            <h1>Counselors &amp; Professionals</h1>
            <p>Book a confidential, anonymous session with a licensed professional.</p>
          </div>
          <div className="hero-photo">
            <ThemedImage
              src={IMAGES.counselorsHero.src}
              alt=""
              width={220}
              height={220}
              sizes="200px"
              overlay={false}
            />
          </div>
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name or credentials..."
        />
        <div className="tabs tabs-scroll">
          <button className={`tab${specialty === '' ? ' active' : ''}`} onClick={() => setSpecialty('')}>
            All Specialties
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              className={`tab${specialty === c.value ? ' active' : ''}`}
              onClick={() => setSpecialty(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
        {!loading && error && <NetworkError message={error} onRetry={fetchCounselors} />}
        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">No counselors match that search.</div>
        )}
        {!loading &&
          !error &&
          filtered.map((counselor) => <CounselorCard key={counselor._id} counselor={counselor} />)}
      </div>
      <CounselorsSidebar />
    </div>
  );
};

export default CounselorList;
