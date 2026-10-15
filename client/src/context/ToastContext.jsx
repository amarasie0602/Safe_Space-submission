import { createContext, useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

export const ToastContext = createContext(null);

const DEFAULT_DURATION = 3500;

const Toast = ({ toast, onDismiss, onPause, onResume, reduceMotion }) => (
  <motion.div
    layout
    role="status"
    className="toast"
    drag="x"
    dragConstraints={{ left: 0, right: 0 }}
    dragElastic={0.6}
    onDragEnd={(_, info) => {
      if (Math.abs(info.offset.x) > 80) onDismiss(toast.id);
    }}
    onMouseEnter={() => onPause(toast.id)}
    onMouseLeave={() => onResume(toast.id)}
    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
    animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
    transition={{ duration: reduceMotion ? 0.12 : 0.22, ease: [0.4, 0, 0.2, 1] }}
  >
    {toast.message}
    <span className="toast-progress-track" aria-hidden="true">
      <span
        className="toast-progress-fill"
        style={{
          animationDuration: `${toast.duration}ms`,
          animationPlayState: toast.paused ? 'paused' : 'running',
        }}
      />
    </span>
  </motion.div>
);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const prefersReducedMotion = usePrefersReducedMotion();

  const removeToast = useCallback((id) => {
    const entry = timers.current.get(id);
    if (entry) clearTimeout(entry.timer);
    timers.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, duration = DEFAULT_DURATION) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, duration, paused: false }]);
      timers.current.set(id, {
        timer: setTimeout(() => removeToast(id), duration),
        remaining: duration,
        startedAt: Date.now(),
      });
    },
    [removeToast]
  );

  const pauseToast = useCallback((id) => {
    const entry = timers.current.get(id);
    if (!entry) return;
    clearTimeout(entry.timer);
    entry.remaining = Math.max(entry.remaining - (Date.now() - entry.startedAt), 400);
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, paused: true } : t)));
  }, []);

  const resumeToast = useCallback(
    (id) => {
      const entry = timers.current.get(id);
      if (!entry) return;
      entry.startedAt = Date.now();
      entry.timer = setTimeout(() => removeToast(id), entry.remaining);
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, paused: false } : t)));
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              toast={toast}
              onDismiss={removeToast}
              onPause={pauseToast}
              onResume={resumeToast}
              reduceMotion={prefersReducedMotion}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
