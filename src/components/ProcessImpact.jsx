import React from 'react';
// 1. IMPORT THE LOCAL IMAGE
import impactImg from '../assets/impact.jpg';

const ProcessImpact = () => {
  return (
    // Reduced padding: py-12 -> py-8
    <section className="py-8 px-6 max-w-7xl mx-auto">
      
      {/* Reduced gap: gap-12 -> gap-8 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        
        {/* --- LEFT COLUMN: PROCESS --- */}
        <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Reduced Header: text-3xl -> text-2xl */}
            <h2 className="text-2xl font-bold text-slate-900 mb-4 inline-block relative">
                Process
                <span className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-10 h-1 bg-[#E8F89C] rounded-full"></span>
            </h2>

            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                At KanemWaste, we employ state-of-the-art technology and environmentally-friendly methods to recycle plastic waste efficiently. Our process includes:
            </p>

            {/* Reduced spacing: space-y-4 -> space-y-3 */}
            <ul className="space-y-3 text-left">
                <li className="text-sm text-slate-600">
                    <strong className="text-slate-900 block mb-0.5">Collection:</strong> 
                    Partnering with local communities, businesses, and organizations to gather plastic waste.
                </li>
                <li className="text-sm text-slate-600">
                    <strong className="text-slate-900 block mb-0.5">Sorting:</strong> 
                    Using advanced sorting systems to separate different types of plastics.
                </li>
                <li className="text-sm text-slate-600">
                    <strong className="text-slate-900 block mb-0.5">Cleaning:</strong> 
                    Thoroughly cleaning the collected plastics to remove any contaminants.
                </li>
                <li className="text-sm text-slate-600">
                    <strong className="text-slate-900 block mb-0.5">Processing:</strong> 
                    Breaking down the plastics into raw materials that can be reused.
                </li>
            </ul>
        </div>


        {/* --- CENTER COLUMN: IMAGE --- */}
        {/* Reduced Height: h-[500px] -> h-[400px] */}
        <div className="h-[400px] w-full rounded-[2rem] overflow-hidden shadow-xl order-1 lg:order-2 relative group">
            {/* 2. USE THE IMPORTED VARIABLE HERE */}
            <img 
                src={impactImg} 
                alt="Recycling Facility Process" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
        </div>


        {/* --- RIGHT COLUMN: IMPACT --- */}
        <div className="text-center lg:text-left order-3">
            {/* Reduced Header: text-3xl -> text-2xl */}
            <h2 className="text-2xl font-bold text-slate-900 mb-4 inline-block relative">
                Impact
                <span className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-10 h-1 bg-[#E8F89C] rounded-full"></span>
            </h2>

            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                KanemWaste is proud of the positive impact we have made on the environment and our communities. Since our inception, we have:
            </p>

            {/* Reduced spacing: space-y-3 -> space-y-2 */}
            <ul className="space-y-2 mb-6 text-left list-disc pl-5 marker:text-green-500">
                <li className="text-sm text-slate-600">
                    Recycled over millions of tons of plastic waste.
                </li>
                <li className="text-sm text-slate-600">
                    Reduced carbon emissions by 1,000 metric tons.
                </li>
                <li className="text-sm text-slate-600">
                    Created 500+ jobs in local communities.
                </li>
                <li className="text-sm text-slate-600">
                    Educated thousands of individuals about the importance of recycling.
                </li>
            </ul>

            <p className="text-slate-500 text-xs md:text-sm leading-relaxed italic border-l-4 border-[#C3F53C] pl-4 text-left">
                "Our efforts have not only contributed to a cleaner environment but have also promoted sustainable practices and raised awareness about the critical issue of plastic pollution."
            </p>
        </div>

      </div>
    </section>
  );
};

export default ProcessImpact;