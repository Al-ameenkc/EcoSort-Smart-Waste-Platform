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
          Our mission is to reduce the environmental footprint of plastic waste by implementing innovative recycling solutions. We strive to promote a circular economy where plastic is reused, recycled, and repurposed, minimizing its impact on the environment. 
          <br /><br />
          <span className="font-medium text-[#C3F53C]">KanemWaste</span> is dedicated to educating communities about the importance of recycling and empowering them to take action in preserving our planet for future generations.
        </p>
      </div>

    </section>
  );
};

export default OurMission;