import { useEffect, useState } from 'react';

// Tracks an arbitrary media query live (not just at mount), mirroring the
// usePrefersReducedMotion pattern so viewport-dependent UI stays correct
// across resizes and device rotation, not just on first render.
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    const handleChange = (event) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

export default useMediaQuery;
