import React from 'react';
import { Target, Lightbulb, Users } from 'lucide-react';
import { getServiceAreaNames } from '../constants/serviceAreas';

const OurStory = () => {
  return (
    // Reduced padding (py-16) to fit screen better
    <section className="py-16 px-6 md:px-12 bg-[#1a4032] text-white rounded-[3rem] mt-10 mb-20 relative z-20 max-w-[1400px] mx-auto">
      
      {/* Reduced gap from 20 to 12 for a tighter layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* --- LEFT: TEXT --- */}
            <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 shadow-sm mb-6">
                    <span className="w-2 h-2 rounded-full bg-[#C3F53C] animate-pulse"></span>
                    <span className="text-xs font-bold text-[#C3F53C] uppercase tracking-wider">Our Journey</span>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                    From community pickups to a <span className="text-[#C3F53C]">self-sustaining loop.</span>
                </h2>
                <div className="space-y-4 text-slate-300 text-base md:text-lg leading-relaxed">
                    <p>
                        KanemWaste started in Abuja with a simple idea: plastic bottles clogging drains cause floods, and those same bottles have real value when recycled. <strong className="text-white">We collect from bins and gatherers</strong>, clean and compress plastic, and charge a small weekly fee for door-to-door pickup to cover fuel and keep the service running.
                    </p>
                    <p>
                        Today we operate across selected Abuja neighbourhoods on fixed pickup days, aggregate bulk plastic for our partner factory, and use that B2B revenue to fund emergency drainage clearance and cash rewards for verified flood hazard tips from local residents.
                    </p>
                </div>
                
                <div className="mt-10 flex flex-col sm:flex-row gap-8">
                    <StoryPoint icon={Lightbulb} title="Circular Economy" desc="Recycle revenue funds flood ops." />
                    <StoryPoint icon={Users} title="Community First" desc="Residents earn from tips & bottles." />
                </div>
            </div>

            {/* --- RIGHT: VISUAL GRID --- */}
            <div className="grid grid-cols-2 gap-4">
                {/* Column 1: Image Top, Card Bottom */}
                <div className="space-y-4 translate-y-8">
                    {/* Image: h-60 */}
                    <div className="h-60 rounded-[2rem] overflow-hidden shadow-lg">
                        <img 
                            src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop" 
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                            alt="Collection"
                        />
                    </div>
                    {/* Card: h-44 */}
                    <div className="h-44 bg-[#C3F53C] rounded-[2rem] p-6 flex flex-col justify-end text-[#1a4032] shadow-lg">
                        <Target size={28} className="mb-2" />
                        <span className="font-bold text-lg leading-tight">Zero Waste <br/> Goal</span>
                    </div>
                </div>

                {/* Column 2: Card Top, Image Bottom */}
                <div className="space-y-4">
                    {/* Card: h-44 */}
                    <div className="h-44 bg-white/10 backdrop-blur-sm border border-white/10 rounded-[2rem] p-6 flex flex-col justify-end shadow-lg">
                        <span className="text-3xl font-bold text-[#C3F53C] mb-1">{getServiceAreaNames().length}</span>
                        <span className="text-xs text-slate-300 font-medium">Service Areas</span>
                    </div>
                    {/* Image: h-60 */}
                    <div className="h-60 rounded-[2rem] overflow-hidden shadow-lg">
                        <img 
                            src="https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=2070&auto=format&fit=crop" 
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                            alt="Sorting"
                        />
                    </div>
                </div>
            </div>

      </div>
    </section>
  );
};

const StoryPoint = ({ icon: Icon, title, desc }) => (
    <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#C3F53C] shrink-0">
            <Icon size={20} />
        </div>
        <div>
            <h4 className="font-bold text-white text-base">{title}</h4>
            <p className="text-xs text-slate-400">{desc}</p>
        </div>
    </div>
);

export default OurStory;