// Ambient sound tiles. Each `src` points at a file that must exist in
// client/public/audio/ — see that folder's README.md for CC0/royalty-free
// sources to download. The UI works fully without the files present; a
// missing file just means that tile silently doesn't produce sound yet.
export const SOUND_TILES = [
  { id: 'rain', label: 'Rain', icon: 'cloud', src: '/audio/rain.mp3' },
  { id: 'ocean', label: 'Ocean', icon: 'wave', src: '/audio/ocean.mp3' },
  { id: 'forest', label: 'Forest', icon: 'leaf', src: '/audio/forest.mp3' },
  { id: 'cafe', label: 'Café', icon: 'avatar-nest', src: '/audio/cafe.mp3' },
  { id: 'piano', label: 'Soft piano', icon: 'avatar-breath', src: '/audio/piano.mp3' },
];

export const SLEEP_TIMER_OPTIONS = [15, 30, 60];

// Guided meditations, embedded via youtube-nocookie.com. Only `headspace`
// below has been verified (title + embeddability checked via YouTube's
// oEmbed endpoint) — the rest are TODO: pick real videos and verify the
// same way before publishing, rather than guessing IDs.
export const MEDITATION_VIDEOS = [
  {
    id: 'headspace',
    title: 'Training the Monkey Mind',
    channel: 'Headspace',
    youtubeId: 'qxyVCjp48S4',
  },
  // TODO: 2-4 more verified videos, e.g. a body scan, a short sleep
  // meditation, a loving-kindness practice.
];

export const GROUNDING_STEPS = [
  { count: 5, sense: 'see', prompt: 'Name 5 things you can see around you right now.' },
  { count: 4, sense: 'touch', prompt: 'Name 4 things you can feel the texture of.' },
  { count: 3, sense: 'hear', prompt: 'Name 3 things you can hear.' },
  { count: 2, sense: 'smell', prompt: 'Name 2 things you can smell.' },
  { count: 1, sense: 'taste', prompt: 'Name 1 thing you can taste.' },
];
