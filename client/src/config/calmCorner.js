// Each ambient track is bundled locally; see public/audio/README.md for credits.
export const SOUND_TILES = [
  { id: 'rain', label: 'Rain', icon: 'cloud', src: '/audio/rain.mp3' },
  { id: 'ocean', label: 'Ocean', icon: 'wave', src: '/audio/ocean.mp3' },
  { id: 'forest', label: 'Forest', icon: 'leaf', src: '/audio/forest.mp3' },
  { id: 'cafe', label: 'Café', icon: 'avatar-nest', src: '/audio/cafe.mp3' },
  { id: 'piano', label: 'Soft piano', icon: 'avatar-breath', src: '/audio/piano.ogg' },
];

export const SLEEP_TIMER_OPTIONS = [15, 30, 60];

// Guided meditations use explicit video IDs and load only after a user selects
// a session. The public resource list is curated by SDSU Counseling &
// Psychological Services: https://sacd.sdsu.edu/cps/our-services-and-programs/everyday-mindfulness-and-meditation/guided-meditations-and-body-scans
export const MEDITATION_VIDEOS = [
  {
    id: 'headspace',
    title: 'Training the Monkey Mind',
    duration: 'Guided session',
    source: 'Headspace',
    youtubeId: 'qxyVCjp48S4',
  },
  {
    id: 'mindful-breathing',
    title: 'Mindful Breathing',
    duration: '9 minutes',
    source: 'UCLA Mindful Awareness',
    youtubeId: 'YFSc7Ck0Ao0',
  },
  {
    id: 'body-scan-short',
    title: 'Body Scan',
    duration: '5 minutes',
    source: 'Recommended by SDSU C&PS',
    youtubeId: 'EXneYUCddHE',
  },
  {
    id: 'body-scan-long',
    title: 'The Body Scan',
    duration: '10 minutes',
    source: 'Recommended by SDSU C&PS',
    youtubeId: 'zsCVqFr6j1g',
  },
  {
    id: 'peaceful-place',
    title: 'Peaceful Place',
    duration: 'Guided imagery',
    source: 'Recommended by SDSU C&PS',
    youtubeId: 'vhU5T6Bn_4s',
  },
];

export const GROUNDING_STEPS = [
  { count: 5, sense: 'see', prompt: 'Name 5 things you can see around you right now.' },
  { count: 4, sense: 'touch', prompt: 'Name 4 things you can feel the texture of.' },
  { count: 3, sense: 'hear', prompt: 'Name 3 things you can hear.' },
  { count: 2, sense: 'smell', prompt: 'Name 2 things you can smell.' },
  { count: 1, sense: 'taste', prompt: 'Name 1 thing you can taste.' },
];
