import { useState } from 'react';
import Icon from '../components/Icon';
import ThemedImage from '../components/ThemedImage';
import { IMAGES } from '../config/images';
import { ARTICLES } from '../utils/inspiration';

const TOPICS = [...new Set(ARTICLES.map((a) => a.topic))];

const ArticleCard = ({ article, isOpen, onToggle, large }) => (
  <div className={`card article-card${large ? ' article-card-featured' : ''}`}>
    <ThemedImage
      src={IMAGES.healingReadsCovers[article.id]?.src}
      alt=""
      width={large ? 420 : 220}
      height={large ? 220 : 140}
      sizes={large ? '(max-width: 700px) 100vw, 420px' : '220px'}
      className="article-card-cover"
    />
    <div className="article-card-content">
      <button type="button" className="article-card-header" onClick={onToggle} aria-expanded={isOpen}>
        <div>
          <div className="post-card-meta">
            <span className="badge">{article.topic}</span>
            <span className="text-muted">{article.readTime}</span>
          </div>
          {large ? <h2>{article.title}</h2> : <h3>{article.title}</h3>}
          <p className="text-muted">{article.excerpt}</p>
        </div>
        <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} />
      </button>
      {isOpen && (
        <div className="article-card-body">
          {article.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  </div>
);

const Inspiration = () => {
  const [openId, setOpenId] = useState(null);
  const [topic, setTopic] = useState('');

  const filtered = topic ? ARTICLES.filter((a) => a.topic === topic) : ARTICLES;
  const [featured, ...rest] = filtered;

  return (
    <div>
      <div className="hero">
        <div className="hero-text">
          <h1>Healing Reads</h1>
          <p>
            Short, honest reads for the days you need something gentler than a blank page —
            self-compassion, rest, gratitude, and coping skills, written for SafeSpace.
          </p>
        </div>
        <div className="hero-photo">
          <ThemedImage src={IMAGES.inspirationHero.src} alt="" width={478} height={370} sizes="(max-width: 860px) 100vw, 360px" overlay={false} />
        </div>
      </div>

      <div className="tabs">
        <button className={`tab${topic === '' ? ' active' : ''}`} onClick={() => setTopic('')}>
          All
        </button>
        {TOPICS.map((t) => (
          <button key={t} className={`tab${topic === t ? ' active' : ''}`} onClick={() => setTopic(t)}>
            {t}
          </button>
        ))}
      </div>

      {featured && (
        <ArticleCard
          article={featured}
          isOpen={openId === featured.id}
          onToggle={() => setOpenId(openId === featured.id ? null : featured.id)}
          large
        />
      )}

      {rest.length > 0 && (
        <>
          <h2 className="section-heading">More Healing Reads</h2>
          <div className="article-grid">
            {rest.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                isOpen={openId === article.id}
                onToggle={() => setOpenId(openId === article.id ? null : article.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Inspiration;
