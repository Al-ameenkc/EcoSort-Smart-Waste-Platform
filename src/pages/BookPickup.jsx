import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Phone, Upload, Map as MapIcon, User, CheckCircle, Crosshair, ChevronDown, Trash2, Scale, Hash } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

// --- CUSTOM HELPER COMPONENT FOR GLASSY DROPDOWNS ---
const GlassDropdown = ({ label, icon: Icon, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-1 relative" ref={dropdownRef}>
      <label className="text-sm font-bold text-slate-800">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`
            relative w-full pl-10 pr-4 py-3 cursor-pointer
            bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl 
            flex items-center justify-between
            transition-all duration-200 shadow-sm
            ${isOpen ? 'ring-2 ring-green-600 bg-white/70' : 'hover:bg-white/50'}
        `}
      >
        <Icon size={18} className="absolute left-3 text-slate-700" />
        <span className={`text-sm font-medium ${selected ? 'text-slate-900' : 'text-slate-500'}`}>
            {selected || placeholder}
        </span>
        <ChevronDown 
            size={18} 
            className={`text-slate-700 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>

      {/* Dropdown Menu with Guaranteed Animation */}
      {isOpen && (
        <>
            <style>{`
                @keyframes dropdownPop {
                    from { opacity: 0; transform: scale(0.95) translateY(-10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-dropdown {
                    animation: dropdownPop 0.2s ease-out forwards;
                }
            `}</style>
            <div className="absolute z-50 w-full mt-2 bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl shadow-2xl overflow-hidden animate-dropdown origin-top">
                <div className="max-h-60 overflow-y-auto py-2">
                    {options.map((option, index) => (
                        <div 
                            key={index}
                            onClick={() => {
                                setSelected(option);
                                setIsOpen(false);
                            }}
                            className="px-4 py-3 text-sm font-medium text-slate-700 hover:bg-green-50 hover:text-green-800 cursor-pointer transition-colors flex items-center gap-2"
                        >
                            {selected === option && <CheckCircle size={14} className="text-green-600" />}
                            {option}
                        </div>
                    ))}
                </div>
            </div>
        </>
      )}
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const BookPickup = () => {
  return (
    <PageWrapper>
      <div className="min-h-screen pt-24 bg-slate-50 flex flex-col">
        
        {/* --- MAIN SECTION: MAP BACKGROUND & FORM --- */}
        <div className="relative flex-1 flex items-center justify-center p-4 md:p-10 min-h-[800px]">
          
          {/* Background Map Image */}
          <div className="absolute inset-0 z-0 overflow-hidden">
               <img 
                 src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" 
                 alt="City Map Background" 
                 className="w-full h-full object-cover opacity-60 grayscale-[30%]"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/40 to-white/10"></div>
          </div>

          {/* --- GLASS CARD CONTAINER --- */}
          <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-5 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/40">
              
              {/* LEFT SIDE: INFO (Dark Glass) */}
              <div className="hidden lg:flex lg:col-span-2 bg-[#1a4032]/95 backdrop-blur-xl p-10 flex-col justify-between text-white relative">
                  <div className="absolute top-[-10%] right-[-20%] w-64 h-64 bg-[#C3F53C]/10 rounded-full blur-3xl"></div>
                  
                  <div className="relative z-10">
                      <span className="inline-block px-3 py-1 rounded-full border border-white/20 text-xs font-medium mb-6 text-[#C3F53C]">
                          Logistics
                      </span>
                      <h2 className="text-4xl font-bold leading-tight mb-4">
                          Schedule a <br/> <span className="text-[#C3F53C]">Pickup</span>
                      </h2>
                      <p className="text-slate-300 text-sm leading-relaxed mb-8">
                          Submit your request and our AI logistics team will verify your waste and contact you for the best pickup time.
                      </p>

                      {/* Mini Steps */}
                      <div className="space-y-6">
                          <div className="flex gap-4">
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#C3F53C]">1</div>
                              <div>
                                  <h4 className="font-bold text-sm">Fill Details</h4>
                                  <p className="text-xs text-slate-400">Location & Waste type</p>
                              </div>
                          </div>
                          <div className="flex gap-4">
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#C3F53C]">2</div>
                              <div>
                                  <h4 className="font-bold text-sm">We Verify</h4>
                                  <p className="text-xs text-slate-400">Our team confirms quantity</p>
                              </div>
                          </div>
                          <div className="flex gap-4">
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#C3F53C]">3</div>
                              <div>
                                  <h4 className="font-bold text-sm">Pickup Scheduled</h4>
                                  <p className="text-xs text-slate-400">Driver assigned to you</p>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="relative z-10 text-xs text-slate-400 mt-10">
                      Questions? Call +234 800 KANEM
                  </div>
              </div>

              {/* RIGHT SIDE: THE FORM (Transparent Glass) */}
              <div className="lg:col-span-3 p-8 md:p-12 bg-white/30 backdrop-blur-md border-l border-white/20">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 drop-shadow-sm">Pickup Details</h3>
                  
                  <form className="space-y-6">
                      
                      {/* SECTION 1: CONTACT & LOCATION */}
                      <div className="space-y-4">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Contact & Location</h4>
                          
                          {/* Name & Phone */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                  <label className="text-sm font-bold text-slate-800">Full Name</label>
                                  <div className="relative group">
                                      <User size={18} className="absolute left-3 top-3.5 text-slate-700" />
                                      <input type="text" placeholder="John Doe" className="w-full pl-10 pr-4 py-3 bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white/70 transition-all text-sm font-medium placeholder:text-slate-500 text-slate-900 shadow-sm" />
                                  </div>
                              </div>
                              <div className="space-y-1">
                                  <label className="text-sm font-bold text-slate-800">Phone Number</label>
                                  <div className="relative group">
                                      <Phone size={18} className="absolute left-3 top-3.5 text-slate-700" />
                                      <input type="tel" placeholder="+234..." className="w-full pl-10 pr-4 py-3 bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white/70 transition-all text-sm font-medium placeholder:text-slate-500 text-slate-900 shadow-sm" />
                                  </div>
                              </div>
                          </div>

                          {/* Live Address Input */}
                          <div className="space-y-1">
                              <label className="text-sm font-bold text-slate-800">Pickup Address</label>
                              <div className="relative flex items-center group">
                                  <MapPin size={18} className="absolute left-3 text-slate-700 z-10" />
                                  <input type="text" placeholder="Street Name, House No." className="w-full pl-10 pr-40 py-3 bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white/70 transition-all text-sm font-medium placeholder:text-slate-500 text-slate-900 shadow-sm" />
                                  
                                  {/* "Locate Me" Button */}
                                  <button type="button" className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#C3F53C] hover:bg-[#b2e32b] text-[#1a4032] text-sm font-bold rounded-lg flex items-center gap-2 transition-all shadow-md border border-[#aadd2a] hover:scale-[1.02]">
                                      <Crosshair size={16} />
                                      Locate Me
                                  </button>
                              </div>
                          </div>

                          {/* Landmark */}
                          <div className="space-y-1">
                              <label className="text-sm font-bold text-slate-800">Nearest Landmark</label>
                              <div className="relative group">
                                  <MapIcon size={18} className="absolute left-3 top-3.5 text-slate-700" />
                                  <input type="text" placeholder="e.g. Behind Zenith Bank" className="w-full pl-10 pr-4 py-3 bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white/70 transition-all text-sm font-medium placeholder:text-slate-500 text-slate-900 shadow-sm" />
                              </div>
                          </div>
                      </div>

                      <div className="h-px bg-slate-600/10 w-full my-6"></div>

                      {/* SECTION 2: INVENTORY */}
                      <div className="space-y-4">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Inventory</h4>
                          
                          <div className="grid grid-cols-1 gap-4">
                              
                              <GlassDropdown 
                                  label="Waste Type"
                                  icon={Trash2}
                                  placeholder="Select Type..."
                                  options={[
                                      "Plastic Bottles (PET)",
                                      "Cartons / Paper",
                                      "Cans / Metals",
                                      "Mixed Recyclables"
                                  ]}
                              />

                              <div className="grid grid-cols-3 gap-4">
                                  <div className="col-span-2">
                                      <GlassDropdown 
                                          label="Bag Size / Type"
                                          icon={Scale}
                                          placeholder="Select Size..."
                                          options={[
                                              "Full Trash Bag",
                                              "Large Sack (Rice Bag)",
                                              "Pickup Truck Load"
                                          ]}
                                      />
                                  </div>
                                  <div className="col-span-1 space-y-1">
                                      <label className="text-sm font-bold text-slate-800">Count</label>
                                      <div className="relative group">
                                          <Hash size={18} className="absolute left-3 top-3.5 text-slate-700" />
                                          <input 
                                              type="number" 
                                              min="1" 
                                              defaultValue="1"
                                              className="w-full pl-10 pr-4 py-3 bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white/70 transition-all text-sm font-medium text-slate-900 shadow-sm" 
                                          />
                                      </div>
                                  </div>
                              </div>

                          </div>

                          <div className="space-y-1">
                              <label className="text-sm font-bold text-slate-800">Upload Photo <span className="text-slate-500 font-normal text-xs">(Optional)</span></label>
                              <div className="border-2 border-dashed border-slate-400/50 bg-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/40 hover:border-green-600 transition-all cursor-pointer group backdrop-blur-sm">
                                  <Upload size={28} className="text-slate-600 group-hover:text-green-700 mb-2 transition-colors" />
                                  <p className="text-xs text-slate-700 font-bold">Click to upload or drag and drop</p>
                              </div>
                          </div>
                      </div>

                      {/* SUBMIT BUTTON */}
                      <button className="w-full bg-[#1a4032] hover:bg-[#143328] text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-[1.01] mt-6 flex items-center justify-center gap-2 relative overflow-hidden group">
                          <span className="relative z-10 flex items-center gap-2">
                             Submit Request <CheckCircle size={20} className="text-[#C3F53C]" />
                          </span>
                          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      </button>

                  </form>
              </div>

          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default BookPickup;