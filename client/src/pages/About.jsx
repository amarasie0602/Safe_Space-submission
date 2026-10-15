import StaticPage from '../components/StaticPage';
import GrowthIllustration from '../components/GrowthIllustration';
import { IMAGES } from '../config/images';

const allImageEntries = [
  IMAGES.landingHero,
  IMAGES.authSplit,
  ...Object.values(IMAGES.helpfulResources),
];
const imageCredits = Array.from(
  new Map(allImageEntries.filter((entry) => entry.credit).map((entry) => [entry.credit.url, entry])).values()
);

const About = () => (
  <StaticPage title="About SafeSpace">
    <div className="static-page-illustration">
      <GrowthIllustration />
    </div>
    <p>
      SafeSpace is a peer support platform built so people can share what they're going through —
      mental health, family, financial stress, relationships, and more — without giving up their
      privacy to do it.
    </p>
    <p>
      Posts and threads are pseudonymous by design. Verified counselors are available for those
      who want professional guidance, and every space is watched over by moderators who keep
      things safe and respectful.
    </p>
    <p>SafeSpace was built as a university project exploring what a genuinely trustworthy anonymous support community could look like.</p>

    <h2>Credits</h2>
    <p className="text-muted">Photography, audio, and video used across the app, with licence and source.</p>
    <ul>
      {imageCredits.map((entry) => (
        <li key={entry.credit.url}>
          Photo by{' '}
          <a href={entry.credit.url} target="_blank" rel="noopener noreferrer">
            {entry.credit.photographer}
          </a>{' '}
          on {entry.credit.source} — free to use under the Unsplash License.
        </li>
      ))}
      <li>
        Calm Corner ambient sounds and guided meditation videos: sources and licences listed in{' '}
        <code>client/public/audio/README.md</code> once added.
      </li>
    </ul>
  </StaticPage>
);

export default About;
