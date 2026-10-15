// Shared Framer Motion presets so every transition in the app comes from
// one calm, restrained vocabulary instead of each component inventing its
// own easing/duration. Keep new motion additions here, not inline per file.

export const EASE_ENTER = [0.22, 1, 0.36, 1];
export const EASE_STATE = [0.4, 0, 0.2, 1];

export const DURATION = {
  hover: 0.18,
  component: 0.28,
  section: 0.45,
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.component, ease: EASE_STATE } },
  exit: { opacity: 0, transition: { duration: DURATION.hover, ease: EASE_STATE } },
};

export const fadeRise = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.section, ease: EASE_ENTER },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: DURATION.hover, ease: EASE_STATE },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.component, ease: EASE_ENTER },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: DURATION.hover, ease: EASE_STATE },
  },
};

// Apply to a parent; children should use fadeRise (or fadeIn) as their own
// variant so they inherit the stagger timing from this container.
export const staggerChildren = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

export const collapseExpand = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: 'auto', opacity: 1, transition: { duration: DURATION.component, ease: EASE_STATE } },
  exit: { height: 0, opacity: 0, transition: { duration: DURATION.hover, ease: EASE_STATE } },
};

// Reduced-motion variants: no movement/scale, just a plain opacity change
// (or nothing at all for purely decorative/ambient effects).
export const reducedFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.hover, ease: 'linear' } },
  exit: { opacity: 0, transition: { duration: DURATION.hover, ease: 'linear' } },
};

export const withReducedMotion = (variants, prefersReducedMotion) =>
  prefersReducedMotion ? reducedFade : variants;
