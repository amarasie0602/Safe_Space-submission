import { useState } from 'react';
import Icon from '../Icon';
import { MEDITATION_VIDEOS } from '../../config/calmCorner';

const VideoTile = ({ video }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="meditation-tile">
      {loaded ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&cc_load_policy=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button
          type="button"
          className="meditation-tile-thumb"
          onClick={() => setLoaded(true)}
          aria-label={`Play ${video.title}`}
        >
          <img
            src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            width={480}
            height={360}
          />
          <span className="meditation-tile-play" aria-hidden="true">
            <Icon name="sun" size={28} />
          </span>
        </button>
      )}
      <div className="meditation-tile-meta">
        <strong>{video.title}</strong>
        <span className="text-muted">{video.channel}</span>
      </div>
    </div>
  );
};

const GuidedMeditation = () => (
  <section className="calm-section" aria-labelledby="meditation-heading">
    <h2 id="meditation-heading">Guided meditation</h2>
    <p className="text-muted">A few short, calming sessions if you'd rather be led through it.</p>
    <div className="meditation-grid">
      {MEDITATION_VIDEOS.map((video) => (
        <VideoTile key={video.id} video={video} />
      ))}
    </div>
  </section>
);

export default GuidedMeditation;
