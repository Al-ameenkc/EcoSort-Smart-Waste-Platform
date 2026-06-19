import React, { useState } from 'react';
import { X, MapPin, Phone, Package, CheckCircle, Trash2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { deletePickup } from '../../services/pickupService';

const PickupDetailModal = ({ pickup, onClose }) => {
  const [deleting, setDeleting] = useState(false);

  if (!pickup) return null;

  const updateStatus = async (newStatus) => {
    const ref = doc(db, 'pickups', pickup.id);
    await updateDoc(ref, { status: newStatus });
    onClose();
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete pickup request from ${pickup.fullName}? This cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    const result = await deletePickup(pickup.id);
    setDeleting(false);

    if (result.success) {
      onClose();
    } else {
      alert('Could not delete this pickup. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[95vh] lg:max-h-[90vh]">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/60 hover:bg-white p-1.5 sm:p-2 rounded-full z-20 backdrop-blur-md transition-colors">
            <X size={18} />
        </button>

        {/* IMAGE SIDE (Left/Top) */}
        <div className="w-full lg:w-2/5 bg-slate-100 relative h-40 sm:h-52 md:h-56 lg:h-auto lg:min-h-full">
            {pickup.imageUrl ? (
                <img src={pickup.imageUrl} alt="Waste" className="w-full h-full object-cover" />
            ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">No Image Uploaded</div>
            )}
            <div className={`absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide shadow-sm
                ${pickup.status === 'Pending' ? 'bg-blue-500 text-white' : ''}
                ${pickup.status === 'Assigned' ? 'bg-orange-500 text-white' : ''}
                ${pickup.status === 'Completed' ? 'bg-green-500 text-white' : ''}
            `}>
                {pickup.status}
            </div>
        </div>

        {/* DETAILS SIDE (Right/Bottom) */}
        <div className="flex-1 p-4 sm:p-6 md:p-7 lg:p-8 overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 break-words">{pickup.fullName}</h2>
            <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6">
                <Phone size={14} />
                <span>{pickup.phone}</span>
            </div>

            <div className="space-y-4 sm:space-y-6">
                {/* Location */}
                <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <MapPin size={12} /> Location
                    </h4>
                    <p className="font-medium text-sm sm:text-base text-slate-800 break-words">{pickup.address}</p>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 break-words">{pickup.landmark}</p>
                </div>

                {/* Inventory */}
                <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Package size={12} /> Inventory
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700">
                            {pickup.wasteType}
                        </span>
                        <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700">
                            {pickup.count}x {pickup.bagSize}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Update Status</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                        <button 
                            onClick={() => updateStatus('Assigned')}
                            className="py-2.5 sm:py-3 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 font-bold text-xs sm:text-sm hover:bg-orange-100 transition-colors"
                        >
                            Assign Driver
                        </button>
                        <button 
                             onClick={() => updateStatus('Completed')}
                             className="py-2.5 sm:py-3 rounded-xl bg-[#1a4032] text-[#C3F53C] font-bold text-xs sm:text-sm hover:bg-green-900 transition-colors flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={16} /> Complete
                        </button>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs sm:text-sm transition-colors border border-red-100 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Trash2 size={16} />
                        {deleting ? 'Deleting...' : 'Delete Pickup'}
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default PickupDetailModal;