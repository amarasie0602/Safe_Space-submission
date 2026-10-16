import { useEffect, useRef, useState } from 'react';
import Icon from '../Icon';
import ThemedImage from '../ThemedImage';
import { IMAGES } from '../../config/images';
import { SOUND_TILES, SLEEP_TIMER_OPTIONS } from '../../config/calmCorner';

const FADE_MS = 400;

// Fades an <audio> element's volume toward `target` over FADE_MS, so
// toggling a sound in/out is never an abrupt on/off click.
const fadeVolume = (audio, target, frameRef, onDone) => {
  if (frameRef.current) cancelAnimationFrame(frameRef.current);
  const start = audio.volume;
  const startTime = performance.now();
  const step = (now) => {
    const progress = Math.min((now - startTime) / FADE_MS, 1);
    audio.volume = start + (target - start) * progress;
    if (progress < 1) {
      frameRef.current = requestAnimationFrame(step);
    } else {
      frameRef.current = null;
      onDone?.();
    }
  };
  frameRef.current = requestAnimationFrame(step);
};

const SoundMixer = () => {
  const audioRefs = useRef({});
  const fadeFramesRef = useRef({});
  const playingRef = useRef({});
  const [playing, setPlaying] = useState({});
  const [busyTiles, setBusyTiles] = useState({});
  const [unavailable, setUnavailable] = useState({});
  const [volumes, setVolumes] = useState(() =>
    Object.fromEntries(SOUND_TILES.map((t) => [t.id, 0.7]))
  );
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [sleepMinutes, setSleepMinutes] = useState(null);
  const [sleepNotice, setSleepNotice] = useState('');
  const sleepTimeoutRef = useRef(null);
  const sleepIntervalRef = useRef(null);
  const [sleepRemaining, setSleepRemaining] = useState(null);

  useEffect(
    () => () => {
      clearTimeout(sleepTimeoutRef.current);
      clearInterval(sleepIntervalRef.current);
      SOUND_TILES.forEach((tile) => {
        const audio = audioRefs.current[tile.id];
        if (fadeFramesRef.current[tile.id]) cancelAnimationFrame(fadeFramesRef.current[tile.id]);
        if (audio) {
          audio.pause();
        }
      });
    },
    []
  );

  const effectiveVolume = (id) => volumes[id] * masterVolume;

  const updatePlaying = (next) => {
    playingRef.current = next;
    setPlaying(next);
  };

  const toggleTile = async (tile) => {
    const audio = audioRefs.current[tile.id];
    if (!audio || busyTiles[tile.id]) return;
    const isPlaying = !!playingRef.current[tile.id];

    if (isPlaying) {
      fadeVolume(audio, 0, fadeFramesRef.current[tile.id] ||= { current: null }, () => audio.pause());
      updatePlaying({ ...playingRef.current, [tile.id]: false });
    } else {
      setBusyTiles((prev) => ({ ...prev, [tile.id]: true }));
      audio.volume = 0;
      setUnavailable((prev) => ({ ...prev, [tile.id]: false }));
      try {
        await audio.play();
        updatePlaying({ ...playingRef.current, [tile.id]: true });
        fadeVolume(audio, effectiveVolume(tile.id), fadeFramesRef.current[tile.id] ||= { current: null });
      } catch {
        setUnavailable((prev) => ({ ...prev, [tile.id]: true }));
        updatePlaying({ ...playingRef.current, [tile.id]: false });
      } finally {
        setBusyTiles((prev) => ({ ...prev, [tile.id]: false }));
      }
    }
  };

  const handleTileVolume = (id, value) => {
    setVolumes((prev) => ({ ...prev, [id]: value }));
    const audio = audioRefs.current[id];
    if (audio && playingRef.current[id]) {
      const frameRef = fadeFramesRef.current[id];
      if (frameRef?.current) cancelAnimationFrame(frameRef.current);
      if (frameRef) frameRef.current = null;
      audio.volume = value * masterVolume;
    }
  };

  const handleMasterVolume = (value) => {
    setMasterVolume(value);
    SOUND_TILES.forEach((tile) => {
      const audio = audioRefs.current[tile.id];
      if (audio && playingRef.current[tile.id]) {
        const frameRef = fadeFramesRef.current[tile.id];
        if (frameRef?.current) cancelAnimationFrame(frameRef.current);
        if (frameRef) frameRef.current = null;
        audio.volume = volumes[tile.id] * value;
      }
    });
  };

  const startSleepTimer = (minutes) => {
    clearTimeout(sleepTimeoutRef.current);
    clearInterval(sleepIntervalRef.current);
    setSleepMinutes(minutes);
    setSleepRemaining(minutes * 60);
    setSleepNotice('');

    sleepIntervalRef.current = setInterval(() => {
      setSleepRemaining((prev) => (prev && prev > 0 ? prev - 1 : prev));
    }, 1000);

    sleepTimeoutRef.current = setTimeout(() => {
      SOUND_TILES.forEach((tile) => {
        const audio = audioRefs.current[tile.id];
        if (audio && playingRef.current[tile.id]) {
          fadeVolume(audio, 0, fadeFramesRef.current[tile.id] ||= { current: null }, () => audio.pause());
        }
      });
      updatePlaying({});
      setSleepMinutes(null);
      setSleepRemaining(null);
      setSleepNotice('Sleep timer finished.');
      clearInterval(sleepIntervalRef.current);
    }, minutes * 60 * 1000);
  };

  const cancelSleepTimer = () => {
    clearTimeout(sleepTimeoutRef.current);
    clearInterval(sleepIntervalRef.current);
    setSleepMinutes(null);
    setSleepRemaining(null);
    setSleepNotice('Sleep timer cancelled.');
  };

  return (
    <section className="calm-section" id="ambient-section" aria-labelledby="sound-mixer-heading">
      <div className="calm-section-heading">
        <div>
          <span className="calm-section-kicker">02 · Set the atmosphere</span>
          <h2 id="sound-mixer-heading">Ambient sounds</h2>
        </div>
        <span className="calm-section-mark" aria-hidden="true">02</span>
      </div>
      <p className="text-muted">Layer a few together, or let one play quietly in the background.</p>

      <div className="sound-tiles">
        {SOUND_TILES.map((tile) => {
          const thumb = IMAGES.calmCornerTiles[tile.id];
          return (
          <div className={`sound-tile${playing[tile.id] ? ' active' : ''}${unavailable[tile.id] ? ' unavailable' : ''}`} key={tile.id}>
            <audio
              ref={(el) => (audioRefs.current[tile.id] = el)}
              src={tile.src}
              loop
              preload="none"
              onError={() => {
                setUnavailable((prev) => ({ ...prev, [tile.id]: true }));
                updatePlaying({ ...playingRef.current, [tile.id]: false });
                setBusyTiles((prev) => ({ ...prev, [tile.id]: false }));
              }}
            />
            <button
              type="button"
              className="sound-tile-toggle"
              onClick={() => toggleTile(tile)}
              aria-pressed={!!playing[tile.id]}
              aria-label={`${playing[tile.id] ? 'Pause' : 'Play'} ${tile.label}`}
              disabled={!!busyTiles[tile.id]}
            >
              {thumb ? (
                <ThemedImage
                  src={thumb.src}
                  alt=""
                  width={64}
                  height={64}
                  sizes="64px"
                  className="sound-tile-thumb"
                  overlay={false}
                />
              ) : (
                <Icon name={tile.icon} size={20} />
              )}
              <span>{tile.label}</span>
            </button>
            <span className={`sound-unavailable-message${playing[tile.id] ? ' is-playing' : ''}`} role="status" aria-live="polite">
              {unavailable[tile.id] ? 'Audio unavailable' : playing[tile.id] ? 'Playing' : ''}
            </span>
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
              aria-pressed={sleepMinutes === minutes}
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
        {sleepNotice && <span className="sleep-timer-notice" role="status">{sleepNotice}</span>}
      </div>
    </section>
  );
};

export default SoundMixer;
