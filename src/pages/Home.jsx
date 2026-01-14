import React from 'react';
import Hero from '../components/Hero';
import BentoGrid from '../components/BentoGrid';
import WhatWeDo from '../components/WhatWeDo';
import Purpose from '../components/Purpose';
import HowItWorks from '../components/HowItWorks';
import CTA from '../components/CTA';

const Home = () => {
  return (
    // INCREASED: pt-48 -> pt-56 (224px top padding)
    <main className="pt-48 px-4 md:px-6 max-w-7xl mx-auto">
      <Hero />
      <BentoGrid />
      <WhatWeDo />
      <Purpose />
      <HowItWorks />
      <CTA />
    </main>
  );
};

export default Home;