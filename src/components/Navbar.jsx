import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/kanem-logo.png'; 
import { Home as HomeIcon, Leaf, Truck, Camera } from 'lucide-react'; // Removed Phone icon import since it's in ContactUs now
import NavPill from './NavPill'; 
import SnapSortModal from './SnapSortModal'; 
import SnapSortSidebar from './SnapSortSidebar'; 
import ContactUs from './ContactUs'; // <--- Import the new component

const Navbar = () => {
  const location = useLocation();
  const [isSnapModalOpen, setIsSnapModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hasUsedSnapSort, setHasUsedSnapSort] = useState(false);

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

  return (
    <>
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
            <Link to="/book-pickup">
              <NavPill icon={<Truck size={16} className="text-black"/>} text="Book PickUp" active={location.pathname === '/book-pickup'} />
            </Link>
            
            <div className="w-px h-8 bg-black/5 mx-2"></div>
            
            {/* SNAP-SORT BUTTON */}
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

          {/* --- CONTACT DROPDOWN (Replaced button with Component) --- */}
          <ContactUs />

        </div>
      </nav>

      {/* --- MODAL --- */}
      <SnapSortModal 
        isOpen={isSnapModalOpen} 
        onClose={() => setIsSnapModalOpen(false)} 
        onImageSelect={handleImageSelected} 
      />

      {/* --- SIDEBAR --- */}
      <SnapSortSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        image={selectedImage}
        onScanAgain={handleScanAnother} 
      />
    </>
  );
};

export default Navbar;