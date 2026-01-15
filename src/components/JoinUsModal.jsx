import React from 'react';
import { X, User, Phone, MessageCircle, Heart } from 'lucide-react';

const JoinUsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 transition-colors z-20"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="bg-[#1a4032] p-8 text-center relative overflow-hidden">
            <div className="absolute top-[-50%] left-[-20%] w-48 h-48 bg-[#C3F53C]/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#C3F53C] backdrop-blur-md">
                    <Heart size={24} fill="currentColor" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Join the Movement</h2>
                <p className="text-slate-300 text-xs">Become a KanemWaste Volunteer</p>
            </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
            
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                    <User size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input type="text" placeholder="Your Name" className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-colors" />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
                <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input type="tel" placeholder="+234..." className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-colors" />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">WhatsApp Number</label>
                <div className="relative">
                    <MessageCircle size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input type="tel" placeholder="+234..." className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-colors" />
                </div>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
                <p className="text-xs text-green-800 font-medium">
                    You will hear from us within 48hrs of weekdays.
                </p>
            </div>

            <button className="w-full bg-[#1a4032] hover:bg-[#143328] text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-lg">
                Join Us
            </button>

        </div>

      </div>
    </div>
  );
};

export default JoinUsModal;