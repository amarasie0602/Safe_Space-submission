import heroWomanPlantsMug from '../assets/images/illustrations/hero-woman-plants-mug.png';
import leafBranch from '../assets/images/illustrations/leaf-branch.png';
import coffeeBooks from '../assets/images/illustrations/coffee-books.png';
import flowersVase from '../assets/images/illustrations/flowers-vase.png';
import handsHeart from '../assets/images/illustrations/hands-heart.png';
import openJournal from '../assets/images/illustrations/open-journal.png';
import sunsetHills from '../assets/images/illustrations/sunset-hills.png';
import affirmationDaisy from '../assets/images/illustrations/affirmation-daisy.png';
import progressNote from '../assets/images/illustrations/progress-note.png';

// Central place for every image used across the app, so swapping one (or
// the whole set) means editing one file. Each entry keeps its credit
// alongside the asset so the About page's Credits section can be generated
// from this file directly.
//
// The illustration set (hero, sidebar thumbnails, etc.) was supplied
// directly by the project author rather than sourced from a stock library —
// credited as "Provided by the project author" rather than a fabricated
// stock-photographer attribution, which would be dishonest.
const PROVIDED_CREDIT = { source: 'Provided by the project author' };
const credited = (src) => ({ src, alt: '', credit: PROVIDED_CREDIT });

export const IMAGES = {
  landingHero: credited(heroWomanPlantsMug),
  authSplit: credited(flowersVase),
  // Small thumbnails for the homepage sidebar's "You Might Find Helpful"
  // resource list.
  helpfulResources: {
    breathing: credited(leafBranch),
    healingReads: credited(coffeeBooks),
    crisisResources: credited(sunsetHills),
  },
  counselorPrompt: credited(handsHeart),
  threadsHero: credited(flowersVase),
  calmCornerHero: credited(sunsetHills),
  counselorsHero: credited(leafBranch),
  // Healing Reads: a hero (the one asset with its own baked-in affirmation
  // text — fits here since this page's content doesn't rotate like the
  // homepage's dynamic AffirmationCard does) plus one cover per article,
  // cycling through the rest of the set since there are more articles than
  // spare illustrations.
  inspirationHero: credited(affirmationDaisy),
  healingReadsCovers: {
    'progress-not-loud': credited(progressNote),
    'case-for-rest': credited(sunsetHills),
    'gentle-gratitude': credited(flowersVase),
    'no-words': credited(coffeeBooks),
    'five-minute-reset': credited(leafBranch),
    'not-a-burden': credited(openJournal),
  },
  // TODO: one muted photo per Calm Corner sound tile (rain, ocean, forest, cafe, piano).
  calmCornerTiles: {},
};

export default IMAGES;
