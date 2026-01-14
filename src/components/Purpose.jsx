import React from 'react';
import { Recycle } from 'lucide-react';

const Purpose = () => {
  const benefits = [
    "Conservation of Natural Resources",
    "Promotion of Sustainable Practices",
    "Energy Savings and Economic Benefits",
    "Reduction of Environmental Pollution"
  ];

  return (
    <section className="py-12 px-6 max-w-[1400px] mx-auto">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* --- LEFT COLUMN: TEXT CONTENT --- */}
        <div>
           <h2 className="text-3xl md:text-4xl font-medium text-slate-900 leading-[1.2] tracking-tight mb-4">
             Understanding the Purpose and <br className="hidden md:block"/>
             <span className="relative inline-block">
                Necessity of Recycling
                <span className="absolute bottom-1 left-0 w-full h-2 bg-[#E8F89C] -z-10 transform -rotate-1 rounded-full opacity-60"></span>
             </span>
           </h2>

           <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-6 max-w-lg">
             Recycling plays a critical role in conserving natural resources, reducing landfill waste, and minimizing environmental pollution. By transforming used materials into new products, recycling helps decrease the need for raw materials, thereby saving energy and reducing greenhouse gas emissions.
           </p>

           <ul className="space-y-3">
             {benefits.map((item, index) => (
               <li key={index} className="flex items-center gap-3 group cursor-default">
                 <div className="w-8 h-8 rounded-full bg-[#F9FBF6] border border-slate-100 flex items-center justify-center text-green-600 group-hover:bg-[#C3F53C] group-hover:text-black group-hover:scale-110 transition-all duration-300 shadow-sm">
                    <Recycle size={14} />
                 </div>
                 <span className="text-slate-700 font-medium text-sm md:text-base group-hover:text-slate-900 transition-colors">
                    {item}
                 </span>
               </li>
             ))}
           </ul>
        </div>


        {/* --- RIGHT COLUMN: IMAGE COMPOSITION --- */}
        <div className="relative h-[400px] w-full flex justify-end mt-8 lg:mt-0 mb-8 lg:mb-0">
           
           {/* IMAGE 1: Main (Tall Vertical) */}
           <div className="w-[85%] md:w-[70%] h-full rounded-[2rem] overflow-hidden shadow-xl relative z-0 group">
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb77c335?q=80&w=1974&auto=format&fit=crop" 
                alt="Girl Recycling" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
           </div>

           {/* IMAGE 2: Overlapping (Small Landscape) */}
           {/* CHANGES: Height increased, width reduced, moved down */}
           <div className="absolute bottom-[-20px] left-0 md:left-8 w-[50%] h-[180px] rounded-[1.5rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.15)] z-10 border-[5px] border-white group">
               <img 
                 src="https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=2070&auto=format&fit=crop" 
                 alt="Community Cleanup" 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
               />
           </div>

           {/* DECORATION */}
           <div className="absolute top-4 right-[-10px] w-24 h-24 bg-[#E8F89C]/50 rounded-full blur-2xl -z-10"></div>

        </div>

      </div>
    </section>
  );
};

export default Purpose;