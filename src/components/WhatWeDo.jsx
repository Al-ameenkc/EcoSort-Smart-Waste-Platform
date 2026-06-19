import React, { useState } from 'react';
// --- 1. IMPORT YOUR IMAGES HERE ---
import educationImg from '../assets/education.png'; 
import innovationImg from '../assets/innovation.png'; 
import greenLogisticsImg from '../assets/green-logistics.jpg'; // <--- NEW IMPORT

const projects = [
  {
    id: 0,
    title: "Plastic Collection",
    badge: "Collection",
    desc: "Community drives to gather plastic and clean local areas.",
    img: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=2070&auto=format&fit=crop",
    bg: "bg-[#F9FBF6]",
    text: "text-slate-900",
    border: "border border-slate-100",
    blobColor: "bg-[#E8F89C]/10",
    theme: "light"
  },
  {
    id: 1,
    title: "Eco Innovation",
    badge: "Innovation",
    desc: "Turning recycled waste into durable, eco-friendly goods.",
    img: innovationImg, 
    bg: "bg-[#E8F89C]",
    text: "text-slate-900",
    border: "",
    blobColor: "bg-white/40",
    theme: "light"
  },
  {
    id: 2,
    title: "Public Education",
    badge: "Education",
    desc: "Workshops empowering locals with sustainable waste habits.",
    img: educationImg, 
    bg: "bg-[#1a4032]",
    text: "text-white",
    border: "",
    blobColor: "bg-[#2c5e4a]",
    theme: "dark"
  },
  {
    id: 3,
    title: "Smart Logistics", 
    badge: "Technology",      
    desc: "AI-driven route optimization to minimize carbon emissions and costs.", 
    img: greenLogisticsImg, // <--- 2. USED HERE
    bg: "bg-[#C3F53C]",
    text: "text-slate-900",
    border: "",
    blobColor: "bg-white/50",
    theme: "light"
  }
];

const WhatWeDo = () => {
  const [activeId, setActiveId] = useState(0);

  return (
    <section className="py-16 max-w-[1400px] mx-auto px-4 md:px-6">
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
      `}</style>
      
      {/* --- HEADER --- */}
      <div className="mb-8 max-w-4xl">
        <span className="inline-block px-5 py-2 rounded-full border border-slate-300 text-sm font-semibold text-slate-700 mb-6 hover:border-slate-900 transition-colors cursor-default">
            What We Do
        </span>
        
        <h2 className="text-3xl md:text-4xl font-medium text-slate-900 leading-[1.2] tracking-tight">
          We actively collect waste, innovate eco-friendly products, and educate communities to preserve <span className="inline-block bg-[#E8F89C] px-2 rounded-lg mx-1 transform -rotate-1">the environment</span>
        </h2>
      </div>

      {/* --- CARDS CONTAINER --- */}
      <div className="flex gap-6 overflow-x-auto py-8 no-scrollbar px-2 min-h-[400px] items-center">
        
        {projects.map((project) => {
          const isActive = activeId === project.id;
          const isDark = project.theme === 'dark';
          
          // Badge Logic: ID 0 = Dark Green/White, others standard
          const badgeClass = project.id === 0 
            ? 'bg-[#1a4032] text-white' 
            : isDark 
                ? 'bg-[#C3F53C] text-[#1a4032]' 
                : 'bg-white text-slate-900';

          return (
            <div 
              key={project.id}
              onClick={() => setActiveId(project.id)}
              className={`
                relative rounded-[2.5rem] overflow-hidden cursor-pointer 
                transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform
                ${project.bg} ${project.text} ${project.border}
                
                flex 
                ${isActive 
                  ? 'min-w-[85vw] md:min-w-[500px] p-6 md:p-8 flex-col md:flex-row gap-6 shadow-xl shadow-slate-200/50' 
                  : 'min-w-[240px] md:min-w-[260px] h-[280px] p-6 flex-col justify-between hover:-translate-y-2 hover:shadow-lg'
                }
              `}
            >
              
              {/* --- BACKGROUND BLOBS --- */}
              {!isActive && (
                <>
                  <div className={`absolute top-[-20px] right-[-20px] w-32 h-32 rounded-full blur-2xl ${project.blobColor}`}></div>
                  <div className={`absolute bottom-10 left-[-10px] w-24 h-24 rounded-full blur-xl opacity-60 ${project.blobColor}`}></div>
                </>
              )}
              {isActive && (
                  <div className={`absolute top-[-50%] left-[-20%] w-[80%] h-[150%] rounded-full blur-3xl pointer-events-none opacity-50 ${project.blobColor}`}></div>
              )}

              {/* --- CONTENT CONTAINER --- */}
              <div className={`flex flex-col z-10 ${isActive ? 'flex-1 justify-center' : 'h-full justify-between'}`}>
                  
                  <div>
                    {/* Badge */}
                    <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm mb-4 ${badgeClass}`}>
                       {project.badge}
                    </span>

                    {/* Title */}
                    <h3 className={`font-medium leading-tight ${isActive ? 'text-2xl md:text-3xl mb-4' : 'text-xl'}`}>
                        {project.title}
                    </h3>

                    {/* Description */}
                    {isActive && (
                      <p className={`text-sm leading-relaxed animate-fade-up ${isDark ? 'text-gray-300' : 'text-slate-600'}`} style={{ animationDelay: '0.1s' }}>
                          {project.desc}
                      </p>
                    )}
                  </div>
                  
                  {/* Spacer for inactive */}
                  {!isActive && <div className="h-4"></div>}
              </div>

              {/* --- IMAGE SIDE --- */}
              {isActive && (
                 <div className="w-full md:w-[220px] h-[180px] relative shrink-0 animate-fade-up self-center" style={{ animationDelay: '0.15s' }}>
                    <div className="w-full h-full rounded-[1.5rem] overflow-hidden shadow-md">
                        <img 
                            src={project.img} 
                            alt={project.title} 
                            className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-700"
                        />
                    </div>
                </div>
              )}

            </div>
          );
        })}

      </div>

      {/* --- INDICATORS --- */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {projects.map((project) => (
            <button
                key={project.id}
                onClick={() => setActiveId(project.id)}
                className={`
                    h-1.5 rounded-full transition-all duration-500 ease-out
                    ${activeId === project.id 
                        ? 'w-8 bg-[#1a4032]' 
                        : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                    }
                `}
                aria-label={`View project ${project.id + 1}`}
            />
        ))}
      </div>

    </section>
  );
};

export default WhatWeDo;