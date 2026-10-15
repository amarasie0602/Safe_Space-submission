import { useEffect, useState } from 'react';

// Only reports "loading" once the real loading state has been true for
// `delay`ms, so a fast response never shows a skeleton flash for a few
// frames — a well-known perceived-performance win.
const useDelayedLoading = (isLoading, delay = 300) => {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowLoading(false);
      return undefined;
    }
    const timer = setTimeout(() => setShowLoading(true), delay);
    return () => clearTimeout(timer);
  }, [isLoading, delay]);

  return showLoading;
};

export default useDelayedLoading;
