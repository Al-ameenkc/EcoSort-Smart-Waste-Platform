import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/kanem-logo.png'; 
import { Home as HomeIcon, Leaf, Truck, Camera } from 'lucide-react'; 
import NavPill from './NavPill'; 
import SnapSortModal from './SnapSortModal'; 
import SnapSortSidebar from './SnapSortSidebar'; 
import ContactUs from './ContactUs'; 
import HamburglarMenu from './HamburglarMenu'; 

const Navbar = () => {
  const location = useLocation();
  const [isSnapModalOpen, setIsSnapModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hasUsedSnapSort, setHasUsedSnapSort] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- ANIMATION STATE ---
  const [animPhase, setAnimPhase] = useState('idle');

  useEffect(() => {
    setTimeout(() => setAnimPhase('driving-out'), 100);
    setTimeout(() => setAnimPhase('teleport-left'), 1600); 
    setTimeout(() => setAnimPhase('driving-in'), 1700); 
    setTimeout(() => setAnimPhase('complete'), 3200); 
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleImageSelected = (image) => {
    setSelectedImage(image);
    setIsSnapModalOpen(false); 
    setIsSidebarOpen(true);    
    setHasUsedSnapSort(true); 
  };

  const handleSnapSortClick = () => {
    if (hasUsedSnapSort) {
        setIsSidebarOpen(true);
    } else {
        setIsSnapModalOpen(true);
    }
  };

  const handleScanAnother = () => {
    setIsSidebarOpen(false); 
    setIsSnapModalOpen(true); 
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // --- ANIMATION STYLES ---
  const getLogoStyle = () => {
    const base = "h-10 w-auto object-contain z-[70] relative";
    switch (animPhase) {
        case 'idle': return `${base} translate-x-0`;
        case 'driving-out': return `${base} transition-transform duration-[1500ms] ease-in translate-x-[100vw]`;
        case 'teleport-left': return `${base} duration-0 -translate-x-[100vw] opacity-0`;
        case 'driving-in': return `${base} transition-transform duration-[1500ms] ease-out translate-x-0 opacity-100`;
        case 'complete': default: return `${base} translate-x-0`;
    }
  };

  const getContentStyle = () => {
    if (animPhase === 'idle' || animPhase === 'driving-out') {
        return "opacity-0 translate-y-2 pointer-events-none";
    }
    return "opacity-100 translate-y-0 transition-all duration-1000 ease-out"; 
  };

  return (
    <>
      {/* FIX: Removed 'overflow-hidden' class from here so Dropdown can show */}
      <nav className="fixed top-0 w-full z-50 bg-white/20 backdrop-blur-sm border-b border-white/20 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
          
          {/* LOGO LINK */}
          <Link to="/" className="flex items-center gap-3 z-[60]" onClick={closeMobileMenu}>
            <img 
                src={logo} 
                alt="Kanem Waste Logo" 
                className={getLogoStyle()} 
            />
            <span className={`hidden md:block text-xl font-light tracking-tight text-primary ${getContentStyle()}`}>
                KanemWaste
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className={`hidden md:flex items-center gap-3 ${getContentStyle()}`}>
            <Link to="/">
              <NavPill icon={<HomeIcon size={16} className="text-black"/>} text="Home" active={location.pathname === '/'} />
            </Link>
            <Link to="/about">
              <NavPill icon={<Leaf size={16} className="text-black"/>} text="About Us" active={location.pathname === '/about'} />
            </Link>
            <Link to="/book-pickup">
              <NavPill icon={<Truck size={16} className="text-black"/>} text="Book PickUp" active={location.pathname === '/book-pickup'} />
            </Link>
            
            <div className="w-px h-8 bg-black/5 mx-2"></div>
            
            <button 
              onClick={handleSnapSortClick} 
              className="relative flex items-center gap-3 pl-1.5 pr-5 py-1.5 bg-white/30 backdrop-blur-md border border-white/40 rounded-full shadow-sm hover:shadow-md hover:bg-white/50 hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
            >
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
                <div className="flex flex-col justify-center h-full text-left">
                    <span className="font-bold text-sm text-slate-800 leading-tight">Snap-Sort</span>
                    <span className="text-[10px] font-extrabold text-lime-600 uppercase tracking-wider leading-tight mt-0.5">
                        AI Powered
                    </span>
                </div>
            </button>
          </div>

          {/* CONTACT & MOBILE MENU */}
          <div className={`flex items-center gap-3 ${getContentStyle()}`}>
              <div className="hidden md:block">
                <ContactUs />
              </div>
              <HamburglarMenu 
                isOpen={isMobileMenuOpen} 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              />
          </div>

          {/* Hidden Listeners */}
          <div className="absolute top-0 right-0 opacity-0 pointer-events-none">
             <ContactUs listenToGlobal={true} mobilePosition={true} />
          </div>

        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      <div 
        className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-3xl h-screen w-full transition-all duration-500 ease-in-out flex flex-col pt-32 px-6 overflow-y-auto pb-20 ${
            isMobileMenuOpen 
            ? 'opacity-100 translate-y-0 visible' 
            : 'opacity-0 -translate-y-[100%] invisible'
        }`}
      >
          <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
            <Link to="/" onClick={closeMobileMenu} className="w-full group">
               <div className={`flex items-center gap-4 pl-2 pr-6 py-2 rounded-full border transition-all shadow-sm ${location.pathname === '/' ? 'bg-[#1a4032] border-[#1a4032] text-white' : 'bg-white/40 border-slate-200 text-slate-800 hover:bg-white hover:shadow-md'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${location.pathname === '/' ? 'bg-white text-[#1a4032]' : 'bg-white text-slate-900'}`}><HomeIcon size={22} /></div>
                  <span className="font-bold text-lg tracking-wide">Home</span>
               </div>
            </Link>
            <Link to="/about" onClick={closeMobileMenu} className="w-full group">
               <div className={`flex items-center gap-4 pl-2 pr-6 py-2 rounded-full border transition-all shadow-sm ${location.pathname === '/about' ? 'bg-[#1a4032] border-[#1a4032] text-white' : 'bg-white/40 border-slate-200 text-slate-800 hover:bg-white hover:shadow-md'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${location.pathname === '/about' ? 'bg-white text-[#1a4032]' : 'bg-white text-slate-900'}`}><Leaf size={22} /></div>
                  <span className="font-bold text-lg tracking-wide">About Us</span>
               </div>
            </Link>
            <Link to="/book-pickup" onClick={closeMobileMenu} className="w-full group">
               <div className={`flex items-center gap-4 pl-2 pr-6 py-2 rounded-full border transition-all shadow-sm ${location.pathname === '/book-pickup' ? 'bg-[#1a4032] border-[#1a4032] text-white' : 'bg-white/40 border-slate-200 text-slate-800 hover:bg-white hover:shadow-md'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${location.pathname === '/book-pickup' ? 'bg-white text-[#1a4032]' : 'bg-white text-slate-900'}`}><Truck size={22} /></div>
                  <span className="font-bold text-lg tracking-wide">Book Pickup</span>
               </div>
            </Link>
            
            <button onClick={() => { closeMobileMenu(); handleSnapSortClick(); }} className="w-full flex items-center gap-4 pl-2 pr-6 py-2 rounded-full bg-[#F1FCC2] border border-[#C3F53C] text-[#1a4032] shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-full bg-[#C3F53C] flex items-center justify-center text-[#1a4032] shadow-inner group-hover:scale-110 transition-transform"><Camera size={22} /></div>
                <div className="flex flex-col text-left"><span className="font-bold text-lg leading-none">Snap-Sort AI</span><span className="text-[11px] font-bold uppercase tracking-wider text-green-700">Scanner Ready</span></div>
            </button>

            <div className="pt-4 border-t border-slate-100 mt-2 pb-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 ml-4">Contact</p>
                <div className="flex justify-center relative">
                    <ContactUs mobilePosition={true} />
                </div>
            </div>
          </div>
      </div>

      <SnapSortModal isOpen={isSnapModalOpen} onClose={() => setIsSnapModalOpen(false)} onImageSelect={handleImageSelected} />
      <SnapSortSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} image={selectedImage} onScanAgain={handleScanAnother} />
    </>
  );
};

export default Navbar;