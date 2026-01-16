import React from 'react';
import { Truck, Recycle, Trash2, ArrowRight, CalendarCheck } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section className="py-24 px-6 max-w-[1400px] mx-auto">
      
      {/* --- SECTION HEADER --- */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F1FCC2] border border-[#E8F89C] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#1a4032] animate-pulse"></span>
            <span className="text-xs font-bold text-[#1a4032] uppercase tracking-wider">Simple Process</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
           From Waste to <span className="text-[#C3F53C] bg-[#1a4032] px-3 py-1 rounded-xl inline-block transform -rotate-2">Wealth</span>
        </h2>
      </div>

      {/* --- CARDS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        
        {/* STEP 1: GATHER & BOOK (White Card) */}
        <div className="relative bg-white border border-slate-100 rounded-[2.5rem] p-8 h-[380px] flex flex-col justify-between shadow-xl hover:-translate-y-2 transition-transform duration-500 group z-10">
            {/* Number Pill */}
            <div className="self-start px-4 py-2 bg-slate-100 rounded-full border border-slate-200 text-slate-500 font-bold text-sm">
                Step 01
            </div>

            {/* Icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#F9FBF6] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm text-green-600">
                    <CalendarCheck size={36} />
                </div>
                {/* Decorative Ring */}
                <div className="absolute inset-0 border border-slate-100 rounded-full scale-125 border-dashed animate-[spin_10s_linear_infinite]"></div>
            </div>

            {/* Content */}
            <div className="text-center z-10 mt-20">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Gather & Book</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-[80%] mx-auto">
                    Gather your plastic waste and schedule a pickup instantly via our platform.
                </p>
            </div>

            {/* BEAUTIFUL CONNECTOR ARROW (Desktop Only) */}
            <div className="hidden md:flex absolute top-1/2 -right-6 z-30 w-12 h-12 bg-[#1a4032] rounded-full items-center justify-center text-[#C3F53C] shadow-xl border-4 border-white transition-transform hover:scale-110">
                <ArrowRight size={20} />
            </div>
        </div>


        {/* STEP 2: PICKUP (Lime Card) */}
        <div className="relative bg-[#E8F89C] rounded-[2.5rem] p-8 h-[380px] flex flex-col justify-between shadow-xl hover:-translate-y-2 transition-transform duration-500 group z-10">
            {/* Number Pill */}
            <div className="self-start px-4 py-2 bg-white/40 backdrop-blur-sm rounded-full border border-white/20 text-[#1a4032] font-bold text-sm">
                Step 02
            </div>

            {/* Icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 backdrop-blur-sm">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm text-[#1a4032]">
                    <Truck size={36} />
                </div>
                 {/* Decorative Ring */}
                 <div className="absolute inset-0 border border-white/30 rounded-full scale-125 border-dashed animate-[spin_10s_linear_infinite_reverse]"></div>
            </div>

            {/* Content */}
            <div className="text-center z-10 mt-20">
                <h3 className="text-xl font-bold text-[#1a4032] mb-2">Smart Pickup</h3>
                <p className="text-sm text-[#1a4032]/80 font-medium leading-relaxed">
                    Our specialized trucks follow AI-optimized routes to collect waste efficiently.
                </p>
            </div>

             {/* BEAUTIFUL CONNECTOR ARROW (Desktop Only) */}
             <div className="hidden md:flex absolute top-1/2 -right-6 z-30 w-12 h-12 bg-[#1a4032] rounded-full items-center justify-center text-white shadow-xl border-4 border-[#E8F89C] transition-transform hover:scale-110">
                <ArrowRight size={20} />
            </div>
        </div>


        {/* STEP 3: RECYCLE (Dark Green Card) */}
        <div className="relative bg-[#1a4032] rounded-[2.5rem] p-8 h-[380px] flex flex-col justify-between shadow-2xl hover:-translate-y-2 transition-transform duration-500 group z-10 text-white">
            {/* Number Pill */}
            <div className="self-start px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 text-[#C3F53C] font-bold text-sm">
                Step 03
            </div>

            {/* Icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <div className="w-20 h-20 bg-[#C3F53C] rounded-full flex items-center justify-center shadow-lg shadow-lime-500/20 text-[#1a4032]">
                    <Recycle size={36} />
                </div>
                 {/* Decorative Ring */}
                 <div className="absolute inset-0 border border-[#C3F53C]/30 rounded-full scale-125 border-dashed animate-[spin_10s_linear_infinite]"></div>
            </div>

            {/* Content */}
            <div className="text-center z-10 mt-20">
                <h3 className="text-xl font-bold text-white mb-2">Earn & Recycle</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                    Waste is processed into raw materials, and you get paid instantly.
                </p>
            </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;