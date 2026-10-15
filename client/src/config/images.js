import heroWomanPlantsMug from '../assets/images/illustrations/hero-woman-plants-mug.png';
import leafBranch from '../assets/images/illustrations/leaf-branch.png';
import coffeeBooks from '../assets/images/illustrations/coffee-books.png';
import flowersVase from '../assets/images/illustrations/flowers-vase.png';
import handsHeart from '../assets/images/illustrations/hands-heart.png';
import openJournal from '../assets/images/illustrations/open-journal.png';
import sunsetHills from '../assets/images/illustrations/sunset-hills.png';

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

export const IMAGES = {
  landingHero: {
    src: heroWomanPlantsMug,
    alt: '',
    credit: PROVIDED_CREDIT,
  },
  authSplit: {
    src: flowersVase,
    alt: '',
    credit: PROVIDED_CREDIT,
  },
  // Small thumbnails for the homepage sidebar's "You Might Find Helpful"
  // resource list.
  helpfulResources: {
    breathing: { src: leafBranch, alt: '', credit: PROVIDED_CREDIT },
    healingReads: { src: coffeeBooks, alt: '', credit: PROVIDED_CREDIT },
    crisisResources: { src: sunsetHills, alt: '', credit: PROVIDED_CREDIT },
  },
  counselorPrompt: { src: handsHeart, alt: '', credit: PROVIDED_CREDIT },
  inspirationHeader: { src: openJournal, alt: '', credit: PROVIDED_CREDIT },
  // TODO: one cover image per Healing Reads article (client/src/pages/Inspiration.jsx).
  healingReadsCovers: {},
  // TODO: one muted photo per Calm Corner sound tile (rain, ocean, forest, cafe, piano).
  calmCornerTiles: {},
};

export default IMAGES;
