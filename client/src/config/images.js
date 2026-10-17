import journalingPhoto from '../assets/images/photos/journaling.jpg';
import coffeeBooks from '../assets/images/illustrations/coffee-books.png';
import handsHeart from '../assets/images/illustrations/hands-heart.png';
import openJournal from '../assets/images/illustrations/open-journal.png';
import leafBranch from '../assets/images/illustrations/leaf-branch.png';
import sunsetHills from '../assets/images/illustrations/sunset-hills.png';
import progressNote from '../assets/images/illustrations/progress-note.png';
import sunsetHillsWide from '../assets/images/illustrations/sunset-hills-wide.jpg';
import handwrittenNote from '../assets/images/illustrations/handwritten-note.jpg';
import speechBubbles from '../assets/images/illustrations/speech-bubbles.jpg';
import signpost from '../assets/images/illustrations/signpost.jpg';
import handsHeartFlat from '../assets/images/illustrations/hands-heart-flat.jpg';
import rainArtwork from '../assets/images/sounds/rain.svg';
import forestArtwork from '../assets/images/sounds/forest.svg';
import cafeArtwork from '../assets/images/sounds/cafe.svg';
import pianoArtwork from '../assets/images/sounds/piano.svg';
import oceanArtwork from '../assets/images/sounds/ocean.svg';

// The project author supplied this illustration set.
const PROVIDED_CREDIT = { source: 'Provided by the project author' };
const credited = (src, alt = '') => ({ src, alt, credit: PROVIDED_CREDIT });

// Verified, free-to-use Unsplash photo (not from the provided illustration
// set) — swapped in for the homepage hero specifically to pull back on the
// plant-heavy imagery used elsewhere, per direct feedback.
const UNSPLASH_JOURNALING_CREDIT = {
  photographer: 'Timothy L Brock',
  source: 'Unsplash',
  url: 'https://unsplash.com/photos/_r6X-xFcASk',
};

export const IMAGES = {
  landingHero: {
    src: journalingPhoto,
    alt: 'A hand writing in an open journal at a wooden table',
    credit: UNSPLASH_JOURNALING_CREDIT,
  },
  inspirationHero: credited(coffeeBooks, 'A warm drink and books in a quiet reading space'),
  calmCornerHero: credited(sunsetHillsWide, 'Soft hills at sunset'),
  counselorsHero: credited(handsHeart, 'Hands holding a heart as a symbol of care'),
  notFound: credited(signpost, 'A signpost pointing toward the way forward'),
  crisisResourcesHero: credited(handsHeartFlat, 'Hands offering a heart in support'),
  healingReadsCovers: {
    'progress-not-loud': credited(progressNote, 'A note about progress over perfection'),
    'case-for-rest': credited(sunsetHills, 'A quiet sunrise over layered hills'),
    'gentle-gratitude': credited(openJournal, 'An open journal ready for reflection'),
    'no-words': credited(speechBubbles, 'Two simple conversation bubbles'),
    'five-minute-reset': credited(leafBranch, 'A sprig of leaves representing attention to the senses'),
    'not-a-burden': credited(handwrittenNote, 'A gentle handwritten message'),
  },
  calmCornerTiles: {
    rain: credited(rainArtwork),
    ocean: credited(oceanArtwork, 'A hand-drawn shoreline with gentle waves'),
    forest: credited(forestArtwork),
    cafe: credited(cafeArtwork),
    piano: credited(pianoArtwork),
  },
};

export default IMAGES;
