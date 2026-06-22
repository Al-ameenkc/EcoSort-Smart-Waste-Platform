import React, { useState } from 'react';
import { User, Phone, MessageCircle, MapPin, Loader2, Coins, Recycle } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import CustomAlert from '../components/CustomAlert';
import DataConsentCheckbox from '../components/DataConsentCheckbox';
import { joinAsGatherer } from '../services/volunteerService';
import {
  getServiceAreaNames,
  formatServiceAreaLabel,
} from '../constants/serviceAreas';
import emailjs from '@emailjs/browser';

const JoinAsGatherer = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    zone: '',
    address: '',
  });
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.zone) {
      setAlertConfig({
        isOpen: true,
        type: 'error',
        title: 'Missing Information',
        message: 'Please enter your name, phone, and service area.',
      });
      return;
    }

    if (!consentAccepted) {
      setAlertConfig({
        isOpen: true,
        type: 'error',
        title: 'Consent Required',
        message: 'Please accept our Privacy Policy to continue.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await joinAsGatherer(formData);

      if (result.success) {
        try {
          await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_VOLUNTEER_TEMPLATE_ID,
            {
              user_name: formData.fullName,
              user_phone: formData.phone,
              user_whatsapp: formData.whatsapp || formData.phone,
              date: new Date().toLocaleDateString(),
            },
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
          );
        } catch (emailError) {
          console.error('Gatherer email notification failed:', emailError);
        }

        setAlertConfig({
          isOpen: true,
          type: 'success',
          title: 'Application Received!',
          message: 'Welcome aboard. Our team will contact you on WhatsApp with gatherer details and drop-off instructions.',
        });
        setFormData({ fullName: '', phone: '', whatsapp: '', zone: '', address: '' });
        setConsentAccepted(false);
      } else {
        throw new Error('Save failed');
      }
    } catch {
      setAlertConfig({
        isOpen: true,
        type: 'error',
        title: 'Submission Failed',
        message: 'Please check your connection and try again.',
      });
    }

    setIsSubmitting(false);
  };

  return (
    <PageWrapper>
      <div className="min-h-screen pt-24 pb-16 bg-slate-50 px-4 md:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/40">
          <div className="lg:col-span-2 bg-[#1a4032]/95 backdrop-blur-xl p-8 md:p-10 text-white flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full border border-white/20 text-xs font-medium mb-6 text-[#C3F53C]">
                Start Earning
              </span>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                Join as a <span className="text-[#C3F53C]">Gatherer</span>
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed mb-8">
                Collect plastic bottles from your area, bring them to us, and get paid in cash. We work with local gatherers across our service areas in Abuja.
              </p>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <Recycle size={18} className="text-[#C3F53C] shrink-0 mt-0.5" />
                  <span>Collect PET bottles and clean plastics from bins and neighbourhoods.</span>
                </li>
                <li className="flex gap-3">
                  <Coins size={18} className="text-[#C3F53C] shrink-0 mt-0.5" />
                  <span>Get paid cash when you drop off at our collection point.</span>
                </li>
                <li className="flex gap-3">
                  <MapPin size={18} className="text-[#C3F53C] shrink-0 mt-0.5" />
                  <span>Must be in one of our active service areas.</span>
                </li>
              </ul>
            </div>
            <p className="text-xs text-slate-400 mt-8">
              Questions? Call{' '}
              <a href="tel:+2348080210809" className="text-[#C3F53C] font-bold hover:underline">
                +234 808 021 0809
              </a>
            </p>
          </div>

          <div className="lg:col-span-3 p-8 md:p-10 bg-white">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Gatherer Sign Up</h2>
            <p className="text-sm text-slate-500 mb-6">
              Don&apos;t see your area? We haven&apos;t expanded there yet.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-800">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    type="text"
                    placeholder="Your name"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4032]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-800">Phone</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      type="tel"
                      placeholder="+234..."
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4032]"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-800">WhatsApp</label>
                  <div className="relative">
                    <MessageCircle size={18} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      type="tel"
                      placeholder="+234..."
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4032]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-800">Your Area</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3 text-slate-400 z-10 pointer-events-none" />
                  <select
                    name="zone"
                    value={formData.zone}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4032] appearance-none bg-white"
                  >
                    <option value="">Select your area...</option>
                    {getServiceAreaNames().map((zone) => (
                      <option key={zone} value={zone}>
                        {formatServiceAreaLabel(zone)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-800">
                  Street / Landmark <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Near Shoprite, Lokogoma"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4032]"
                />
              </div>

              <DataConsentCheckbox
                checked={consentAccepted}
                onChange={setConsentAccepted}
                id="gatherer-consent"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1a4032] hover:bg-[#143328] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    Submitting... <Loader2 className="animate-spin" size={20} />
                  </>
                ) : (
                  'Apply as Gatherer'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <CustomAlert
        isOpen={alertConfig.isOpen}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />
    </PageWrapper>
  );
};

export default JoinAsGatherer;
