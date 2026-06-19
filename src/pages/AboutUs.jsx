import React from 'react';
import WhoWeAre from '../components/WhoWeAre';
import OurStory from '../components/OurStory';
import ProcessImpact from '../components/ProcessImpact'; // Assuming you have this
import OurMission from '../components/OurMission'; // Assuming you have this
import Reveal from '../components/Reveal';
import PageWrapper from '../components/PageWrapper';

const AboutUs = () => {
  return (
    <PageWrapper>
      <main className="min-h-screen bg-slate-50/50">
        
        <div className="px-6 md:px-12 lg:px-24 pb-20">
          
          <Reveal>
            <WhoWeAre />
          </Reveal>
          
          <Reveal delay={200}>
            <OurStory />
          </Reveal>
          
          <Reveal>
            <ProcessImpact />
          </Reveal>
          
          <Reveal>
            <div className="rounded-[2.5rem] overflow-hidden mt-12 shadow-xl">
                <OurMission />
            </div>
          </Reveal>

        </div>

      </main>
    </PageWrapper>
  );
};

export default AboutUs;