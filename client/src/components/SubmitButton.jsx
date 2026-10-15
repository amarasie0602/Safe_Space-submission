import { AnimatePresence, motion } from 'framer-motion';

// status: 'idle' | 'saving' | 'success' | 'failed'. On success it shows a
// quiet stroke-drawn checkmark for a moment before the parent navigates
// away or resets state — failed/idle both fall back to the normal label.
const SubmitButton = ({ status = 'idle', idleLabel, savingLabel, className = '', ...props }) => {
  const isSaving = status === 'saving';
  const isSuccess = status === 'success';

  return (
    <button
      type="submit"
      className={`btn btn-primary submit-btn ${className}`.trim()}
      disabled={isSaving || isSuccess}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isSuccess ? (
          <motion.span
            key="success"
            className="submit-btn-check"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <motion.path
                d="M3 8.5L6.5 12L13 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
          </motion.span>
        ) : (
          <motion.span
            key="label"
            className="submit-btn-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {isSaving && <span className="submit-btn-spinner" aria-hidden="true" />}
            {isSaving ? savingLabel : idleLabel}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export default SubmitButton;
