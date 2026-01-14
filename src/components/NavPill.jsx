import React from 'react';

const NavPill = ({ icon, text }) => {
  return (
    // WRAPPER
    <a href="#" className="inline-flex items-center h-10 transition-transform duration-300 hover:scale-105 group">
      
      {/* BUTTON CONTENT
          - Resting: bg-transparent (Shows Navbar background)
          - Hover: bg-[#C3F53C]/20 (Glassy Lemon Green) + Blur + Border
      */}
      <div className="flex items-center h-full w-full gap-3 pl-1.5 pr-6 rounded-full bg-transparent border border-transparent transition-all duration-300 hover:bg-[#C3F53C]/20 hover:backdrop-blur-sm hover:border-[#C3F53C]/40 hover:shadow-sm">
        
        {/* White Icon Circle 
            - Added 'shadow-sm' to make it pop against the clear background
        */}
        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform duration-300">
           {icon}
        </div>
        
        {/* Text */}
        <span className="font-semibold text-sm tracking-wide text-slate-800">{text}</span>
      </div>

    </a>
  );
};

export default NavPill;