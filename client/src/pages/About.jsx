import StaticPage from '../components/StaticPage';
import GrowthIllustration from '../components/GrowthIllustration';

const About = () => (
  <StaticPage title="About SafeSpace">
    <div className="static-page-illustration">
      <GrowthIllustration />
    </div>
    <p>
      SafeSpace is a peer support platform built so people can share what they're going through,
      including mental health, family, financial stress, relationships, and more, without giving
      up their privacy to do it.
    </p>
    <p>
      Posts and threads are pseudonymous by design. Verified counselors are available for those
      who want professional guidance, and every space is watched over by moderators who keep
      things safe and respectful.
    </p>
    <p>SafeSpace was built as a university project exploring what a genuinely trustworthy anonymous support community could look like.</p>

    <h2>Credits</h2>
    <p className="text-muted">Illustrations, audio, and video used across the app, with source.</p>
    <ul>
      <li>Illustrations (hero, sidebar, and resource artwork): provided by the project author.</li>
      <li>
        Calm Corner ambient sounds and guided meditation videos: sources and licences listed in{' '}
        <code>client/public/audio/README.md</code> once added.
      </li>
    </ul>
  </StaticPage>
);

export default About;
