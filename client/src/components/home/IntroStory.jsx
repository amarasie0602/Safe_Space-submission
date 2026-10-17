import { Player } from '@remotion/player';
import { IntroComposition, INTRO_DURATION_FRAMES, INTRO_FPS } from '../../remotion/IntroComposition';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';
import useMediaQuery from '../../hooks/useMediaQuery';

const STATIC_BEATS = [
  'Share anonymously, no real name or email required.',
  'Connect with people who understand through threaded peer discussions.',
  'Find real support: verified counselors, Calm Corner tools, and crisis resources.',
];

// Reduced-motion visitors get the same three beats as plain, static text
// instead of the Remotion sequence — the information is never gated
// behind the animation playing. Narrow viewports get the same fallback:
// the Player scales its fixed 960x260 composition as one block (like a
// video), so on a ~350px-wide phone its 34px headline renders at roughly
// 12px, too small to read comfortably.
const IntroStory = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isNarrowViewport = useMediaQuery('(max-width: 640px)');

  if (prefersReducedMotion || isNarrowViewport) {
    return (
      <section className="intro-story intro-story-static" aria-label="How SafeSpace works">
        <ul>
          {STATIC_BEATS.map((beat) => (
            <li key={beat}>{beat}</li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="intro-story" aria-label="How SafeSpace works">
      <Player
        component={IntroComposition}
        durationInFrames={INTRO_DURATION_FRAMES}
        fps={INTRO_FPS}
        compositionWidth={960}
        compositionHeight={260}
        style={{ width: '100%', aspectRatio: '960 / 260', borderRadius: 'var(--radius-lg)' }}
        autoPlay
        muted
        loop={false}
        controls={false}
        clickToPlay={false}
        showPosterWhenPaused={false}
      />
    </section>
  );
};

export default IntroStory;
