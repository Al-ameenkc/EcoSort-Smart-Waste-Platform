import React from 'react';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-8 px-6 max-w-[1400px] mx-auto">
      
      <div className="bg-[#1a4032] rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden flex flex-col items-center text-center">
        
        {/* --- BACKGROUND DECORATION --- */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#C3F53C]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-[#E8F89C]/10 rounded-full blur-3xl"></div>
        </div>

        {/* --- CONTENT --- */}
        <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-medium text-white mb-4 leading-tight tracking-tight">
                Ready to reshape the <br/>
                <span className="text-[#C3F53C]">future of recycling?</span>
            </h2>
            
            {/* Updated Text */}
            <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed max-w-lg mx-auto">
                Join our community of eco-warriors today and start making a real impact on the environment.
            </p>

            <div className="flex items-center justify-center">
                {/* Primary Button Only */}
                <button className="bg-[#C3F53C] hover:bg-[#b2e32b] text-[#1a4032] px-8 py-3 rounded-full font-bold text-base transition-all hover:scale-105 flex items-center gap-2">
                    Get Started Now
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>

      </div>
    </section>
  );
};

export default CTA;