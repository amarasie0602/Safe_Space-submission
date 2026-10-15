import { useEffect, useState } from 'react';

// Mirrors prefers-reduced-motion live (not just at mount) so toggling it in
// OS settings while the app is open takes effect immediately.
const usePrefersReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event) => setPrefersReduced(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReduced;
};

export default usePrefersReducedMotion;
