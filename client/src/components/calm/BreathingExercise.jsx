import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

const PATTERNS = {
  box: {
    label: 'Box breathing (4-4-4-4)',
    phases: [
      { name: 'inhale', seconds: 4, cue: 'Breathe in', scale: 1 },
      { name: 'hold1', seconds: 4, cue: 'Hold', scale: 1 },
      { name: 'exhale', seconds: 4, cue: 'Breathe out', scale: 0.62 },
      { name: 'hold2', seconds: 4, cue: 'Hold', scale: 0.62 },
    ],
  },
  '478': {
    label: '4-7-8 breathing',
    phases: [
      { name: 'inhale', seconds: 4, cue: 'Breathe in', scale: 1 },
      { name: 'hold1', seconds: 7, cue: 'Hold', scale: 1 },
      { name: 'exhale', seconds: 8, cue: 'Breathe out', scale: 0.62 },
    ],
  },
};

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const BreathingExercise = () => {
  const [patternKey, setPatternKey] = useState('box');
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycles, setCycles] = useState(0);
  const timeoutRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const pattern = PATTERNS[patternKey];
  const phase = pattern.phases[phaseIndex];

  useEffect(() => {
    if (!running) return undefined;
    timeoutRef.current = setTimeout(() => {
      setPhaseIndex((prev) => {
        const next = (prev + 1) % pattern.phases.length;
        if (next === 0) setCycles((c) => c + 1);
        return next;
      });
    }, phase.seconds * 1000);
    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phaseIndex, patternKey]);

  const handlePatternChange = (key) => {
    setPatternKey(key);
    setPhaseIndex(0);
    setCycles(0);
    setRunning(false);
  };

  const handleStop = () => {
    setRunning(false);
    setPhaseIndex(0);
    setCycles(0);
  };

  return (
    <section className="calm-section" aria-labelledby="breathing-heading">
      <h2 id="breathing-heading">Breathing exercise</h2>
      <p className="text-muted">
        A slow, paced breath is one of the fastest ways to tell your nervous system it's safe to
        settle. Pick a pattern and follow the circle.
      </p>
      <div className="breathing-pattern-select" role="group" aria-label="Breathing pattern">
        {Object.entries(PATTERNS).map(([key, p]) => (
          <button
            key={key}
            type="button"
            className={`tab${patternKey === key ? ' active' : ''}`}
            onClick={() => handlePatternChange(key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="breathing-stage">
        <svg className="breathing-ring" width="160" height="160" viewBox="0 0 120 120" aria-hidden="true">
          <circle className="breathing-ring-track" cx="60" cy="60" r={RADIUS} />
          {running && (
            <circle
              key={phaseIndex}
              className="breathing-ring-progress"
              cx="60"
              cy="60"
              r={RADIUS}
              style={{
                strokeDasharray: CIRCUMFERENCE,
                animationDuration: `${phase.seconds}s`,
              }}
            />
          )}
        </svg>
        <motion.div
          className="breathing-circle"
          animate={{ scale: prefersReducedMotion ? 1 : phase.scale }}
          transition={{ duration: running ? phase.seconds : 0.4, ease: 'linear' }}
        />
        <div className="breathing-cue" aria-live="polite">
          <AnimatePresence mode="wait">
            {running ? (
              <motion.span
                key={phase.name + phaseIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {phase.cue}
              </motion.span>
            ) : (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Ready when you are
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="breathing-controls">
        {!running ? (
          <button type="button" className="btn btn-primary" onClick={() => setRunning(true)}>
            {cycles > 0 || phaseIndex > 0 ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button type="button" className="btn btn-ghost" onClick={() => setRunning(false)}>
            Pause
          </button>
        )}
        <button type="button" className="btn btn-ghost" onClick={handleStop}>
          Stop
        </button>
        <span className="text-muted breathing-cycle-count">{cycles} cycles completed</span>
      </div>
    </section>
  );
};

export default BreathingExercise;
