import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, ScanLine } from 'lucide-react';

const SnapSortModal = ({ isOpen, onClose, onImageSelect }) => {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onImageSelect(imageUrl);
    }
  };

  const triggerInput = () => {
    fileInputRef.current.click();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      
      {/* --- INTERNAL STYLES --- */}
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalPopUp {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
        .animate-backdrop {
          animation: modalFadeIn 0.3s ease-out forwards;
        }
        .animate-modal {
          animation: modalPopUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-scan-line {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>

      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-backdrop" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-modal">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors z-20"
        >
          <X size={20} />
        </button>

        {/* Header Section */}
        <div className="bg-gradient-to-br from-[#1a4032] to-[#0f291e] p-8 text-center relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-[-50%] left-[-20%] w-64 h-64 bg-[#C3F53C]/20 rounded-full blur-3xl"></div>
            
            {/* Scanner Animation */}
            <div className="relative mx-auto w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10">
                <ScanLine size={40} className="text-[#C3F53C]" />
                <div className="absolute inset-0 border-t-2 border-[#C3F53C]/50 animate-scan-line"></div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Snap-Sort AI</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
                Not sure if an item is recyclable? Let our AI analyze it for you instantly.
            </p>
        </div>

        {/* Action Section */}
        <div className="p-8">
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
            />
            
            <button 
                onClick={triggerInput}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#1a4032] hover:bg-[#143328] text-white transition-all shadow-lg hover:shadow-xl group text-left"
            >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-[#C3F53C]">
                    <Upload size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-white text-lg">Upload a Picture</h4>
                    <p className="text-xs text-slate-300">Select from gallery or use camera</p>
                </div>
            </button>

        </div>

      </div>
    </div>,
    document.body
  );
};

export default SnapSortModal;