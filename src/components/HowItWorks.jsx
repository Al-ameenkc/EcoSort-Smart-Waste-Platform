import React from 'react';
import { Truck, Recycle, Trash2 } from 'lucide-react';

const steps = [
  {
    id: 1,
    number: "01",
    title: "Dispose of plastic waste",
    desc: "To drop plastic waste in a recycling bin, gather your plastic items. Locate a nearby recycling bin designated for plastics.",
    icon: <Trash2 size={40} className="text-green-600" />,
    color: "bg-green-50"
  },
  {
    id: 2,
    number: "02",
    title: "Plastic waste is picked up",
    desc: "The plastic waste is picked up by recycling trucks with specialized bins following designated routes to the factory.",
    icon: <Truck size={40} className="text-yellow-600" />,
    color: "bg-yellow-50"
  },
  {
    id: 3,
    number: "03",
    title: "Plastic waste recycled",
    desc: "The plastic waste is then recycled into new materials through various processes such as melting, extrusion, and molding.",
    icon: <Recycle size={40} className="text-emerald-600" />,
    color: "bg-emerald-50"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-6 max-w-[1400px] mx-auto bg-white">
      
      {/* --- SECTION HEADER --- */}
      <div className="text-center mb-20">
        <span className="inline-block px-4 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider">
           Process
        </span>
        <h2 className="text-3xl md:text-5xl font-medium text-slate-900">
           How it <span className="bg-[#E8F89C] px-2 rounded-lg inline-block transform -rotate-1">works</span>
        </h2>
      </div>

      {/* --- STEPS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
        
        {/* DOTTED LINE CONNECTOR (Hidden on mobile) */}
        <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-[2px] border-t-2 border-dashed border-slate-200 -z-10"></div>

        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center text-center group">
            
            {/* NUMBER BUBBLE */}
            <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-sm font-bold text-slate-500 mb-8 shadow-sm group-hover:scale-110 group-hover:border-green-400 group-hover:text-green-600 transition-all duration-300">
                {step.number}
            </div>

            {/* ILLUSTRATION CIRCLE */}
            <div className={`w-40 h-40 rounded-full ${step.color} flex items-center justify-center mb-8 relative overflow-hidden transition-transform duration-500 group-hover:-translate-y-2`}>
                {/* Abstract Background Shapes */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                
                {/* Main Icon/Illustration */}
                <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                   {step.icon}
                </div>
            </div>

            {/* TEXT CONTENT */}
            <h3 className="text-xl font-bold text-slate-900 mb-4">
                {step.title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                {step.desc}
            </p>

          </div>
        ))}

      </div>
    </section>
  );
};

export default HowItWorks;