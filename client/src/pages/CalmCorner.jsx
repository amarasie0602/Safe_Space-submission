import ThemedImage from '../components/ThemedImage';
import { IMAGES } from '../config/images';
import BreathingExercise from '../components/calm/BreathingExercise';
import SoundMixer from '../components/calm/SoundMixer';
import GuidedMeditation from '../components/calm/GuidedMeditation';
import GroundingExercise from '../components/calm/GroundingExercise';

const CalmCorner = () => (
  <div className="calm-corner">
    <div className="hero">
      <div className="hero-text">
        <h1>Calm Corner</h1>
        <p>
          Breathing, grounding, meditation, and ambient sound tools. Start wherever feels comfortable.
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
    <BreathingExercise />
    <SoundMixer />
    <GuidedMeditation />
    <GroundingExercise />
  </div>
);

export default CalmCorner;
