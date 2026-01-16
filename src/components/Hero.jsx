import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Leaf, Recycle, Sun, CircleDashed, Heart } from 'lucide-react'; 
import { Link } from 'react-router-dom'; 
import JoinUsModal from './JoinUsModal'; 

const Hero = () => {
  // --- HERO DATA ---
  const heroContent = [
    {
      id: 0, 
      textStart: "Smart recycling that actually",
      highlight: "pays",
      textEnd: "you back"
    },
    {
      id: 1, 
      textStart: "Join us in the",
      highlight: "fight",
      textEnd: "for the environment"
    },
    {
      id: 2, 
      textStart: "Powering a future of",
      highlight: "clean",
      textEnd: "sustainable energy"
    },
    {
      id: 3, 
      textStart: "AI that helps you",
      highlight: "sort",
      textEnd: "waste instantly"
    }
  ];

  // --- TYPEWRITER STATE ---
  const [activeSlide, setActiveSlide] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  
  // --- MODAL STATE ---
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // --- TYPEWRITER LOGIC ---
  useEffect(() => {
    const currentPhase = heroContent[activeSlide];
    const fullText = `${currentPhase.textStart} ${currentPhase.highlight} ${currentPhase.textEnd}`;
    
    let delay = 50; 
    
    if (isDeleting) {
        delay = 30; 
    } else if (isWaiting) {
        delay = 3500; 
    }

    const handleType = () => {
      if (isWaiting) {
        setIsWaiting(false);
        setIsDeleting(true);
        return;
      }

      if (isDeleting) {
        if (charIndex > 0) {
          setCharIndex(prev => prev - 1);
        } else {
          setIsDeleting(false);
          setActiveSlide(prev => (prev + 1) % heroContent.length);
        }
        return;
      }

      if (!isDeleting) {
        if (charIndex < fullText.length) {
          setCharIndex(prev => prev + 1);
        } else {
          setIsWaiting(true);
        }
      }
    };

    const timer = setTimeout(handleType, delay);
    return () => clearTimeout(timer);

  }, [charIndex, isDeleting, isWaiting, activeSlide]);

  // --- MANUAL OVERRIDE ---
  const handleManualSlide = (index) => {
    setActiveSlide(index);
    setCharIndex(0);
    setIsDeleting(false);
    setIsWaiting(false); 
  };

  // --- TEXT PARSER ---
  const currentData = heroContent[activeSlide];
  const fullString = `${currentData.textStart} ${currentData.highlight} ${currentData.textEnd}`;
  const currentText = fullString.slice(0, charIndex);

  const startLen = currentData.textStart.length;
  const highLen = currentData.highlight.length;

  const renderStart = currentText.slice(0, startLen);
  const renderHighlight = currentText.slice(startLen + 1, startLen + 1 + highLen); 
  const renderEnd = currentText.slice(startLen + 1 + highLen + 1);

  const isFullTextTyped = charIndex === fullString.length;

  return (
    <>
    <div className="relative flex flex-col items-center mb-12">
        
        {/* --- MOBILE ICONS ROW (Visible only on Mobile) --- */}
        {/* Added h-24 and items-center to contain the large scaling without layout shifts */}
        <div className="flex md:hidden gap-6 mb-8 justify-center w-full items-center h-24 px-4">
            <button 
                onClick={() => handleManualSlide(0)}
                // UPDATED CLASSNAMES: Added scale-125/scale-90, opacity, and stronger rings
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm transition-all duration-500 ease-in-out ${activeSlide === 0 ? 'bg-[#E8F89C] ring-4 ring-[#E8F89C]/30 scale-125 z-10' : 'bg-gray-100 scale-90 opacity-70'}`}
            >
                {/* Icon size also changes slightly */}
                <Recycle size={activeSlide === 0 ? 24 : 20} className={`transition-colors duration-500 ${activeSlide === 0 ? 'text-black' : 'text-gray-400'}`} />
            </button>
            <button 
                onClick={() => handleManualSlide(1)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm transition-all duration-500 ease-in-out ${activeSlide === 1 ? 'bg-[#064e3b] ring-4 ring-[#064e3b]/30 scale-125 z-10' : 'bg-gray-100 scale-90 opacity-70'}`}
            >
                <Leaf size={activeSlide === 1 ? 22 : 18} className={`transition-colors duration-500 ${activeSlide === 1 ? 'text-white' : 'text-green-800'}`} />
            </button>
            <button 
                onClick={() => handleManualSlide(2)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm transition-all duration-500 ease-in-out ${activeSlide === 2 ? 'bg-[#F1FCC2] ring-4 ring-[#F1FCC2]/30 scale-125 z-10' : 'bg-gray-100 scale-90 opacity-70'}`}
            >
                <Sun size={activeSlide === 2 ? 26 : 22} className={`transition-colors duration-500 ${activeSlide === 2 ? 'text-[#84CC16]' : 'text-gray-400'}`} />
            </button>
            <button 
                onClick={() => handleManualSlide(3)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm transition-all duration-500 ease-in-out ${activeSlide === 3 ? 'bg-white border-green-800/20 ring-4 ring-green-100 scale-125 z-10' : 'bg-gray-100 scale-90 opacity-70'}`}
            >
                <CircleDashed size={activeSlide === 3 ? 22 : 18} className={`transition-colors duration-500 ${activeSlide === 3 ? 'text-green-800' : 'text-gray-400'}`} />
            </button>
        </div>


        {/* ROW 1: Desktop Icons -- Headline -- Desktop Icons */}
        <div className="w-full flex justify-between items-center mb-12">
            
            {/* --- LEFT ICONS CLUSTER (Desktop Only) --- */}
            <div className="hidden md:flex flex-col items-start">
                <button 
                    onClick={() => handleManualSlide(0)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm z-10 transition-all duration-500 ${activeSlide === 0 ? 'bg-[#E8F89C] scale-125 ring-4 ring-[#E8F89C]/30' : 'bg-gray-100 hover:bg-[#E8F89C] hover:scale-110'}`}
                >
                    <Recycle size={24} className={`transition-colors ${activeSlide === 0 ? 'text-black' : 'text-gray-400'}`} />
                </button>
                <button 
                    onClick={() => handleManualSlide(1)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl -mt-4 ml-16 z-0 transition-all duration-500 ${activeSlide === 1 ? 'bg-[#064e3b] scale-125 ring-4 ring-[#064e3b]/20' : 'bg-white border border-gray-100 hover:scale-110'}`}
                >
                    <Leaf size={20} className={`transition-colors ${activeSlide === 1 ? 'text-white' : 'text-green-800'}`} />
                </button>
            </div>

            {/* --- CENTER HEADLINE (TYPEWRITER) --- */}
            <div className="min-h-[160px] flex items-center">
                <h1 className="text-5xl md:text-7xl font-medium text-center tracking-tight text-slate-900 max-w-5xl mx-auto leading-[1.15]">
                
                {renderStart} 
                <br className="hidden md:block" />

                {renderHighlight.length > 0 && (
                    <span className="relative inline-block px-4 mx-1 z-10">
                        {/* BLOB: Shows only when full text is typed */}
                        <span 
                            className={`absolute inset-0 bg-[#C3F53C] rounded-full -rotate-2 -z-10 transition-all duration-500 ease-out ${isFullTextTyped ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                        ></span>
                        {renderHighlight}
                    </span> 
                )}

                {renderEnd}
                </h1>
            </div>

            {/* --- RIGHT ICONS CLUSTER (Desktop Only) --- */}
            <div className="hidden md:flex flex-col items-end">
                <button 
                    onClick={() => handleManualSlide(2)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm z-10 transition-all duration-500 ${activeSlide === 2 ? 'bg-[#F1FCC2] scale-125 ring-4 ring-[#F1FCC2]/30' : 'bg-gray-100 hover:bg-[#F1FCC2] hover:scale-110'}`}
                >
                    <Sun size={28} className={`transition-colors ${activeSlide === 2 ? 'text-[#84CC16]' : 'text-gray-400'}`} />
                </button>
                <button 
                    onClick={() => handleManualSlide(3)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm -mt-4 mr-16 z-0 transition-all duration-500 ${activeSlide === 3 ? 'bg-white border-green-800/20 scale-125 ring-4 ring-green-100' : 'bg-white border border-gray-100 hover:scale-110'}`}
                >
                    <CircleDashed size={20} className={`transition-colors ${activeSlide === 3 ? 'text-green-800' : 'text-gray-400'}`} />
                </button>
            </div>

        </div>

        {/* ROW 2: Description -- Buttons */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/3 pl-4">
                <p className="text-gray-500 text-lg text-center md:text-left leading-relaxed max-w-xs mx-auto md:mx-0">
                  We are an organization that educates society about the problems of ecology and nature using AI technology.
                </p>
            </div>

            <div className="md:w-auto flex flex-col sm:flex-row items-center gap-4 pr-4">
                 {/* BUTTON 1: START EARNING (Links to /book-pickup) */}
                 <Link 
                    to="/book-pickup"
                    className="bg-[#C3F53C] hover:bg-[#b2e32b] text-black transition-all px-8 py-4 rounded-full flex items-center gap-3 font-semibold text-lg shadow-xl shadow-lime-200/50 hover:scale-105 hover:shadow-lime-200/80 group"
                 >
                    Start Earning <ArrowUpRight size={22} className="group-hover:rotate-45 transition-transform" />
                 </Link>

                 {/* BUTTON 2: JOIN US (Opens Modal) */}
                 <button 
                    onClick={() => setIsJoinModalOpen(true)}
                    className="bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 transition-all px-8 py-4 rounded-full flex items-center gap-3 font-semibold text-lg hover:scale-105"
                 >
                    <Heart size={20} className="text-[#C3F53C]" fill="currentColor" />
                    Join Us
                 </button>
            </div>
        </div>

    </div>

    {/* --- RENDER MODAL --- */}
    <JoinUsModal 
        isOpen={isJoinModalOpen} 
        onClose={() => setIsJoinModalOpen(false)} 
    />
    </>
  );
};

export default Hero;