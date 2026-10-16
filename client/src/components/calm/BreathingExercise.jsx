import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const PATTERNS = {
  box: {
    label: 'Box breathing · 4 seconds each',
    phases: [
      { name: 'inhale', seconds: 4, cue: 'Breathe in' },
      { name: 'hold1', seconds: 4, cue: 'Hold gently' },
      { name: 'exhale', seconds: 4, cue: 'Breathe out' },
      { name: 'hold2', seconds: 4, cue: 'Rest' },
    ],
  },
  '478': {
    label: '4–7–8 breathing',
    phases: [
      { name: 'inhale', seconds: 4, cue: 'Breathe in' },
      { name: 'hold1', seconds: 7, cue: 'Hold gently' },
      { name: 'exhale', seconds: 8, cue: 'Breathe out' },
    ],
  },
};

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const BreathingExercise = () => {
  const [patternKey, setPatternKey] = useState('box');
  const [running, setRunning] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [remainingMs, setRemainingMs] = useState(null);
  const phaseStartedAtRef = useRef(null);

  const pattern = PATTERNS[patternKey];
  const phase = pattern.phases[phaseIndex];

  useEffect(() => {
    if (!running) return undefined;

    const duration = remainingMs ?? phase.seconds * 1000;
    phaseStartedAtRef.current = performance.now();
    const timeout = window.setTimeout(() => {
      const next = (phaseIndex + 1) % pattern.phases.length;
      if (next === 0) setCycles((count) => count + 1);
      setPhaseIndex(next);
      setRemainingMs(null);
    }, duration);

    return () => window.clearTimeout(timeout);
  }, [phase.seconds, pattern.phases.length, phaseIndex, remainingMs, running]);

  useEffect(() => {
    if (!running) return undefined;
    const pauseWhenHidden = () => {
      if (document.visibilityState !== 'hidden') return;
      const phaseDuration = remainingMs ?? phase.seconds * 1000;
      const elapsed = phaseStartedAtRef.current
        ? performance.now() - phaseStartedAtRef.current
        : 0;
      setRemainingMs(Math.max(0, phaseDuration - elapsed));
      setRunning(false);
    };
    document.addEventListener('visibilitychange', pauseWhenHidden);
    return () => document.removeEventListener('visibilitychange', pauseWhenHidden);
  }, [phase.seconds, remainingMs, running]);

  const handleStartPause = () => {
    if (running) {
      const phaseDuration = remainingMs ?? phase.seconds * 1000;
      const elapsed = phaseStartedAtRef.current
        ? performance.now() - phaseStartedAtRef.current
        : 0;
      setRemainingMs(Math.max(0, phaseDuration - elapsed));
      setRunning(false);
      return;
    }
    setSessionActive(true);
    setRunning(true);
  };

  const handlePatternChange = (key) => {
    setPatternKey(key);
    setPhaseIndex(0);
    setCycles(0);
    setRemainingMs(null);
    setSessionActive(false);
    setRunning(false);
  };

  const handleStop = () => {
    setRunning(false);
    setSessionActive(false);
    setPhaseIndex(0);
    setCycles(0);
    setRemainingMs(null);
  };

  return (
    <section className="calm-section" id="breathing-section" aria-labelledby="breathing-heading">
      <div className="calm-section-heading">
        <div>
          <span className="calm-section-kicker">01 · Follow a rhythm</span>
          <h2 id="breathing-heading">Breathing exercise</h2>
        </div>
        <span className="calm-section-mark" aria-hidden="true">01</span>
      </div>
      <p className="text-muted">
        Choose a pace that feels comfortable. You can pause or stop whenever you like.
      </p>

      <div className="breathing-pattern-select" role="group" aria-label="Breathing pattern">
        {Object.entries(PATTERNS).map(([key, item]) => (
          <button
            key={key}
            type="button"
            className={`tab${patternKey === key ? ' active' : ''}`}
            onClick={() => handlePatternChange(key)}
            aria-pressed={patternKey === key}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="breathing-stage" data-running={running}>
        <svg className="breathing-ring" width="160" height="160" viewBox="0 0 120 120" aria-hidden="true">
          <circle className="breathing-ring-track" cx="60" cy="60" r={RADIUS} />
          {sessionActive && (
            <circle
              key={`${patternKey}-${phaseIndex}`}
              className="breathing-ring-progress"
              cx="60"
              cy="60"
              r={RADIUS}
              style={{
                strokeDasharray: CIRCUMFERENCE,
                '--breathing-circumference': CIRCUMFERENCE,
                animationDuration: `${phase.seconds}s`,
                animationPlayState: running ? 'running' : 'paused',
              }}
            />
          )}
        </svg>
        <div
          className={`breathing-circle${sessionActive ? ' is-active' : ''}`}
          data-phase={phase.name}
          style={{
            '--breathing-duration': `${phase.seconds}s`,
            animationPlayState: running ? 'running' : 'paused',
          }}
          aria-hidden="true"
        />
        <div className="breathing-cue" aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait">
            {running ? (
              <motion.span
                key={`${phase.name}-${phaseIndex}`}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.22 }}
              >
                {phase.cue}
              </motion.span>
            ) : (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {sessionActive ? 'Paused' : 'Ready when you are'}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="breathing-controls">
        <button type="button" className="btn btn-primary" onClick={handleStartPause}>
          {running ? 'Pause' : sessionActive ? 'Resume' : 'Begin'}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={handleStop}
          disabled={!sessionActive && cycles === 0}
        >
          Reset
        </button>
        <span className="text-muted breathing-cycle-count" aria-live="polite">
          {cycles} {cycles === 1 ? 'cycle' : 'cycles'} completed
        </span>
      </div>
    </section>
  );
};

export default BreathingExercise;
