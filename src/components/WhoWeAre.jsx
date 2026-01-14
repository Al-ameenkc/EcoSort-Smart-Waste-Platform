import React from 'react';

const WhoWeAre = () => {
  return (
    // INCREASED: mt-20 -> mt-32 (128px top margin)
    <section className="relative h-[60vh] min-h-[400px] flex items-center mt-22">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=2070&auto=format&fit=crop" 
            alt="Volunteers recycling" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Text Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-white w-full">
          <span className="block text-lg font-medium mb-2 opacity-90 tracking-wide">
            Recycling for a Greener Planet
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Who We Are
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl leading-relaxed opacity-90 font-light">
            KanemWaste is dedicated to reducing landfill waste and protecting our planet by transforming discarded plastic into reusable resources.
          </p>
        </div>
    </section>
  );
};

export default WhoWeAre;