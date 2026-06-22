import React from 'react';
import WhoWeAre from '../components/WhoWeAre';
import OurStory from '../components/OurStory';
import ProcessImpact from '../components/ProcessImpact';
import OurMission from '../components/OurMission';
import ServiceCoverage from '../components/ServiceCoverage';
import FloodOperations from '../components/FloodOperations';
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
            <ServiceCoverage />
          </Reveal>
          
          <Reveal>
            <ProcessImpact />
          </Reveal>

          <Reveal delay={100}>
            <FloodOperations />
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
