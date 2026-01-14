import React from 'react';
import logo from './assets/kanem-logo.png'; 
import { Home, Leaf, Truck, Camera, Phone } from 'lucide-react'; 
import NavPill from './components/NavPill'; 
import Hero from './components/Hero'; 
import BentoGrid from './components/BentoGrid'; // <--- Import the new component

function App() {
  return (
    <div className="min-h-screen bg-white text-primary font-sans selection:bg-[#C3F53C] selection:text-black overflow-x-hidden">
      
      {/* --- 1. NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Kanem Waste Logo" className="h-10 w-auto object-contain" />
            <span className="text-xl font-light tracking-tight">KanemWaste</span>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <NavPill icon={<Home size={16} className="text-black"/>} text="Home" />
            <NavPill icon={<Leaf size={16} className="text-black"/>} text="About Us" />
            <NavPill icon={<Truck size={16} className="text-black"/>} text="Book PickUp" />
            <div className="w-px h-8 bg-black/5 mx-2"></div>
            <a href="#" className="relative flex items-center gap-3 pl-1.5 pr-5 py-1.5 bg-white/50 backdrop-blur-md border border-white/60 rounded-full shadow-sm hover:shadow-md hover:bg-white/70 hover:scale-[1.02] transition-all duration-300 group">
                <style>{`
                  @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                  }
                  .animate-heartbeat {
                    animation: heartbeat 1.5s ease-in-out infinite;
                  }
                `}</style>
                <div className="w-10 h-10 rounded-full bg-[#F1FCC2]/80 backdrop-blur-sm flex items-center justify-center relative overflow-visible shadow-inner">
                    <div className="absolute inset-0 rounded-full bg-[#C3F53C] opacity-40 animate-ping"></div>
                    <Camera size={18} className="text-lime-700 relative z-10 animate-heartbeat" />
                </div>
                <div className="flex flex-col justify-center h-full">
                    <span className="font-bold text-sm text-slate-800 leading-tight">Snap-Sort</span>
                    <span className="text-[10px] font-extrabold text-lime-600 uppercase tracking-wider leading-tight mt-0.5">
                        AI Powered
                    </span>
                </div>
            </a>
          </div>

          <button className="flex items-center gap-2 bg-transparent border border-black/10 text-slate-900 px-6 py-3 rounded-full font-semibold text-sm hover:scale-105 hover:bg-black hover:text-white transition-all duration-300 group">
            <Phone size={18} className="group-hover:rotate-12 transition-transform duration-300" />
            <span>Contact Us</span>
          </button>
        </div>
      </nav>

      {/* --- 2. MAIN CONTENT --- */}
      <main className="pt-48 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        
        {/* HERO COMPONENT */}
        <Hero />

        {/* BENTO GRID COMPONENT */}
        <BentoGrid />

      </main>

      {/* --- 3. FOOTER MARQUEE --- */}
      <div className="bg-[#E8F89C] py-4 border-t border-[#C3F53C]/30 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(12)].map((_, i) => (
                <div key={i} className="flex items-center mx-6 gap-4 text-black font-bold uppercase tracking-wider text-sm">
                    <div className="w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#C3F53C] rounded-full border-2 border-[#1a1a1a]"></div>
                    </div>
                    <span>Green The Planet</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;