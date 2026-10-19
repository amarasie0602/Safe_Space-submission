import Icon from '../Icon';

const STEPS = [
  { icon: 'leaf', title: 'A little space to share', text: 'Share anonymously. No real name or email required.' },
  { icon: 'message', title: 'A moment of connection', text: 'Find people who understand, one conversation at a time.' },
  { icon: 'heart', title: 'Support for your next step', text: 'Explore verified counselors, calming tools, and helpful resources.' },
];

const IntroStory = () => (
  <section className="intro-story intro-journey" aria-label="How SafeSpace works">
    <div className="intro-journey-heading">
      <span className="intro-journey-eyebrow">YOUR SPACE TO BEGIN</span>
      <h2>Small steps. A little more together.</h2>
      <p>Come as you are. Take what you need.</p>
    </div>
    <ol className="intro-journey-steps">
      {STEPS.map((step, index) => (
        <li key={step.title} style={{ '--step': index }}>
          <span className="intro-journey-icon" aria-hidden="true"><Icon name={step.icon} size={24} /></span>
          <span className="intro-journey-number" aria-hidden="true">0{index + 1}</span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </li>
      ))}
    </ol>
  </section>
);

export default IntroStory;
