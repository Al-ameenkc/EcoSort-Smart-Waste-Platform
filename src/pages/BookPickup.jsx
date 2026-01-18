import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Phone, Upload, Map as MapIcon, User, CheckCircle, Crosshair, ChevronDown, Trash2, Scale, Hash, Loader2, X } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import imageCompression from 'browser-image-compression';
import emailjs from '@emailjs/browser'; // <--- 1. Import EmailJS

// --- CUSTOM HELPER FOR BASE64 ---
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const GlassDropdown = ({ label, icon: Icon, options, placeholder, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
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
            bg-white border border-slate-200 rounded-xl 
            flex items-center justify-between
            transition-all duration-200 shadow-sm
            ${isOpen ? 'ring-2 ring-green-600 border-green-600' : 'hover:border-green-400'}
        `}
      >
        <Icon size={18} className="absolute left-3 text-slate-900" />
        <span className={`text-sm font-medium ${value ? 'text-slate-900' : 'text-slate-500'}`}>
            {value || placeholder}
        </span>
        <ChevronDown size={18} className={`text-slate-900 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
            <div className="max-h-60 overflow-y-auto py-2">
                {options.map((option, index) => (
                    <div 
                        key={index}
                        onClick={() => { onChange(option); setIsOpen(false); }}
                        className="px-4 py-3 text-sm font-medium text-slate-700 hover:bg-green-50 hover:text-green-800 cursor-pointer transition-colors flex items-center gap-2"
                    >
                        {value === option && <CheckCircle size={14} className="text-green-600" />}
                        {option}
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

const BookPickup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    landmark: '',
    wasteType: '',
    bagSize: '',
    count: 1
  });

  const [imageFile, setImageFile] = useState(null); 
  const [imagePreview, setImagePreview] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleDropdownChange = (name, value) => setFormData({ ...formData, [name]: value });

  // --- UPDATED: HIGH ACCURACY LOCATION ---
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    setIsLocating(true);

    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();

                if (data && data.display_name) {
                    setFormData(prev => ({
                        ...prev,
                        address: data.display_name 
                    }));
                } else {
                    alert("Could not fetch address details.");
                }
            } catch (error) {
                console.error("Geocoding error:", error);
                alert("Failed to get address. Please type it manually.");
            } finally {
                setIsLocating(false);
            }
        },
        (error) => {
            console.error("Geolocation error:", error);
            alert("Unable to retrieve location. Please check your GPS settings.");
            setIsLocating(false);
        },
        options 
    );
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
        setIsCompressing(true); 
        try {
            const options = {
                maxSizeMB: 0.2, 
                maxWidthOrHeight: 800,
                useWebWorker: true
            };
            const compressedFile = await imageCompression(file, options);
            setImageFile(compressedFile);
            setImagePreview(URL.createObjectURL(compressedFile));
        } catch (error) {
            console.error("Compression failed:", error);
            setImageFile(file); 
            setImagePreview(URL.createObjectURL(file));
        }
        setIsCompressing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!formData.fullName || !formData.phone || !formData.address || !formData.wasteType) {
        alert("Please fill in all required fields.");
        return;
    }

    setIsSubmitting(true);

    try {
        let imageUrl = "";
        
        if (imageFile) {
            imageUrl = await convertToBase64(imageFile);
        }

        // 2. Prepare Data for Email
        // We need to map your formData keys to the Template Variable names you set in EmailJS
        const emailParams = {
            user_name: formData.fullName,
            user_phone: formData.phone,
            user_address: formData.address + (formData.landmark ? ` (Landmark: ${formData.landmark})` : ''),
            waste_type: formData.wasteType,
            bag_size: formData.bagSize || "Not specified", // <--- Added fallback text
            count: formData.count,
            pickup_date: new Date().toLocaleDateString()
        };

        // 3. Send to Firebase (Keep this!)
        await addDoc(collection(db, "pickups"), {
            ...formData,
            imageUrl: imageUrl, 
            status: "Pending",
            createdAt: serverTimestamp()
        });

        // 4. Send Email via EmailJS (New Addition!)
        console.log("📨 Sending these params to EmailJS:", emailParams); 

        await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            emailParams, // <--- We send the params object, NOT the formRef
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );

        alert("Request Submitted Successfully! 🚛 We have received your order.");
        
        setFormData({ fullName: '', phone: '', address: '', landmark: '', wasteType: '', bagSize: '', count: 1 });
        setImageFile(null);
        setImagePreview(null);

    } catch (error) {
        console.error("Error submitting:", error);
        alert("Submission failed. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <PageWrapper>
      <div className="min-h-screen pt-24 bg-slate-50 flex flex-col">
        
        <div className="relative flex-1 flex items-center justify-center p-4 md:p-10 min-h-[800px]">
          
          <div className="absolute inset-0 z-0 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" alt="City Map" className="w-full h-full object-cover opacity-60 grayscale-[30%]" />
               <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/40 to-white/10"></div>
          </div>

          <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-5 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/40">
              
              <div className="hidden lg:flex lg:col-span-2 bg-[#1a4032]/95 backdrop-blur-xl p-10 flex-col justify-between text-white relative">
                  <div className="absolute top-[-10%] right-[-20%] w-64 h-64 bg-[#C3F53C]/10 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                      <span className="inline-block px-3 py-1 rounded-full border border-white/20 text-xs font-medium mb-6 text-[#C3F53C]">Logistics</span>
                      <h2 className="text-4xl font-bold leading-tight mb-4">Schedule a <br/> <span className="text-[#C3F53C]">Pickup</span></h2>
                      <p className="text-slate-300 text-sm leading-relaxed mb-8">Submit your request and our AI logistics team will verify your waste.</p>
                      
                      <div className="space-y-6">
                          <div className="flex gap-4"><div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#C3F53C]">1</div><div><h4 className="font-bold text-sm">Fill Details</h4><p className="text-xs text-slate-400">Location & Waste type</p></div></div>
                          <div className="flex gap-4"><div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#C3F53C]">2</div><div><h4 className="font-bold text-sm">We Verify</h4><p className="text-xs text-slate-400">Confirm quantity</p></div></div>
                          <div className="flex gap-4"><div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#C3F53C]">3</div><div><h4 className="font-bold text-sm">Pickup Scheduled</h4><p className="text-xs text-slate-400">Driver assigned</p></div></div>
                      </div>
                  </div>
                  <div className="relative z-10 text-xs text-slate-400 mt-10">Questions? Call +234 800 KANEM</div>
              </div>

              <div className="lg:col-span-3 p-8 md:p-12 bg-white/40 backdrop-blur-md border-l border-white/20">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 drop-shadow-sm">Pickup Details</h3>
                  
                  <form className="space-y-6" onSubmit={handleSubmit}>
                      
                      <div className="space-y-4">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Contact & Location</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                  <label className="text-sm font-bold text-slate-800">Full Name</label>
                                  <div className="relative group"><User size={18} className="absolute left-3 top-3.5 text-slate-900" /><input name="fullName" value={formData.fullName} onChange={handleChange} type="text" placeholder="John Doe" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition-all text-sm font-medium placeholder:text-slate-400 text-slate-900 shadow-sm" /></div>
                              </div>
                              <div className="space-y-1">
                                  <label className="text-sm font-bold text-slate-800">Phone Number</label>
                                  <div className="relative group"><Phone size={18} className="absolute left-3 top-3.5 text-slate-900" /><input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="+234..." className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition-all text-sm font-medium placeholder:text-slate-400 text-slate-900 shadow-sm" /></div>
                              </div>
                          </div>
                          <div className="space-y-1">
                              <label className="text-sm font-bold text-slate-800">Pickup Address</label>
                              <div className="relative flex items-center group">
                                  <MapPin size={18} className="absolute left-3 text-slate-900 z-10" />
                                  <input 
                                    name="address" 
                                    value={formData.address} 
                                    onChange={handleChange} 
                                    type="text" 
                                    placeholder="Street Name, House No." 
                                    className="w-full pl-10 pr-40 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition-all text-sm font-medium placeholder:text-slate-400 text-slate-900 shadow-sm" 
                                  />
                                  
                                  <button 
                                    type="button" 
                                    onClick={handleLocateMe}
                                    disabled={isLocating}
                                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#C3F53C] hover:bg-[#b2e32b] text-[#1a4032] text-sm font-bold rounded-lg flex items-center gap-2 transition-all shadow-md border border-[#aadd2a] hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                                  >
                                      {isLocating ? <Loader2 size={16} className="animate-spin"/> : <Crosshair size={16} />}
                                      {isLocating ? "Locating..." : "Locate Me"}
                                  </button>
                              </div>
                          </div>
                          <div className="space-y-1">
                              <label className="text-sm font-bold text-slate-800">Nearest Landmark</label>
                              <div className="relative group"><MapIcon size={18} className="absolute left-3 top-3.5 text-slate-900" /><input name="landmark" value={formData.landmark} onChange={handleChange} type="text" placeholder="e.g. Behind Zenith Bank" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition-all text-sm font-medium placeholder:text-slate-400 text-slate-900 shadow-sm" /></div>
                          </div>
                      </div>

                      <div className="h-px bg-slate-200 w-full my-6"></div>

                      <div className="space-y-4">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Inventory</h4>
                          <div className="grid grid-cols-1 gap-4">
                              <GlassDropdown label="Waste Type" icon={Trash2} placeholder="Select Type..." value={formData.wasteType} onChange={(val) => handleDropdownChange('wasteType', val)} options={["Plastic Bottles (PET)", "Cartons / Paper", "Cans / Metals", "Mixed Recyclables"]} />
                              <div className="grid grid-cols-3 gap-4">
                                  <div className="col-span-2"><GlassDropdown label="Bag Size / Type" icon={Scale} placeholder="Select Size..." value={formData.bagSize} onChange={(val) => handleDropdownChange('bagSize', val)} options={["Full Trash Bag", "Large Sack (Rice Bag)", "Pickup Truck Load"]} /></div>
                                  <div className="col-span-1 space-y-1"><label className="text-sm font-bold text-slate-800">Count</label><div className="relative group"><Hash size={18} className="absolute left-3 top-3.5 text-slate-900" /><input name="count" value={formData.count} onChange={handleChange} type="number" min="1" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition-all text-sm font-medium text-slate-900 shadow-sm" /></div></div>
                              </div>
                          </div>

                          <div className="space-y-1">
                              <label className="text-sm font-bold text-slate-800">Upload Photo <span className="text-slate-500 font-normal text-xs">(Optional)</span></label>
                              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                              
                              {imagePreview ? (
                                <div className="relative w-full h-40 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-md"><X size={16} /></button>
                                </div>
                              ) : (
                                <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-slate-400/50 bg-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/40 hover:border-green-600 transition-all cursor-pointer group backdrop-blur-sm">
                                    {isCompressing ? <Loader2 className="animate-spin text-green-600 mb-2" /> : <Upload size={28} className="text-slate-600 group-hover:text-green-700 mb-2 transition-colors" />}
                                    <p className="text-xs text-slate-700 font-bold">{isCompressing ? "Optimizing..." : "Click to upload"}</p>
                                </div>
                              )}
                          </div>
                      </div>

                      <button type="submit" disabled={isSubmitting || isCompressing} className="w-full bg-[#1a4032] hover:bg-[#143328] text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-[1.01] mt-6 flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed">
                          <span className="relative z-10 flex items-center gap-2">
                             {isSubmitting ? (<>Processing... <Loader2 className="animate-spin" size={20} /></>) : (<>Submit Request <CheckCircle size={20} className="text-[#C3F53C]" /></>)}
                          </span>
                          {!isSubmitting && <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
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