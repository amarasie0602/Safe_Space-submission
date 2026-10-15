import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';
import { GROUNDING_STEPS } from '../../config/calmCorner';

const GroundingExercise = () => {
  const [stepIndex, setStepIndex] = useState(-1); // -1 = not started
  const prefersReducedMotion = usePrefersReducedMotion();
  const started = stepIndex >= 0;
  const finished = stepIndex >= GROUNDING_STEPS.length;
  const step = started && !finished ? GROUNDING_STEPS[stepIndex] : null;

  const variants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { opacity: 0, x: 16 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, x: -16, transition: { duration: 0.2 } },
      };

  const restart = () => setStepIndex(-1);

  return (
    <section className="calm-section" aria-labelledby="grounding-heading">
      <h2 id="grounding-heading">5-4-3-2-1 grounding</h2>
      <p className="text-muted">
        A gentle way to come back into the room when things feel like too much. One sense at a
        time.
      </p>

      <div className="grounding-stage">
        <AnimatePresence mode="wait">
          {!started && (
            <motion.div key="intro" variants={variants} initial="hidden" animate="visible" exit="exit">
              <p>Find a comfortable position. When you're ready, we'll go through it together.</p>
              <button type="button" className="btn btn-primary" onClick={() => setStepIndex(0)}>
                Begin
              </button>
            </motion.div>
          )}
          {step && (
            <motion.div key={stepIndex} variants={variants} initial="hidden" animate="visible" exit="exit">
              <span className="grounding-step-count">{step.count}</span>
              <p className="grounding-step-prompt">{step.prompt}</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStepIndex((prev) => prev + 1)}
              >
                {stepIndex === GROUNDING_STEPS.length - 1 ? 'Finish' : 'Next'}
              </button>
            </motion.div>
          )}
          {finished && (
            <motion.div key="done" variants={variants} initial="hidden" animate="visible" exit="exit">
              <p>You're here, now. Take one more breath before you go.</p>
              <button type="button" className="btn btn-ghost" onClick={restart}>
                Do it again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default GroundingExercise;
