import ThemedImage from '../components/ThemedImage';
import { IMAGES } from '../config/images';
import BreathingExercise from '../components/calm/BreathingExercise';
import SoundMixer from '../components/calm/SoundMixer';
import GuidedMeditation from '../components/calm/GuidedMeditation';
import GroundingExercise from '../components/calm/GroundingExercise';
import Icon from '../components/Icon';

const CalmCorner = () => (
  <div className="calm-corner">
    <div className="hero calm-hero">
      <div className="hero-text">
        <span className="calm-hero-kicker">Take a moment</span>
        <h1>Calm Corner</h1>
        <p>
          A few quiet ways to pause: follow a breathing rhythm, settle into a sound, or bring your
          attention back to the room.
        </p>
      </div>
      <div className="hero-photo">
        <ThemedImage
          src={IMAGES.calmCornerHero.src}
          alt=""
          width={374}
          height={220}
          sizes="(max-width: 860px) 100vw, 360px"
          overlay={false}
        />
      </div>
    </div>
    <nav className="calm-shortcuts" aria-label="Calm Corner activities">
      <a href="#breathing-section"><Icon name="wave" size={16} /> Breathing</a>
      <a href="#ambient-section"><Icon name="headphones" size={16} /> Ambient sounds</a>
      <a href="#meditation-section"><Icon name="sun" size={16} /> Meditation</a>
      <a href="#grounding-section"><Icon name="leaf" size={16} /> Grounding</a>
    </nav>
    <BreathingExercise />
    <SoundMixer />
    <GuidedMeditation />
    <GroundingExercise />
  </div>
);

export default CalmCorner;
