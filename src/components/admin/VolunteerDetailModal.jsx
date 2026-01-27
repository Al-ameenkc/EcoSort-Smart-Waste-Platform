import React from 'react';
import { X, Phone, User, MapPin, Calendar, CheckCircle, MessageCircle, Trash2 } from 'lucide-react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const VolunteerDetailModal = ({ volunteer, onClose }) => {
  if (!volunteer) return null;

  // --- ACTIONS ---
  const updateStatus = async (newStatus) => {
    try {
        const ref = doc(db, "volunteers", volunteer.id);
        await updateDoc(ref, { status: newStatus });
        onClose();
    } catch (e) {
        alert("Error updating status: " + e.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this volunteer?")) {
        try {
            const ref = doc(db, "volunteers", volunteer.id);
            await deleteDoc(ref);
            onClose();
        } catch (e) {
            alert("Error deleting: " + e.message);
        }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header / Banner */}
        <div className="bg-[#1a4032] p-6 text-white relative overflow-hidden">
             <div className="absolute top-[-50%] right-[-20%] w-40 h-40 bg-[#C3F53C]/20 rounded-full blur-3xl"></div>
             <div className="relative z-10 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <User size={20} className="text-[#C3F53C]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C3F53C]">Volunteer Profile</span>
                    </div>
                    <h2 className="text-2xl font-bold">{volunteer.fullName}</h2>
                    <p className="text-slate-300 text-sm">{volunteer.role || 'General Volunteer'}</p>
                </div>
                <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                    <X size={20}/>
                </button>
             </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            
            {/* Contact Info Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Phone</p>
                    <div className="flex items-center gap-2 text-slate-800 font-medium text-sm">
                        <Phone size={14} /> 
                        <a href={`tel:${volunteer.phone}`} className="hover:text-green-600 transition-colors">
                            {volunteer.phone}
                        </a>
                    </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">WhatsApp</p>
                    <div className="flex items-center gap-2 text-slate-800 font-medium text-sm">
                        <MessageCircle size={14} className="text-green-600" /> 
                        <span>{volunteer.whatsapp || '-'}</span>
                    </div>
                </div>
            </div>

            {/* Address Section */}
            <div>
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Location</h4>
                 <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <MapPin size={16} className="text-[#1a4032] mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700">{volunteer.address}</p>
                 </div>
            </div>

            {/* Availability Section */}
            <div>
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Availability</h4>
                 <div className="flex items-center gap-2 text-sm text-slate-700 bg-blue-50 border border-blue-100 p-3 rounded-xl">
                    <Calendar size={16} className="text-blue-500" />
                    {volunteer.availability || 'Flexible'}
                 </div>
            </div>
            
            {/* Motivation / Notes */}
            {volunteer.motivation && (
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Motivation</h4>
                    <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                        "{volunteer.motivation}"
                    </p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex gap-3">
                {volunteer.status !== 'Verified' && (
                    <button 
                        onClick={() => updateStatus('Verified')}
                        className="flex-1 py-3 bg-[#1a4032] hover:bg-[#143328] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                    >
                        <CheckCircle size={16} /> Verify & Approve
                    </button>
                )}
                
                <button 
                    onClick={handleDelete}
                    className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm transition-colors border border-red-100 active:scale-95"
                    title="Delete Volunteer"
                >
                    <Trash2 size={18} />
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default VolunteerDetailModal;