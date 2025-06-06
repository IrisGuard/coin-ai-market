
import FeatureSectionHeader from './features/FeatureSectionHeader';
import FeatureGrid from './features/FeatureGrid';
import StatsSection from './features/StatsSection';

const FeatureSection = () => {
  return (
    <div className="section-spacing bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto container-padding relative z-10">
        <FeatureSectionHeader />
        <FeatureGrid />
        <StatsSection />
      </div>
    </div>
  );
};

export default FeatureSection;
