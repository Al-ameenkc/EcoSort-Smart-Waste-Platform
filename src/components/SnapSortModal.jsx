import React, { useRef } from 'react';
import { X, Upload, Camera, ScanLine } from 'lucide-react';

const SnapSortModal = ({ isOpen, onClose, onImageSelect }) => {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a fake URL for the uploaded image to display it immediately
      const imageUrl = URL.createObjectURL(file);
      onImageSelect(imageUrl);
    }
  };

  // Trigger hidden input
  const triggerInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors z-20"
        >
          <X size={20} />
        </button>

        <div className="bg-gradient-to-br from-[#1a4032] to-[#0f291e] p-8 text-center relative overflow-hidden">
            <div className="absolute top-[-50%] left-[-20%] w-64 h-64 bg-[#C3F53C]/20 rounded-full blur-3xl"></div>
            
            <div className="relative mx-auto w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10">
                <ScanLine size={40} className="text-[#C3F53C]" />
                <div className="absolute inset-0 border-t-2 border-[#C3F53C]/50 animate-[scan_2s_ease-in-out_infinite]"></div>
                <style>{`
                  @keyframes scan {
                    0% { top: 10%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 90%; opacity: 0; }
                  }
                `}</style>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Snap-Sort AI</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
                Not sure if an item is recyclable? Let our AI analyze it for you instantly.
            </p>
        </div>

        <div className="p-8 space-y-4">
            
            {/* HIDDEN FILE INPUT */}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
            />
            
            {/* Upload Button */}
            <button 
                onClick={triggerInput}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-green-500 hover:bg-green-50/50 transition-all group text-left"
            >
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-green-100 group-hover:text-green-700 transition-colors">
                    <Upload size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-900">Upload an Image</h4>
                    <p className="text-xs text-slate-500">Choose from your gallery</p>
                </div>
            </button>

            {/* Snap Button (Same logic, mobile browsers will offer camera option) */}
            <button 
                onClick={triggerInput}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#1a4032] hover:bg-[#143328] text-white transition-all shadow-lg hover:shadow-xl group text-left"
            >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-[#C3F53C]">
                    <Camera size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-white">Snap a Picture</h4>
                    <p className="text-xs text-slate-300">Use your camera now</p>
                </div>
            </button>

        </div>

      </div>
    </div>
  );
};

export default SnapSortModal;