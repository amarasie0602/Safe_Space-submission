import Icon from './Icon';

const GRADIENTS = [
  ['#c8a27c', '#b97a56'],
  ['#a3b18a', '#8b6f5a'],
  ['#d6cfc7', '#c8a27c'],
  ['#8b6f5a', '#a3b18a'],
  ['#b97a56', '#d6cfc7'],
];

// Fixed set of placeholder avatars users pick from — never a real photo, so
// the pseudonymous identity model stays intact. Each mark carries real
// meaning for a healing/peer-support context (growth, calm, safety, hope)
// rather than being a generic reaction pictogram (star/heart/sun) or an
// abstract pattern with no meaning — this is the first thing a new user
// picks, and it should feel warm and intentional, not decorative.
export const AVATAR_PRESETS = [
  { icon: 'avatar-sprout', colors: GRADIENTS[0] }, // growth, new beginnings
  { icon: 'avatar-lotus', colors: GRADIENTS[1] }, // blooming, mindfulness
  { icon: 'avatar-embrace', colors: GRADIENTS[2] }, // support, being held
  { icon: 'avatar-anchor', colors: GRADIENTS[3] }, // grounding, safety
  { icon: 'avatar-feather', colors: GRADIENTS[4] }, // lightness, letting go
  { icon: 'avatar-mountain', colors: GRADIENTS[0] }, // strength, resilience
  { icon: 'avatar-nest', colors: GRADIENTS[1] }, // comfort, belonging
  { icon: 'avatar-horizon', colors: GRADIENTS[2] }, // hope, a new day
  { icon: 'avatar-breath', colors: GRADIENTS[3] }, // calm, mindful breathing
  { icon: 'avatar-droplet', colors: GRADIENTS[4] }, // release, renewal
];

const hashSeed = (seed) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % GRADIENTS.length;
  }
  return Math.abs(hash);
};

const AnonymousAvatar = ({ seed = '', avatarId, size }) => {
  const preset = typeof avatarId === 'number' ? AVATAR_PRESETS[avatarId] : null;
  const [from, to] = preset ? preset.colors : GRADIENTS[hashSeed(String(seed))];
  const style = { background: `linear-gradient(135deg, ${from}, ${to})` };
  if (size) {
    style.width = size;
    style.height = size;
  }

  return (
    <span className="anon-avatar" style={style} aria-hidden="true">
      {preset && <Icon name={preset.icon} size={size ? Math.round(size * 0.45) : 17} className="anon-avatar-icon" />}
    </span>
  );
};

export default AnonymousAvatar;
