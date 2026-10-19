import DailyAffirmation from '../DailyAffirmation';
import CommunityStatsCard from './CommunityStatsCard';
import PopularTopicsCard from './PopularTopicsCard';
import HelpfulResourcesCard from './HelpfulResourcesCard';
import CounselorPromptCard from './CounselorPromptCard';

const HomeSidebar = ({ onSelectCategory }) => (
  <aside className="home-sidebar" aria-label="Community sidebar">
    <PopularTopicsCard onSelectCategory={onSelectCategory} />
    <section className="sidebar-daily-note" aria-label="A note for today"><DailyAffirmation /></section>
    <HelpfulResourcesCard />
    <CounselorPromptCard />
    <CommunityStatsCard />
  </aside>
);

export default HomeSidebar;
