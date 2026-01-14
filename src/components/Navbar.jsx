import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/kanem-logo.png'; 
import { Home as HomeIcon, Leaf, Truck, Camera, Phone } from 'lucide-react'; 
import NavPill from './NavPill'; 

const Navbar = () => {
  const location = useLocation();

  return (
    // CHANGED: bg-white/20 (Very see-through) and backdrop-blur-sm (Less blurry)
    <nav className="fixed top-0 w-full z-50 bg-white/20 backdrop-blur-sm border-b border-white/20 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Kanem Waste Logo" className="h-10 w-auto object-contain" />
          <span className="text-xl font-light tracking-tight text-primary">KanemWaste</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/">
            <NavPill icon={<HomeIcon size={16} className="text-black"/>} text="Home" active={location.pathname === '/'} />
          </Link>
          <Link to="/about">
            <NavPill icon={<Leaf size={16} className="text-black"/>} text="About Us" active={location.pathname === '/about'} />
          </Link>
          <NavPill icon={<Truck size={16} className="text-black"/>} text="Book PickUp" />
          
          <div className="w-px h-8 bg-black/5 mx-2"></div>
          
          {/* Snap-Sort Button */}
          <a href="#" className="relative flex items-center gap-3 pl-1.5 pr-5 py-1.5 bg-white/30 backdrop-blur-md border border-white/40 rounded-full shadow-sm hover:shadow-md hover:bg-white/50 hover:scale-[1.02] transition-all duration-300 group">
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

        {/* Contact Button */}
        <button className="flex items-center gap-2 bg-transparent border border-black/10 text-slate-900 px-6 py-3 rounded-full font-semibold text-sm hover:scale-105 hover:bg-black hover:text-white transition-all duration-300 group">
          <Phone size={18} className="group-hover:rotate-12 transition-transform duration-300" />
          <span>Contact Us</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;