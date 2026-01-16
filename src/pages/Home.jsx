import React from 'react';
import Hero from '../components/Hero';
import BentoGrid from '../components/BentoGrid';
import WhatWeDo from '../components/WhatWeDo'; // Assuming this exists based on your snippet
import Purpose from '../components/Purpose'; // <--- The new premium section
import HowItWorks from '../components/HowItWorks';
import CTA from '../components/CTA';
import Reveal from '../components/Reveal'; 
import PageWrapper from '../components/PageWrapper'; 

const Home = () => {
  return (
    <PageWrapper>
      {/* Kept your padding preference */}
      <main className="pt-48 px-4 md:px-6 max-w-7xl mx-auto">
        
        <Reveal>
          <Hero />
        </Reveal>

        <Reveal delay={200}>
          <BentoGrid />
        </Reveal>

        <Reveal>
          <WhatWeDo />
        </Reveal>

        {/* --- ADDED PURPOSE SECTION --- */}
        <Reveal>
          <Purpose />
        </Reveal>

        <Reveal>
          <HowItWorks />
        </Reveal>

        <Reveal>
          <CTA />
        </Reveal>

      </main>
    </PageWrapper>
  );
};

export default Home;