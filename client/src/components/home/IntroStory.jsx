import { Link } from 'react-router-dom';

const STEPS = [
  { title: 'Let it out.', text: 'Share anonymously, without finding the perfect words.', to: '/posts/new', action: 'Make room for your thoughts' },
  { title: 'Find your people.', text: 'Conversations that remind you you’re not the only one.', to: '/threads', action: 'Join a conversation' },
  { title: 'Take a breath.', text: 'A quiet moment, a helpful read, a little support.', to: '/calm', action: 'Find a moment of calm' },
];

const IntroStory = () => (
  <section className="intro-story intro-journey" aria-label="How SafeSpace works">
    <div className="intro-journey-heading"><span className="eyebrow">HOWEVER YOU FEEL TODAY</span><h2>A place to start.</h2></div>
    <ol className="intro-journey-steps">
      {STEPS.map((step, index) => (
        <li key={step.title} style={{ '--step': index }}>
          <span className="intro-journey-number" aria-hidden="true">0{index + 1}</span>
          <h3>{step.title}</h3><p>{step.text}</p>
          <Link to={step.to} className="text-link">{step.action} <span aria-hidden="true">&#8599;</span></Link>
        </li>
      ))}
    </ol>
  </section>
);
export default IntroStory;
