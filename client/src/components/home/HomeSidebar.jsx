import CommunityStatsCard from './CommunityStatsCard';
import PopularTopicsCard from './PopularTopicsCard';
import HelpfulResourcesCard from './HelpfulResourcesCard';
import CounselorPromptCard from './CounselorPromptCard';

const HomeSidebar = ({ onSelectCategory }) => (
  <aside className="home-sidebar" aria-label="Community sidebar">
    <CommunityStatsCard />
    <PopularTopicsCard onSelectCategory={onSelectCategory} />
    <HelpfulResourcesCard />
    <CounselorPromptCard />
  </aside>
);

export default HomeSidebar;
