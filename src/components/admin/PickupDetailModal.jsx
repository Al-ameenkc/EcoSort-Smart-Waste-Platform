import React from 'react';
import { X, MapPin, Phone, User, Package, Calendar, Clock, CheckCircle } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const PickupDetailModal = ({ pickup, onClose }) => {
  if (!pickup) return null;

  // Handle Status Update inside Modal
  const updateStatus = async (newStatus) => {
    const ref = doc(db, "pickups", pickup.id);
    await updateDoc(ref, { status: newStatus });
    onClose(); // Close after update
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 bg-white/50 hover:bg-white p-2 rounded-full z-20 backdrop-blur-md transition-colors">
            <X size={20} />
        </button>

        {/* IMAGE SIDE (Left/Top) */}
        <div className="w-full md:w-2/5 bg-slate-100 relative min-h-[200px] md:min-h-full">
            {pickup.imageUrl ? (
                <img src={pickup.imageUrl} alt="Waste" className="w-full h-full object-cover" />
            ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">No Image Uploaded</div>
            )}
            <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm
                ${pickup.status === 'Pending' ? 'bg-blue-500 text-white' : ''}
                ${pickup.status === 'Assigned' ? 'bg-orange-500 text-white' : ''}
                ${pickup.status === 'Completed' ? 'bg-green-500 text-white' : ''}
            `}>
                {pickup.status}
            </div>
        </div>

        {/* DETAILS SIDE (Right/Bottom) */}
        <div className="flex-1 p-8 overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">{pickup.fullName}</h2>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                <Phone size={14} />
                <span>{pickup.phone}</span>
            </div>

            <div className="space-y-6">
                {/* Location */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <MapPin size={12} /> Location
                    </h4>
                    <p className="font-medium text-slate-800">{pickup.address}</p>
                    <p className="text-sm text-slate-500 mt-1">{pickup.landmark}</p>
                </div>

                {/* Inventory */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Package size={12} /> Inventory
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700">
                            {pickup.wasteType}
                        </span>
                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700">
                            {pickup.count}x {pickup.bagSize}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Update Status</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => updateStatus('Assigned')}
                            className="py-3 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 font-bold text-sm hover:bg-orange-100 transition-colors"
                        >
                            Assign Driver
                        </button>
                        <button 
                             onClick={() => updateStatus('Completed')}
                             className="py-3 rounded-xl bg-[#1a4032] text-[#C3F53C] font-bold text-sm hover:bg-green-900 transition-colors flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={16} /> Complete
                        </button>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default PickupDetailModal;