import { AbsoluteFill, Sequence, useCurrentFrame, Easing, interpolate, Interactive } from 'remotion';

// A short, calm "how it works" sequence for the homepage — genuinely a
// Remotion composition (uses its frame/interpolate/Easing primitives),
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

// Per Remotion's React Markup best practices, animations are expressed as
// single inline interpolate() calls on the frame directly, using Easing
// (rather than an imperative spring() feeding a second interpolate()) and
// scale/translate/rotate properties (rather than a transform string) —
// this keeps every keyframe standardized and, if this project ever opens
// Remotion Studio, editable there.
const Beat = ({ label, sub }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: '0 8%' }}>
      <Interactive.Div
        name="Beat text"
        style={{
          textAlign: 'center',
          opacity: interpolate(frame, [0, 15, BEAT_FRAMES - 18, BEAT_FRAMES], [0, 1, 1, 0], {
            easing: [Easing.spring({ damping: 200 }), Easing.linear, Easing.linear],
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          translate: interpolate(frame, [0, 15], ['0px 10px', '0px 0px'], {
            easing: Easing.spring({ damping: 200 }),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <Interactive.H3
          name="Beat headline"
          style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 34, margin: '0 0 10px', color: '#3e2f26' }}
        >
          {label}
        </Interactive.H3>
        <Interactive.P
          name="Beat subtext"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#7a6f66', margin: 0 }}
        >
          {sub}
        </Interactive.P>
      </Interactive.Div>
    </AbsoluteFill>
  );
};

export const IntroComposition = () => (
  <AbsoluteFill aria-hidden="true" style={{ background: 'linear-gradient(135deg, #f5efe6, #e3d6c8)' }}>
    {BEATS.map((beat, i) => (
      <Sequence key={beat.label} from={i * BEAT_FRAMES} durationInFrames={BEAT_FRAMES}>
        <Beat {...beat} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const INTRO_DURATION_FRAMES = BEATS.length * BEAT_FRAMES;
export const INTRO_FPS = 30;
