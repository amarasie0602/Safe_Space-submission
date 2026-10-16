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
          referrerPolicy="strict-origin-when-cross-origin"
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
            <Icon name="play" size={24} />
          </span>
        </button>
      )}
      <div className="meditation-tile-meta">
        <strong>{video.title}</strong>
        <span className="text-muted">{video.duration} · {video.source}</span>
        <a
          className="meditation-watch-link"
          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
          target="_blank"
          rel="noreferrer"
        >
          Watch on YouTube
        </a>
      </div>
    </div>
  );
};

const GuidedMeditation = () => (
  <section className="calm-section" id="meditation-section" aria-labelledby="meditation-heading">
    <div className="calm-section-heading">
      <div>
        <span className="calm-section-kicker">03 · Listen along</span>
        <h2 id="meditation-heading">Guided meditation</h2>
      </div>
      <span className="calm-section-mark" aria-hidden="true">03</span>
    </div>
    <p className="text-muted">A short guided session, if you would rather follow along.</p>
    <div className="meditation-grid">
      {MEDITATION_VIDEOS.map((video) => (
        <VideoTile key={video.id} video={video} />
      ))}
    </div>
    <p className="calm-privacy-note">Preview images come from YouTube; the video player loads when selected.</p>
  </section>
);

export default GuidedMeditation;
