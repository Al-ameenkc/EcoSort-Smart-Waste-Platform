import React, { useState } from 'react';
import { Leaf, Heart, Recycle, Bot } from 'lucide-react';
import logo from '../assets/kanem-logo.png'; 
import communityImg from '../assets/community.jpg'; 
import JoinUsModal from './JoinUsModal'; 
import EcoBotSidebar from './EcoBotSidebar'; 

const BentoGrid = () => {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isEcoBotOpen, setIsEcoBotOpen] = useState(false);

  return (
    <>
    <div className="flex flex-col md:flex-row items-center justify-center gap-5 w-full max-w-[1400px] mx-auto mb-6 px-4">
      
      {/* CARD 1: LOGO ONLY */}
      <div className="w-full md:w-[180px] h-[240px] bg-[#F9FBF6] rounded-[1.5rem] flex items-center justify-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 border border-gray-100 shadow-sm">
          <div className="absolute inset-0 pointer-events-none">
             <div className="absolute w-[200px] h-[200px] border-[1px] border-slate-900/5 rounded-full -bottom-10 -left-10 scale-150 group-hover:scale-125 transition-transform duration-700"></div>
             <div className="absolute w-[180px] h-[180px] border-[1px] border-slate-900/5 rounded-full -bottom-10 -left-10 scale-150"></div>
             <div className="absolute w-[200px] h-[200px] border-[1px] border-slate-900/5 rounded-full -top-10 -right-10 scale-150 group-hover:scale-125 transition-transform duration-700 delay-75"></div>
             <div className="absolute w-full h-full bg-gradient-to-tr from-gray-100/50 via-transparent to-transparent"></div>
          </div>
          <img 
            src={logo} 
            alt="Kanem Waste Logo" 
            className="w-20 h-auto object-contain z-10 opacity-90 group-hover:scale-110 transition-transform duration-500" 
          />
      </div>

      {/* CARD 2: PLASTIC WASTE */}
      <div className="w-full md:w-[240px] h-[320px] bg-[#E8F89C] rounded-[1.5rem] p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
          
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-green-700 mb-6">
             <Recycle size={24} />
          </div>

          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-slate-900 leading-none mb-4">
              Plastic <br/> & Waste
            </h3>
            <p className="text-sm text-slate-800 font-medium leading-relaxed">
              We collect PET bottles, hard plastics, and recyclables to keep our communities clean and green.
            </p>
          </div>
      </div>

      {/* CARD 3: VOLUNTEER (Center Hero) */}
      <div 
        onClick={() => setIsJoinModalOpen(true)} 
        className="w-full md:w-[300px] h-[400px] relative group rounded-[2rem] overflow-hidden hover:scale-[1.02] transition-transform duration-500 shadow-xl cursor-pointer"
      >
        <img 
          src={communityImg} 
          alt="Community Cleanup" 
          className="w-full h-full object-cover grayscale-[10%]"
        />
        
        {/* Floating Button with Fixed Hover Syntax */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white pl-1.5 pr-5 py-1.5 rounded-full shadow-lg flex items-center gap-3 whitespace-nowrap cursor-pointer hover:bg-black transition-colors group/badge">
            <div className="w-8 h-8 bg-[#C3F53C] rounded-full flex items-center justify-center text-black group-hover/badge:bg-white transition-colors">
                <Leaf size={14} />
            </div>
            <div className="flex flex-col text-left">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-0.5 group-hover/badge:text-gray-400 transition-colors">Join Us</span>
                <span className="font-bold text-slate-900 text-xs leading-none group-hover/badge:text-white transition-colors">Volunteer Now</span>
            </div>
        </div>
      </div>

      {/* CARD 4: CHARITY/DONATE */}
      <div className="w-full md:w-[240px] h-[320px] bg-gradient-to-b from-[#1a4032] to-[#0f291e] rounded-[1.5rem] p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 text-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2000&auto=format&fit=crop')] opacity-10 mix-blend-overlay bg-cover"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6">
                <Heart size={22} className="text-[#C3F53C]" />
            </div>
            
            <span className="inline-block px-3 py-1 rounded-full border border-white/20 text-[10px] font-bold mb-4 text-[#C3F53C]">
                Charity
            </span>
            
            <h3 className="text-3xl font-bold leading-none mb-3">
                Support <br/> Our Mission
            </h3>

            <p className="text-sm text-slate-300 font-medium leading-relaxed">
                Your contribution helps us expand recycling efforts across the state.
            </p>
          </div>
      </div>

      {/* CARD 5: AI EDUCATION BOT */}
      <div 
        onClick={() => setIsEcoBotOpen(true)} 
        className="w-full md:w-[180px] h-[240px] bg-[#F1FCC2] rounded-[1.5rem] p-5 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 cursor-pointer"
      >
         <div className="absolute inset-0 flex items-center justify-center opacity-60 pointer-events-none">
             <div className="absolute w-[220px] h-[220px] border-[12px] border-[#dcf29d] rounded-full group-hover:scale-105 transition-transform duration-700"></div>
             <div className="absolute w-[160px] h-[160px] border-[12px] border-[#dcf29d] rounded-full group-hover:scale-105 transition-transform duration-700 delay-75"></div>
             <div className="absolute w-[100px] h-[100px] border-[12px] border-[#dcf29d] rounded-full group-hover:scale-105 transition-transform duration-700 delay-100"></div>
             <div className="absolute w-[50px] h-[50px] border-[12px] border-[#eafcb0] rounded-full"></div>
         </div>
         <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-3 group-hover:rotate-12 transition-transform">
                 <Bot size={24} className="text-slate-800" />
            </div>
            {/* UPDATED NAME HERE */}
            <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">Eco-Ai</h4>
            <p className="text-[10px] text-slate-600 leading-snug max-w-[120px]">
                Ask our AI about sustainability & recycling.
            </p>
         </div>
      </div>

    </div>

    {/* --- RENDER MODALS --- */}
    <JoinUsModal 
        isOpen={isJoinModalOpen} 
        onClose={() => setIsJoinModalOpen(false)} 
    />

    <EcoBotSidebar 
        isOpen={isEcoBotOpen} 
        onClose={() => setIsEcoBotOpen(false)} 
    />
    </>
  );
};

export default BentoGrid;