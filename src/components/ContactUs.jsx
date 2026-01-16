import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { Phone, Mail, MapPin, MessageCircle, ChevronDown, ExternalLink, X } from 'lucide-react';

const ContactUs = ({ mobilePosition = false, variant = 'pill', listenToGlobal = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const dropdownRef = useRef(null);

  // --- GLOBAL LISTENER ---
  useEffect(() => {
    if (!listenToGlobal) return;

    const handleGlobalTrigger = () => {
      if (dropdownRef.current && dropdownRef.current.offsetParent === null) {
        return; 
      }
      setIsOpen(true);
    };

    window.addEventListener('toggle-nav-contact', handleGlobalTrigger);
    return () => window.removeEventListener('toggle-nav-contact', handleGlobalTrigger);
  }, [listenToGlobal]);

  // --- ANIMATION LIFECYCLE ---
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false); 
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // --- CLICK OUTSIDE ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!mobilePosition && variant === 'pill' && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobilePosition, variant]);

  // --- CONTENT RENDERER ---
  const Content = () => (
    <div className="flex flex-col">
        <ContactItem icon={Mail} label="Email" value="pickup@kanemwaste.com" actionLabel="Mail Us" link="mailto:pickup@kanemwaste.com" />
        <div className="h-px bg-slate-100 mx-3 my-1"></div>
        <ContactItem icon={Phone} label="Phone" value="+234 800 KANEM" actionLabel="Call Us" link="tel:+23480052636" />
        <div className="h-px bg-slate-100 mx-3 my-1"></div>
        <ContactItem icon={MessageCircle} label="WhatsApp" value="+234 800 KANEM" actionLabel="Chat Us" link="https://wa.me/23480052636" />
        <div className="h-px bg-slate-100 mx-3 my-1"></div>
        <ContactItem icon={MapPin} label="Location" value="Maiduguri, Borno State" actionLabel="Visit Us" link="https://maps.google.com" />
    </div>
  );

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      
      {/* --- TRIGGER BUTTON --- */}
      {variant === 'pill' ? (
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`
                flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full font-semibold text-sm transition-all duration-300 group border
                ${isOpen 
                    ? 'bg-[#1a4032] text-white border-[#1a4032]' 
                    : 'bg-white/30 backdrop-blur-md border-white/40 text-slate-900 hover:bg-[#1a4032] hover:text-white hover:border-[#1a4032]' 
                }
            `}
        >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                <Phone size={14} className={`text-[#1a4032] transition-transform duration-300 ${isOpen ? 'rotate-12' : 'group-hover:rotate-12'}`} />
            </div>
            <span>Contact Us</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      ) : (
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`hover:text-green-600 transition-colors flex items-center gap-1 group text-left ${isOpen ? 'text-green-700 font-medium' : ''}`}
        >
            Contact Us
        </button>
      )}

      {/* --- MENU DISPLAY --- */}
      {isRendered && (
        <>
            {/* MOBILE/POPUP MODE */}
            {(mobilePosition || variant === 'link') ? (
                createPortal(
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <div 
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" 
                            onClick={() => setIsOpen(false)}
                        ></div>
                        
                        <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in slide-in-from-bottom-4 duration-300">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-[#1a4032] text-white">
                                <span className="font-bold text-lg">Contact Us</span>
                                <button onClick={() => setIsOpen(false)} className="p-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="p-2">
                                <Content />
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            ) : (
                /* DESKTOP DROPDOWN MODE */
                <div className="absolute right-0 top-full mt-4 w-[340px] bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300 origin-top z-50">
                    <Content />
                </div>
            )}
        </>
      )}
    </div>
  );
};

// --- UPDATED HELPER COMPONENT (New Colors) ---
const ContactItem = ({ icon: Icon, label, value, actionLabel, link }) => (
    <div className="p-3 hover:bg-[#C3F53C] rounded-xl transition-colors group/item">
        <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
                {/* ICON CIRCLE: Default (Light Green) -> Hover (White) */}
                {/* ICON: Always Dark Green */}
                <div className="w-8 h-8 rounded-full bg-[#1a4032]/10 text-[#1a4032] group-hover/item:bg-white flex items-center justify-center transition-colors">
                    <Icon size={16} />
                </div>
                
                {/* Label: Default (Slate) -> Hover (Darker Slate/Black for contrast on Lemon) */}
                <span className="text-xs font-bold text-slate-500 group-hover/item:text-[#1a4032]/80 uppercase tracking-wider transition-colors">{label}</span>
            </div>
            
            {/* ACTION BUTTON: Default (Lemon) -> Hover (Dark Green + White Text) */}
            <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-3 py-1.5 bg-[#C3F53C] text-[#1a4032] group-hover/item:bg-[#1a4032] group-hover/item:text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1 shadow-sm"
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