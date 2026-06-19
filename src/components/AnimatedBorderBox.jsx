// src/components/AnimatedBorderBox.jsx
import React from 'react';

const AnimatedBorderBox = ({ children, className = "", borderColor = "#84CC16" }) => {
  return (
    // The className prop here receives the "hover:scale-105", applying it to the WHOLE box
    <div className={`relative group cursor-pointer inline-block ${className}`}>
      
      <style>{`
        .draw-border-path {
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            /* Animation: Waits 0.2s, then zips around */
            transition: stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .group:hover .draw-border-path {
            stroke-dashoffset: 0;
        }
      `}</style>

      {/* FIX: Removed preserveAspectRatio="none" to stop oval distortion.
         We use x=1 y=1 and calc() to inset the border so it sits perfectly ON the edge.
      */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
        <rect 
            x="1" 
            y="1" 
            width="calc(100% - 2px)" 
            height="calc(100% - 2px)" 
            rx="1000" /* Large value clamps to "Pill" shape automatically */
            ry="1000" 
            fill="none" 
            stroke={borderColor} 
            strokeWidth="2"
            strokeLinecap="round"
            pathLength="1" 
            className="draw-border-path"
        />
      </svg>

      {/* Button Content */}
      <div className="relative z-10">
        {children}
      </div>
      
    </div>
  );
};

export default AnimatedBorderBox;