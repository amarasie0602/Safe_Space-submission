import { useState } from 'react';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

// Appends Unsplash's own format/quality/width params to a base CDN URL —
// keeps IMAGES config entries as bare photo URLs instead of duplicating
// query strings per placement.
const withParams = (src, params) => {
  const url = new URL(src);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return url.toString();
};

// A single, consistent way to render a themed photo: WebP + srcset, a
// required alt (empty string allowed for decorative images), explicit
// width/height to avoid layout shift, lazy by default, a theme-colour
// placeholder until it loads, a warm duotone overlay matching the palette
// (slightly darker in dark mode via CSS), and a fade-in that's skipped
// under prefers-reduced-motion.
const ThemedImage = ({ src, alt, width, height, sizes = '100vw', className = '', overlay = true, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  if (import.meta.env.DEV && alt === undefined) {
    // eslint-disable-next-line no-console
    console.warn('ThemedImage: `alt` is required (pass alt="" for a decorative image).');
  }

  if (!src) {
    return (
      <div
        className={`themed-image themed-image-empty ${className}`.trim()}
        style={{ aspectRatio: width && height ? `${width} / ${height}` : undefined }}
        aria-hidden="true"
      />
    );
  }

  const widths = [480, 768, 1200, 1600];
  const buildSrcSet = (format) =>
    widths.map((w) => `${withParams(src, { auto: 'format', fm: format, fit: 'crop', w, q: 70 })} ${w}w`).join(', ');

  return (
    <div
      className={`themed-image ${overlay ? 'themed-image-overlay' : ''} ${loaded ? 'is-loaded' : ''} ${className}`.trim()}
      style={{ aspectRatio: width && height ? `${width} / ${height}` : undefined }}
    >
      <picture>
        <source type="image/webp" srcSet={buildSrcSet('webp')} sizes={sizes} />
        <img
          src={withParams(src, { auto: 'format', fit: 'crop', w: width || 1200, q: 70 })}
          srcSet={buildSrcSet('jpg')}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          style={prefersReducedMotion ? undefined : { transition: 'opacity 0.4s ease' }}
          {...props}
        />
      </picture>
    </div>
  );
};

export default ThemedImage;
