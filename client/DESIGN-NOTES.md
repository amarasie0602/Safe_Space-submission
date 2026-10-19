# SafeSpace interface redesign

The existing `/` route remains the community entry point. Its composition now
starts with an full-scene sunlit-leaves video and an unobstructed headline, followed by three open paths into the product, the live community
feed with a compact sidebar, and a closing invitation. Registration and post
creation use the existing authentication and routing behavior.

## Implementation

- `src/components/home/WelcomeHero.jsx`: responsive background video, real navigation actions, and static reduced-motion rendering.
- `src/components/home/IntroStory.jsx`: semantic list of three paths with links;
  no media player, heavy animation runtime, or playback controls.
- `src/styles/editorial.css`: shared palette, typography, spacing, form controls,
  light/dark states, and page compositions. Imported after the existing stylesheet
  to retain compatibility with specialized tools, dashboards, and legacy screens.
- `AuthCard`: desktop photographic panel and focused single-column mobile form.
- `Layout`: scroll reveals limited to selected editorial sections instead of
  every feed item, card, and form.
- Sidebar counts and topic filters still use the actual API. No fabricated
  statistics, testimonials, or production content were added.

The hero now uses the user's selected six-second Pinterest journaling animation.
The loop fills the entire hero on desktop and mobile, with a crop that favors
the writing scene and a contrast overlay. There is no separate media panel
or blurred extension. The local MP4 is
approximately 507 KiB. Source details are in public/media/CREDITS.md.
It is muted, loops inline without native player controls, and pauses while hidden
or offscreen. A small text-only pause/resume control supports motion sensitivity.
Reduced motion renders the still without downloading the video; loading or
autoplay failures retain the same poster. No dependencies were added.

## Verification

- Production build passes.
- Eight existing unit tests pass.
- Thirteen Playwright tests pass, including keyboard navigation, login error alerts,
  reduced motion, hero actions, topic filtering, and drawer closure on resize.
- Fifteen public routes checked at 1440, 768, 390, and 320 pixels: no horizontal
  overflow or page errors observed. These include community pages, authentication,
  public information, support resources, and counselor login.
- Signed-in navbar sizing checked at 1440, 1024, 960, 390, and 320 pixels.
- Light and dark homepages, desktop authentication, and representative community
  pages inspected in Chromium. Saved previews are in `screenshots/redesign-*`.
- Lint has no errors and eight pre-existing Fast Refresh warnings.

These are local production-preview checks, not deployed Lighthouse measurements.
Authenticated profile/admin workflows and real screen-reader operation have not
been newly end-to-end verified by this redesign pass. The manual assistive
technology checklist in README.md still applies.

## Immersive homepage navigation

The home scene fills at least the viewport and extends behind a fixed transparent
navbar. After 48 pixels of scrolling the navbar gains the normal solid theme
background; returning to the top restores transparency. Other routes use solid
navigation. The support strip follows the hero, with a visible urgent-support
link kept in the first viewport. The existing MP4 remains the background loop;
no player runtime or new dependency is needed. Browser coverage includes both
navigation states and return-to-top behavior.
