import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const CustomAlert = ({ isOpen, onClose, type = 'success', title, message }) => {
  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Top bar removed for a cleaner look */}

        <div className="p-8 text-center">
          {/* Icon */}
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-5 
            ${isSuccess ? 'bg-green-50 text-[#1a4032]' : 'bg-red-50 text-red-500'}`}>
            {isSuccess ? <CheckCircle size={32} /> : <AlertCircle size={32} />}
          </div>

          {/* Text */}
          <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">{message}</p>

          {/* Button */}
          <button 
            onClick={onClose}
            className={`w-full py-3.5 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg
                ${isSuccess 
                ? 'bg-[#1a4032] hover:bg-[#143328] shadow-green-900/20' 
                : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
            }`}
          >
            {isSuccess ? 'Continue' : 'Try Again'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;