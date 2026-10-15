import StaticPage from '../components/StaticPage';
import ThemedImage from '../components/ThemedImage';
import { IMAGES } from '../config/images';

const CrisisResources = () => (
  <StaticPage title="Crisis Resources">
    <div className="static-page-illustration">
      <ThemedImage
        src={IMAGES.crisisResourcesHero.src}
        alt=""
        width={274}
        height={220}
        sizes="140px"
        overlay={false}
        className="static-page-image"
      />
    </div>
    <p>
      If you're in immediate danger, please contact your local emergency service right away.
      Below are additional resources if you need someone to talk to right now.
    </p>
    <h2>Sri Lanka</h2>
    <ul>
      <li>Police emergency — 119</li>
      <li>Suwa Seriya ambulance service — 1990</li>
      <li>1926 National Mental Health Helpline (NIMH) — call 1926, 24/7</li>
      <li>1333 CCCline — 24/7 toll-free crisis support in Sinhala, Tamil, and English</li>
      <li>Sri Lanka Sumithrayo — free, confidential emotional support: 0707 308 308 or 0767 520 620</li>
      <li>1929 Child Helpline — National Child Protection Authority, 24/7</li>
      <li>1938 Women's Helpline — Ministry of Women and Child Affairs</li>
    </ul>
    <h2>United States</h2>
    <ul>
      <li>988 Suicide &amp; Crisis Lifeline — call or text 988</li>
      <li>Crisis Text Line — text HOME to 741741</li>
    </ul>
    <h2>International</h2>
    <ul>
      <li>Find a helpline in your country at findahelpline.com</li>
    </ul>
    <p>
      SafeSpace's peer community and counselors are here for ongoing support, but they are not a
      substitute for emergency care in a crisis.
    </p>
  </StaticPage>
);

export default CrisisResources;
