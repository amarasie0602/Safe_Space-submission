// Central place for every photo URL used across the app, so swapping an
// image (or the whole set, e.g. for a different license) means editing one
// file. Each entry keeps its license/attribution alongside the URL so the
// About page's Credits section can be generated from this file directly.
//
// `src` is an Unsplash CDN URL; append Unsplash's own query params (w, q,
// auto=format) per placement rather than baking a fixed size in here.
//
// TODO (manual follow-up): the entries marked `TODO` are unfilled —
// ThemedImage renders its placeholder/empty state for these until a real
// photo URL + credit is added here.
export const IMAGES = {
  landingHero: {
    src: 'https://images.unsplash.com/photo-1595425504122-ed7894db7711',
    alt: '',
    credit: { photographer: 'Giulia Bertelli', source: 'Unsplash', url: 'https://unsplash.com/photos/2-xbLgZDT_g' },
  },
  authSplit: {
    src: 'https://images.unsplash.com/photo-1762539683985-de22c1e2358f',
    alt: '',
    credit: { photographer: 'Bob Jenkin', source: 'Unsplash', url: 'https://unsplash.com/photos/2ZSWAKRB2ok' },
  },
  // TODO: one cover image per Healing Reads article (client/src/pages/Inspiration.jsx).
  healingReadsCovers: {},
  // TODO: one muted photo per Calm Corner sound tile (rain, ocean, forest, cafe, piano).
  calmCornerTiles: {},
};

export default IMAGES;
