import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { X, Bot, CheckCircle, ChevronRight } from 'lucide-react';

const SnapSortSidebar = ({ isOpen, onClose, image, onScanAgain }) => {
  const [status, setStatus] = useState('analyzing'); 

  useEffect(() => {
    if (isOpen && image) {
      setStatus('analyzing');
      const timer = setTimeout(() => {
        setStatus('result');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, image]);

  if (!isOpen) return null;

  const handleFindBin = () => {
    alert("This feature is currently under development.");
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      
      {/* --- INTERNAL STYLES --- */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-backdrop {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-sidebar {
          animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-backdrop" 
        onClick={onClose}
      ></div>

      {/* Sidebar Panel */}
      <div className="relative z-10 w-full md:w-[450px] bg-white h-full shadow-2xl flex flex-col animate-sidebar">
        
        {/* HEADER */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1a4032] flex items-center justify-center text-[#C3F53C]">
                    <Bot size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">Snap-Sort AI</h3>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Online
                    </p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                <X size={20} />
            </button>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-5 space-y-8 bg-slate-50/50">
            
            {/* 1. USER MESSAGE */}
            <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-[70%] bg-white p-2 rounded-2xl rounded-tr-none shadow-sm border border-slate-100">
                    <img 
                        src={image} 
                        alt="User Upload" 
                        className="w-full h-auto rounded-xl"
                    />
                </div>
                <span className="text-[10px] text-slate-400 font-medium mr-2">You • Just now</span>
            </div>

            {/* 2. AI MESSAGE (Analyzing...) */}
            {status === 'analyzing' && (
                <div className="flex flex-col items-start gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-8 h-8 rounded-full bg-[#1a4032] flex items-center justify-center text-[#C3F53C] mb-1">
                        <Bot size={16} />
                    </div>
                    <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-slate-600 text-sm flex items-center gap-3">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                        </div>
                        Analyzing image...
                    </div>
                </div>
            )}

            {/* 3. AI RESULT */}
            {status === 'result' && (
                <div className="flex flex-col items-start gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-8 h-8 rounded-full bg-[#1a4032] flex items-center justify-center text-[#C3F53C] mb-1">
                        <Bot size={16} />
                    </div>
                    
                    {/* RESULT CARD */}
                    <div className="w-[90%] bg-white rounded-2xl rounded-tl-none shadow-lg overflow-hidden border border-slate-100">
                        
                        <div className="bg-green-50 p-4 border-b border-green-100 flex items-center gap-3">
                            <CheckCircle className="text-green-600" size={24} />
                            <div>
                                <h4 className="font-bold text-green-900">Recyclable Item</h4>
                                <p className="text-xs text-green-700">Confidence: 98%</p>
                            </div>
                        </div>

                        <div className="p-5 space-y-4">
                            <div>
                                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Identified Object</h5>
                                <p className="text-slate-900 font-medium">PET Plastic Bottle (Clear)</p>
                            </div>

                            <div>
                                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Why is it recyclable?</h5>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    PET (Polyethylene Terephthalate) is widely accepted. It can be processed into polyester fabric or new bottles.
                                </p>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4">
                                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">How to Handle</h5>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-sm text-slate-600">
                                        <div className="min-w-[16px] mt-0.5 text-green-600">1.</div>
                                        <span><strong>Rinse:</strong> Remove any liquid residue.</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-slate-600">
                                        <div className="min-w-[16px] mt-0.5 text-green-600">2.</div>
                                        <span><strong>Crush:</strong> Flatten to save space in the bin.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button 
                                onClick={handleFindBin}
                                className="text-xs font-bold text-[#1a4032] flex items-center gap-1 hover:underline"
                            >
                                Find Nearest Bin <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>

        {/* FOOTER INPUT */}
        <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0">
             <button 
                onClick={onScanAgain}
                className="w-full py-3 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors"
             >
                Scan Another Item
             </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default SnapSortSidebar;