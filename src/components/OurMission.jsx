import React from 'react';
// 1. IMPORT YOUR IMAGE HERE
import missionBg from '../assets/mission-bg.jpg'; 

const OurMission = () => {
  return (
    <section className="relative py-24 px-6 flex items-center justify-center">
      
      {/* --- BACKGROUND IMAGE WITH OVERLAY --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src={missionBg} // 2. USE THE VARIABLE HERE
          alt="Hands holding plant" 
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* --- TEXT CONTENT --- */}
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight">
          Our Mission
        </h2>
        
        <p className="text-base md:text-xl leading-relaxed opacity-90 font-light">
          Our mission is to keep Abuja&apos;s neighbourhoods clean and flood-resilient through honest, community-powered waste management. We charge a modest weekly pickup fee to sustain logistics, never for profit, while rewarding verified drainage hazard tips.
          <br /><br />
          <span className="font-medium text-[#C3F53C]">KanemWaste</span> turns plastic waste into factory-ready material, funds hands-on drainage clearance before storms hit, and gives everyday residents a direct stake in protecting their streets.
        </p>
      </div>

    </section>
  );
};

export default OurMission;