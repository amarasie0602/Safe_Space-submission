import { Link } from 'react-router-dom';
import StaticPage from '../components/StaticPage';

const Contact = () => (
  <StaticPage title="Help & contact">
    <p>Find the right next step for a community concern, an account question, or urgent support.</p>
    <h2>Report a community concern</h2>
    <p>Open the options menu on a post and choose Report. Include a brief explanation so the moderation team can review the concern in context.</p>
    <div className="contact-route"><Link to="/guidelines">Read the community guidelines &rarr;</Link></div>
    <h2>Get back into your account</h2>
    <p>If you cannot log in, use your nickname and the recovery code you saved when you joined. SafeSpace does not collect an email address for member accounts.</p>
    <div className="contact-route"><Link to="/forgot-password">Recover your account &rarr;</Link></div>
    <h2>Find immediate support</h2>
    <p>If you are in immediate danger, contact your local emergency service. Community reports are not an emergency response service.</p>
    <div className="contact-route"><Link to="/crisis-resources">View support resources &rarr;</Link></div>
  </StaticPage>
);
export default Contact;
