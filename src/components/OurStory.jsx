import React from 'react';

const OurStory = () => {
  return (
    // Reduced padding: py-20 -> py-12
    <section className="py-12 px-6 max-w-7xl mx-auto">
      {/* Reduced gap: gap-16 -> gap-10 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* --- LEFT COLUMN: IMAGE GRID --- */}
        <div className="grid grid-cols-2 gap-3">
            {/* Image 1: Volunteers */}
            {/* Reduced Height: h-48/64 -> h-40/52 */}
            <div className="h-40 md:h-52 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img 
                    src="https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=2070&auto=format&fit=crop" 
                    alt="Volunteers cleaning field" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
            </div>
            {/* Image 2: Plastic Bottles */}
            <div className="h-40 md:h-52 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img 
                    src="https://images.unsplash.com/photo-1605600659908-0ef719419d41?q=80&w=2073&auto=format&fit=crop" 
                    alt="Plastic waste" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
            </div>
            {/* Image 3: Picking up trash */}
            <div className="h-40 md:h-52 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img 
                    src="https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?q=80&w=2070&auto=format&fit=crop" 
                    alt="Picking up trash" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
            </div>
            {/* Image 4: Plastic details */}
            <div className="h-40 md:h-52 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img 
                    src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop" 
                    alt="Recycled materials" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
            </div>
        </div>

        {/* --- RIGHT COLUMN: TEXT CONTENT --- */}
        <div className="flex flex-col justify-center">
            <div className="mb-6 text-center lg:text-left">
                {/* Reduced Heading: text-5xl -> text-4xl */}
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 inline-block relative">
                    Our Story
                    {/* Underline Decoration */}
                    <span className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 w-20 h-1 bg-slate-200 rounded-full"></span>
                </h2>
            </div>
            
            {/* Reduced Text Size & Spacing: text-lg -> text-base, space-y-6 -> space-y-4 */}
            <div className="space-y-4 text-slate-500 text-sm md:text-base leading-relaxed">
                <p>
                    KanemWaste began with a simple yet profound realization: the world is drowning in plastic waste, and something had to be done. Founded by a group of environmentally-conscious individuals, our journey started with a shared commitment to reduce plastic pollution and create a sustainable future. 
                </p>
                <p>
                    What began as a small local initiative quickly grew into a pioneering recycling enterprise, dedicated to transforming plastic waste into valuable resources.
                </p>
                <p>
                    Driven by innovation and a passion for the environment, KanemWaste has evolved into a leader in the plastic recycling industry. Our team tirelessly works to develop cutting-edge technologies and eco-friendly processes that not only recycle plastic but also educate and inspire communities to take action. 
                </p>
                <p className="font-medium text-slate-900">
                    Together, we are making a tangible difference, one recycled plastic piece at a time, fostering a cleaner and greener planet for generations to come.
                </p>
            </div>
        </div>

      </div>
    </section>
  );
};

export default OurStory;