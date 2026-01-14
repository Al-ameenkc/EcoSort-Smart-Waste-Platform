import React from 'react';
import WhoWeAre from '../components/WhoWeAre';
import OurStory from '../components/OurStory';
import ProcessImpact from '../components/ProcessImpact';
import OurMission from '../components/OurMission'; // <--- Import here

const AboutUs = () => {
  return (
    <main className="min-h-screen">
      
      <WhoWeAre />
      <OurStory /> 
      <ProcessImpact />
      
      {/* SECTION 4: Our Mission */}
      <OurMission />

    </main>
  );
};

export default AboutUs;