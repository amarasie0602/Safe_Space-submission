import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

// A short, calm "how it works" sequence for the homepage — genuinely a
// Remotion composition (uses its frame/interpolate/spring primitives),
// rendered live in the browser via @remotion/player rather than exported
// to a video file, since that avoids needing a headless-Chromium render
// pipeline for something this app doesn't otherwise require. Three beats,
// ~2.5s each, soft crossfades, resting on the last frame rather than
// looping forever — motion with a stopping point, not an ambient loop
// someone has to consciously ignore.
const BEATS = [
  { label: 'Share anonymously', sub: 'No real name, no email. Just a nickname.' },
  { label: 'Connect with people who understand', sub: 'Peer support, threaded discussions, real replies.' },
  { label: 'Find real support when you need it', sub: 'Verified counselors, Calm Corner tools, crisis resources.' },
];

const BEAT_FRAMES = 75; // 2.5s at 30fps

const Beat = ({ label, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [BEAT_FRAMES - 18, BEAT_FRAMES], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = Math.min(enter, fadeOut);
  const y = interpolate(enter, [0, 1], [10, 0]);

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: '0 8%' }}>
      <div style={{ opacity, transform: `translateY(${y}px)`, textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 34, margin: '0 0 10px', color: '#3e2f26' }}>
          {label}
        </h3>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#7a6f66', margin: 0 }}>{sub}</p>
      </div>
    </AbsoluteFill>
  );
};

export const IntroComposition = () => (
  <AbsoluteFill style={{ background: 'linear-gradient(135deg, #f5efe6, #e3d6c8)' }}>
    {BEATS.map((beat, i) => (
      <Sequence key={beat.label} from={i * BEAT_FRAMES} durationInFrames={BEAT_FRAMES}>
        <Beat {...beat} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const INTRO_DURATION_FRAMES = BEATS.length * BEAT_FRAMES;
export const INTRO_FPS = 30;
