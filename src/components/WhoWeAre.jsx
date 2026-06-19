import React from 'react';
import { Star } from 'lucide-react';

// Make sure your image is in src/assets/ and named who-we-are.jpg
import whoWeAreImg from '../assets/who-we-are.jpg'; 

const WhoWeAre = () => {
  return (
    <section className="relative pt-32 pb-10 px-6 max-w-[1400px] mx-auto overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/4">
        <div className="w-[400px] h-[400px] bg-[#E8F89C]/40 rounded-full blur-[80px]"></div>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/3 translate-y-1/4">
        <div className="w-[300px] h-[300px] bg-[#C3F53C]/20 rounded-full blur-[80px]"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* --- LEFT CONTENT --- */}
        <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-[#1a4032] animate-pulse"></span>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Who We Are</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-[#1a4032] leading-[1.1] mb-6 tracking-tight">
                Pioneering <br/>
                <span className="relative inline-block">
                    <span className="absolute inset-0 bg-[#C3F53C] -rotate-2 rounded-lg -z-10 transform scale-105"></span>
                    Smart Waste
                </span> <br/>
                Management.
            </h1>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                KanemWaste is more than just a recycling company. We are a tech-driven movement dedicated to transforming how communities perceive and handle waste, turning everyday trash into sustainable treasure.
            </p>

            <div className="flex items-center gap-8">
                {/* STAT 1: AI LOGIC */}
                <div className="flex flex-col">
                    <span className="text-3xl font-bold text-[#1a4032]">95%</span>
                    <span className="text-xs text-slate-500 font-medium">AI Precision</span>
                </div>
                
                <div className="w-px h-10 bg-slate-200"></div>
                
                {/* STAT 2: LOGISTICS IMPACT - UPDATED TO 25% */}
                <div className="flex flex-col">
                    <span className="text-3xl font-bold text-[#1a4032]">25%</span>
                    <span className="text-xs text-slate-500 font-medium">CO₂ Reduced</span>
                </div>
            </div>
        </div>

        {/* --- RIGHT IMAGE --- */}
        <div className="relative">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white z-10">
                
                {/* Image from assets */}
                <img 
                    src={whoWeAreImg} 
                    alt="KanemWaste Team" 
                    className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-lg max-w-[240px]">
                    <div className="flex items-center gap-1 mb-1">
                        {[1,2,3,4,5].map(i => (
                            <Star key={i} size={12} fill="#FACC15" className="text-yellow-400" />
                        ))}
                    </div>
                    <p className="text-slate-900 font-bold text-sm leading-tight">
                        "Leading the change for sustainability."
                    </p>
                </div>
            </div>

            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-[#1a4032]/10 rounded-[2rem] -z-10"></div>
        </div>

      </div>
    </section>
  );
};

export default WhoWeAre;