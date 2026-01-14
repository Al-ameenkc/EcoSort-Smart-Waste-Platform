import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    id: 0,
    title: "Plastic Collection and Recycling",
    badge: "Collection",
    desc: "We organize and conduct community clean-up drives to collect discarded plastic from local areas.",
    img: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=2070&auto=format&fit=crop",
    bg: "bg-[#F9FBF6]",
    text: "text-slate-900",
    border: "border border-slate-100",
    blobColor: "bg-[#E8F89C]/10",
    theme: "light"
  },
  {
    id: 1,
    title: "Innovative Product Development",
    badge: "Innovation",
    desc: "Utilizing recycled plastic, we design and manufacture eco-friendly products such as reusable bags and containers.",
    img: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?q=80&w=2073&auto=format&fit=crop",
    bg: "bg-[#E8F89C]",
    text: "text-slate-900",
    border: "",
    blobColor: "bg-white/40",
    theme: "light"
  },
  {
    id: 2,
    title: "Education and Workshops",
    badge: "Education",
    desc: "We host educational programs and workshops in schools, businesses, and communities to raise awareness.",
    img: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop",
    bg: "bg-[#1a4032]",
    text: "text-white",
    border: "",
    blobColor: "bg-[#2c5e4a]",
    theme: "dark"
  },
  {
    id: 3,
    title: "Research and Development",
    badge: "R & D",
    desc: "We invest in research and development to discover new methods for efficiently transforming plastic waste.",
    img: "https://images.unsplash.com/photo-1581093458891-2f9cd526332e?q=80&w=2070&auto=format&fit=crop",
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
      
      {/* --- CSS: SCROLLBAR & ANIMATIONS --- */}
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
        
        {/* UPDATED HEADLINE */}
        <h2 className="text-4xl md:text-5xl font-medium text-slate-900 leading-[1.15] tracking-tight">
          We actively collect waste, innovate eco-friendly products, and educate communities to preserve <span className="inline-block bg-[#E8F89C] px-2 rounded-lg mx-1 transform -rotate-1">the environment</span>
        </h2>
      </div>

      {/* --- INTERACTIVE CARD STRIP --- */}
      <div className="flex gap-6 overflow-x-auto py-8 no-scrollbar px-2">
        
        {projects.map((project) => {
          const isActive = activeId === project.id;
          const isDark = project.theme === 'dark';

          return (
            <div 
              key={project.id}
              onClick={() => setActiveId(project.id)}
              className={`
                relative rounded-[2.5rem] overflow-hidden cursor-pointer 
                transition-all duration-500 ease-out will-change-transform
                ${project.bg} ${project.text} ${project.border}
                ${isActive 
                  ? 'min-w-[85vw] md:min-w-[600px] p-6 md:p-8 flex flex-col md:flex-row gap-6 shadow-xl shadow-slate-200/50' 
                  : 'min-w-[260px] md:min-w-[300px] h-[320px] p-8 flex flex-col justify-between hover:-translate-y-2 hover:shadow-lg'
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
              <div className={`flex flex-col justify-between z-10 ${isActive ? 'flex-1 h-full' : 'h-full'}`}>
                  
                  {/* TOP PART */}
                  <div>
                    {isActive ? (
                        <h3 className="text-2xl md:text-3xl font-medium mb-3 leading-tight animate-fade-up">
                           {project.title}
                        </h3>
                    ) : (
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium shadow-sm ${isDark ? 'bg-[#C3F53C] text-[#1a4032]' : 'bg-white text-slate-900'}`}>
                           {project.badge}
                        </span>
                    )}

                    {isActive && (
                      <p className={`text-sm md:text-base leading-relaxed mb-6 max-w-xs animate-fade-up ${isDark ? 'text-gray-300' : 'text-slate-500'}`} style={{ animationDelay: '0.1s' }}>
                          {project.desc}
                      </p>
                    )}
                  </div>
                  
                  {/* BOTTOM PART */}
                  <div className={`flex items-center justify-between w-full md:w-auto ${isActive ? 'mt-auto' : ''}`}>
                      <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Read More
                      </span>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ml-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:rotate-45'} ${isDark ? 'bg-white text-[#1a4032]' : 'bg-white text-slate-900'}`}>
                          <ArrowUpRight size={18} />
                      </div>
                  </div>
              </div>

              {/* --- IMAGE SIDE --- */}
              {isActive && (
                 <div className="w-full md:w-[240px] h-[220px] relative shrink-0 animate-fade-up" style={{ animationDelay: '0.15s' }}>
                    <div className="w-full h-full rounded-[2rem] overflow-hidden shadow-md">
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
    </section>
  );
};

export default WhatWeDo;