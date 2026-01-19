import React, { useState } from 'react';
import { createPortal } from 'react-dom'; 
import { X, User, Phone, MessageCircle, Heart, Loader2 } from 'lucide-react';
import { joinMovement } from '../services/volunteerService'; 
import emailjs from '@emailjs/browser';
import CustomAlert from './CustomAlert'; // <--- 1. Import CustomAlert

const JoinUsModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsapp: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 2. Alert State ---
  const [alertConfig, setAlertConfig] = useState({ 
    isOpen: false, 
    type: 'success', 
    title: '', 
    message: '' 
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 3. Handle Alert Close ---
  // If it was a success message, close the Modal when the user clicks "Continue"
  const handleAlertClose = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false }));
    if (alertConfig.type === 'success') {
        onClose(); // Close the JoinUsModal
    }
  };

  const handleSubmit = async () => {
    // Basic Validation
    if (!formData.fullName || !formData.phone) {
        setAlertConfig({
            isOpen: true,
            type: 'error',
            title: 'Missing Information',
            message: 'Please enter your Name and Phone Number to join.'
        });
        return;
    }

    setIsSubmitting(true);

    try {
        // --- 1. Send to Firebase ---
        const result = await joinMovement(formData);

        if (result.success) {
            
            // --- 2. Send Email Notification ---
            const emailParams = {
                user_name: formData.fullName,
                user_phone: formData.phone,
                user_whatsapp: formData.whatsapp || "Same as phone",
                date: new Date().toLocaleDateString()
            };

            try {
                await emailjs.send(
                    import.meta.env.VITE_EMAILJS_SERVICE_ID,
                    import.meta.env.VITE_EMAILJS_VOLUNTEER_TEMPLATE_ID, // Use the Env Variable
                    emailParams,
                    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
                );
                console.log("✅ Volunteer Email Sent!");
            } catch (emailError) {
                console.error("❌ Volunteer Email Failed:", emailError);
            }

            // --- 3. Show Success Alert ---
            setFormData({ fullName: '', phone: '', whatsapp: '' }); 
            setAlertConfig({
                isOpen: true,
                type: 'success',
                title: 'Welcome to the Movement!',
                message: 'Your application is received. We will contact you via WhatsApp shortly.'
            });
            // Note: We don't call onClose() here. We wait for the user to close the Alert.

        } else {
            throw new Error("Database save failed");
        }

    } catch (error) {
        console.error("Critical Error:", error);
        setAlertConfig({
            isOpen: true,
            type: 'error',
            title: 'Submission Failed',
            message: 'Please check your internet connection and try again.'
        });
    }

    setIsSubmitting(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      
      {/* --- ANIMATIONS --- */}
      <style>{`
        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalPopUp { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-backdrop { animation: modalFadeIn 0.3s ease-out forwards; }
        .animate-modal { animation: modalPopUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-backdrop" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-modal">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 transition-colors z-20"
        >
          <X size={16} />
        </button>

        {/* Header Section */}
        <div className="bg-[#1a4032] p-8 text-center relative overflow-hidden">
            <div className="absolute top-[-50%] left-[-20%] w-48 h-48 bg-[#C3F53C]/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#C3F53C] backdrop-blur-md border border-white/10">
                    <Heart size={24} fill="currentColor" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Join the Movement</h2>
                <p className="text-slate-300 text-xs">Become a KanemWaste Volunteer</p>
            </div>
        </div>

        {/* Form Section */}
        <div className="p-6 space-y-4">
            
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                    <User size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        type="text" 
                        placeholder="Your Name" 
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-colors" 
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
                <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        type="tel" 
                        placeholder="+234..." 
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-colors" 
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">WhatsApp Number</label>
                <div className="relative">
                    <MessageCircle size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        type="tel" 
                        placeholder="+234..." 
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-colors" 
                    />
                </div>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
                <p className="text-xs text-green-800 font-medium">
                    You will hear from us within 48hrs of weekdays.
                </p>
            </div>

            <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#1a4032] hover:bg-[#143328] text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <>Joining... <Loader2 className="animate-spin" size={18} /></>
                ) : (
                    "Join Us"
                )}
            </button>

        </div>

        {/* --- 4. Render Custom Alert Inside Modal --- */}
        <CustomAlert 
            isOpen={alertConfig.isOpen}
            type={alertConfig.type}
            title={alertConfig.title}
            message={alertConfig.message}
            onClose={handleAlertClose} // Use the smart handler
        />

      </div>
    </div>,
    document.body
  );
};

export default JoinUsModal;