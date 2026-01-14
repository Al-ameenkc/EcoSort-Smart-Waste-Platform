import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Leaf, Recycle, Sun, CircleDashed } from 'lucide-react';

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

  // --- TYPEWRITER LOGIC (FIXED) ---
  useEffect(() => {
    const currentPhase = heroContent[activeSlide];
    const fullText = `${currentPhase.textStart} ${currentPhase.highlight} ${currentPhase.textEnd}`;
    
    // 1. Determine Speed based on current state
    let delay = 50; // Standard typing speed
    
    if (isDeleting) {
        delay = 30; // Deleting speed (faster)
    } else if (isWaiting) {
        delay = 3500; // Waiting speed (The long pause at the end)
    }

    // 2. The Logic Loop
    const handleType = () => {
      // CASE A: We are in the "Waiting" phase (Text is full)
      if (isWaiting) {
        // The delay has passed. Time to start deleting.
        setIsWaiting(false);
        setIsDeleting(true);
        return;
      }

      // CASE B: We are Deleting
      if (isDeleting) {
        if (charIndex > 0) {
          setCharIndex(prev => prev - 1);
        } else {
          // Finished deleting. Switch to next slide and start typing.
          setIsDeleting(false);
          setActiveSlide(prev => (prev + 1) % heroContent.length);
        }
        return;
      }

      // CASE C: We are Typing
      if (!isDeleting) {
        if (charIndex < fullText.length) {
          setCharIndex(prev => prev + 1);
        } else {
          // Finished typing. Enable waiting phase.
          setIsWaiting(true);
        }
      }
    };

    // 3. Set the Master Timer
    // Because 'delay' is dynamic, this timer handles typing, deleting, AND waiting.
    // If 'activeSlide' changes (manual click), this timer is CLEARED immediately.
    const timer = setTimeout(handleType, delay);

    // Cleanup: Kills the timer instantly if user interacts
    return () => clearTimeout(timer);

  }, [charIndex, isDeleting, isWaiting, activeSlide]); // Dependencies ensure fresh timer on any change


  // --- MANUAL OVERRIDE (Clicking Icons) ---
  const handleManualSlide = (index) => {
    // 1. Change the slide content
    setActiveSlide(index);
    // 2. Reset Typewriter State completely
    setCharIndex(0);
    setIsDeleting(false);
    setIsWaiting(false); 
    // React will re-run the useEffect above, clearing any old timers and starting fresh.
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

  // Only show the blob when the *entire* sentence is finished
  const isFullTextTyped = charIndex === fullString.length;

  return (
    <div className="relative flex flex-col items-center mb-12">
        
        {/* ROW 1: Icons -- Headline -- Icons */}
        <div className="w-full flex justify-between items-center mb-12">
            
            {/* --- LEFT ICONS CLUSTER --- */}
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

                {/* No blinking cursor anymore */}

                </h1>
            </div>

            {/* --- RIGHT ICONS CLUSTER --- */}
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

        {/* ROW 2: Description -- Spacer -- Button */}
        <div className="w-full flex flex-col md:flex-row items-start justify-between gap-10">
            <div className="md:w-1/3 pl-4">
                <p className="text-gray-500 text-lg text-center md:text-left leading-relaxed max-w-xs">
                  We are an organization that educates society about the problems of ecology and nature using AI technology.
                </p>
            </div>

            <div className="md:w-1/3 flex justify-center md:justify-end pr-4">
                 <button className="bg-[#C3F53C] hover:bg-[#b2e32b] text-black transition-all px-10 py-4 rounded-full flex items-center gap-3 font-semibold text-lg shadow-xl shadow-lime-200/50 hover:scale-105 hover:shadow-lime-200/80">
                    Start Earning <ArrowUpRight size={22} />
                 </button>
            </div>
        </div>

    </div>
  );
};

export default Hero;