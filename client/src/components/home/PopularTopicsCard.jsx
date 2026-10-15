import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Icon from '../Icon';
import { getCategoryMeta } from '../../utils/categories';

const PopularTopicsCard = ({ onSelectCategory }) => {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get('/posts/category-counts')
      .then(({ data }) => {
        if (active) setCounts(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (!counts) return null;

  const topTopics = Object.entries(counts)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (topTopics.length === 0) return null;

  return (
    <div className="card sidebar-card">
      <div className="sidebar-card-header">
        <Icon name="star" size={16} />
        <h2>Popular Topics</h2>
      </div>
      <ul className="popular-topics">
        {topTopics.map(([category, count]) => {
          const meta = getCategoryMeta(category);
          return (
            <li key={category}>
              <button type="button" onClick={() => onSelectCategory(category)}>
                <Icon name={meta.icon} size={14} />
                <span>{meta.label}</span>
                <span className="text-muted">{count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PopularTopicsCard;
