import React, { useState, useRef, useEffect } from 'react';
import { Phone, Mail, MapPin, MessageCircle, ChevronDown, ExternalLink } from 'lucide-react';

const ContactUs = () => {
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
    <div className="relative" ref={dropdownRef}>
      
      {/* --- TRIGGER BUTTON (Updated Style) --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
            flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full font-semibold text-sm transition-all duration-300 group border
            ${isOpen 
                ? 'bg-[#1a4032] text-white border-[#1a4032]' // Active State
                : 'bg-white/30 backdrop-blur-md border-white/40 text-slate-900 hover:bg-[#1a4032] hover:text-white hover:border-[#1a4032]' // Inactive State
            }
        `}
      >
        {/* ICON CIRCLE (White Background) */}
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
             {/* Icon stays dark so it contrasts with the white circle */}
             <Phone size={14} className={`text-[#1a4032] transition-transform duration-300 ${isOpen ? 'rotate-12' : 'group-hover:rotate-12'}`} />
        </div>

        <span>Contact Us</span>
        
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* --- DROPDOWN MENU --- */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-4 w-[340px] bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200 z-50 overflow-hidden">
            
            {/* 1. EMAIL */}
            <ContactItem 
                icon={Mail} 
                label="Email" 
                value="pickup@kanemwaste.com" 
                actionLabel="Mail Us" 
                link="mailto:pickup@kanemwaste.com"
            />

            <div className="h-px bg-slate-100 mx-3 my-1"></div>

            {/* 2. PHONE */}
            <ContactItem 
                icon={Phone} 
                label="Phone" 
                value="+234 800 KANEM" 
                actionLabel="Call Us" 
                link="tel:+23480052636"
            />

            <div className="h-px bg-slate-100 mx-3 my-1"></div>

            {/* 3. WHATSAPP */}
            <ContactItem 
                icon={MessageCircle} 
                label="WhatsApp" 
                value="+234 800 KANEM" 
                actionLabel="Chat Us" 
                link="https://wa.me/23480052636"
            />

            <div className="h-px bg-slate-100 mx-3 my-1"></div>

            {/* 4. LOCATION */}
            <ContactItem 
                icon={MapPin} 
                label="Location" 
                value="Maiduguri, Borno State" 
                actionLabel="Visit Us" 
                link="https://maps.google.com"
            />

        </div>
      )}
    </div>
  );
};

// --- HELPER COMPONENT ---
const ContactItem = ({ icon: Icon, label, value, actionLabel, link }) => (
    <div className="p-3 hover:bg-slate-50 rounded-xl transition-colors group/item">
        <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1a4032]/10 text-[#1a4032] flex items-center justify-center">
                    <Icon size={16} />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
            </div>
            
            <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-3 py-1.5 bg-[#C3F53C] hover:bg-[#b2e32b] text-[#1a4032] text-xs font-bold rounded-full transition-colors flex items-center gap-1 shadow-sm"
            >
                {actionLabel} <ExternalLink size={10} />
            </a>
        </div>
        <p className="pl-11 text-sm font-medium text-slate-900 leading-tight">
            {value}
        </p>
    </div>
);

export default ContactUs;