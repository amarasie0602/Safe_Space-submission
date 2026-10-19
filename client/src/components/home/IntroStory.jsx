import { Link } from 'react-router-dom';

const IntroStory = () => (
  <section className="intro-story home-start" aria-label="How SafeSpace works">
    <div className="home-start-note">
      <h2>Reading is a good place to start.</h2>
      <p>You can read without saying a word. When you feel ready, there is room for your story too.</p>
    </div>
    <ul className="home-start-links">
      <li><Link to="/posts/new">Write a post <span>Share anonymously</span><span aria-hidden="true">&#8599;</span></Link></li>
      <li><Link to="/threads">Browse conversations <span>Find something familiar</span><span aria-hidden="true">&#8599;</span></Link></li>
      <li><Link to="/calm">Take a breathing break <span>A few minutes for yourself</span><span aria-hidden="true">&#8599;</span></Link></li>
    </ul>
  </section>
);
export default IntroStory;
