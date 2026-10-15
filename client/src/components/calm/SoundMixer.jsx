import { useEffect, useRef, useState } from 'react';
import Icon from '../Icon';
import ThemedImage from '../ThemedImage';
import { IMAGES } from '../../config/images';
import { SOUND_TILES, SLEEP_TIMER_OPTIONS } from '../../config/calmCorner';

const FADE_MS = 400;

// Fades an <audio> element's volume toward `target` over FADE_MS, so
// toggling a sound in/out is never an abrupt on/off click.
const fadeVolume = (audio, target, onDone) => {
  const start = audio.volume;
  const startTime = performance.now();
  const step = (now) => {
    const progress = Math.min((now - startTime) / FADE_MS, 1);
    audio.volume = start + (target - start) * progress;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      onDone?.();
    }
  };
  requestAnimationFrame(step);
};

const SoundMixer = () => {
  const audioRefs = useRef({});
  const [playing, setPlaying] = useState({});
  const [volumes, setVolumes] = useState(() =>
    Object.fromEntries(SOUND_TILES.map((t) => [t.id, 0.7]))
  );
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [sleepMinutes, setSleepMinutes] = useState(null);
  const sleepTimeoutRef = useRef(null);
  const sleepIntervalRef = useRef(null);
  const [sleepRemaining, setSleepRemaining] = useState(null);

  useEffect(
    () => () => {
      clearTimeout(sleepTimeoutRef.current);
      clearInterval(sleepIntervalRef.current);
    },
    []
  );

  const effectiveVolume = (id) => volumes[id] * masterVolume;

  const toggleTile = (tile) => {
    const audio = audioRefs.current[tile.id];
    if (!audio) return;
    const isPlaying = !!playing[tile.id];

    if (isPlaying) {
      fadeVolume(audio, 0, () => audio.pause());
      setPlaying((prev) => ({ ...prev, [tile.id]: false }));
    } else {
      audio.volume = 0;
      // A missing /public/audio file (not added yet) rejects play() —
      // that's expected until real files are in place, so it's swallowed
      // rather than surfaced as an app error.
      audio.play().catch(() => {});
      fadeVolume(audio, effectiveVolume(tile.id));
      setPlaying((prev) => ({ ...prev, [tile.id]: true }));
    }
  };

  const handleTileVolume = (id, value) => {
    setVolumes((prev) => ({ ...prev, [id]: value }));
    const audio = audioRefs.current[id];
    if (audio && playing[id]) audio.volume = value * masterVolume;
  };

  const handleMasterVolume = (value) => {
    setMasterVolume(value);
    SOUND_TILES.forEach((tile) => {
      const audio = audioRefs.current[tile.id];
      if (audio && playing[tile.id]) audio.volume = volumes[tile.id] * value;
    });
  };

  const startSleepTimer = (minutes) => {
    clearTimeout(sleepTimeoutRef.current);
    clearInterval(sleepIntervalRef.current);
    setSleepMinutes(minutes);
    setSleepRemaining(minutes * 60);

    sleepIntervalRef.current = setInterval(() => {
      setSleepRemaining((prev) => (prev && prev > 0 ? prev - 1 : prev));
    }, 1000);

    sleepTimeoutRef.current = setTimeout(() => {
      SOUND_TILES.forEach((tile) => {
        const audio = audioRefs.current[tile.id];
        if (audio && playing[tile.id]) {
          fadeVolume(audio, 0, () => audio.pause());
        }
      });
      setPlaying({});
      setSleepMinutes(null);
      setSleepRemaining(null);
      clearInterval(sleepIntervalRef.current);
    }, minutes * 60 * 1000);
  };

  const cancelSleepTimer = () => {
    clearTimeout(sleepTimeoutRef.current);
    clearInterval(sleepIntervalRef.current);
    setSleepMinutes(null);
    setSleepRemaining(null);
  };

  return (
    <section className="calm-section" aria-labelledby="sound-mixer-heading">
      <h2 id="sound-mixer-heading">Ambient sounds</h2>
      <p className="text-muted">Layer a few together, or let one play quietly in the background.</p>

      <div className="sound-tiles">
        {SOUND_TILES.map((tile) => {
          const thumb = IMAGES.calmCornerTiles[tile.id];
          return (
          <div className={`sound-tile${playing[tile.id] ? ' active' : ''}`} key={tile.id}>
            <audio ref={(el) => (audioRefs.current[tile.id] = el)} src={tile.src} loop preload="none" />
            <button
              type="button"
              className="sound-tile-toggle"
              onClick={() => toggleTile(tile)}
              aria-pressed={!!playing[tile.id]}
            >
              {thumb ? (
                <ThemedImage
                  src={thumb.src}
                  alt=""
                  width={48}
                  height={48}
                  sizes="48px"
                  className="sound-tile-thumb"
                />
              ) : (
                <Icon name={tile.icon} size={20} />
              )}
              <span>{tile.label}</span>
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volumes[tile.id]}
              onChange={(e) => handleTileVolume(tile.id, Number(e.target.value))}
              aria-label={`${tile.label} volume`}
            />
          </div>
          );
        })}
      </div>

      <div className="sound-mixer-master">
        <label className="field-inline">
          Master volume
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={masterVolume}
            onChange={(e) => handleMasterVolume(Number(e.target.value))}
            aria-label="Master volume"
          />
        </label>

        <div className="sleep-timer" role="group" aria-label="Sleep timer">
          <span className="text-muted">Sleep timer</span>
          {SLEEP_TIMER_OPTIONS.map((minutes) => (
            <button
              key={minutes}
              type="button"
              className={`tab${sleepMinutes === minutes ? ' active' : ''}`}
              onClick={() => startSleepTimer(minutes)}
            >
              {minutes}m
            </button>
          ))}
          {sleepMinutes && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={cancelSleepTimer}>
              Cancel ({Math.ceil((sleepRemaining || 0) / 60)}m left)
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default SoundMixer;
