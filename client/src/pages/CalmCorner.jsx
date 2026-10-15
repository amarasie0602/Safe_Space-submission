import BreathingExercise from '../components/calm/BreathingExercise';
import SoundMixer from '../components/calm/SoundMixer';
import GuidedMeditation from '../components/calm/GuidedMeditation';
import GroundingExercise from '../components/calm/GroundingExercise';

const CalmCorner = () => (
  <div className="calm-corner">
    <div className="page-header">
      <h1>Calm Corner</h1>
    </div>
    <p className="text-muted calm-corner-intro">
      A quiet space to pause, breathe, and come back to yourself — whether that's two minutes or
      twenty.
    </p>
    <BreathingExercise />
    <SoundMixer />
    <GuidedMeditation />
    <GroundingExercise />
  </div>
);

export default CalmCorner;
