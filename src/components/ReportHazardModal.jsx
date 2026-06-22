import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  User,
  Phone,
  MapPin,
  Map as MapIcon,
  Loader2,
  Droplets,
  Waves,
  Crosshair,
  ChevronDown,
} from 'lucide-react';
import CustomAlert from './CustomAlert';
import { submitFloodReport } from '../services/floodReportService';
import { inferZone } from '../services/logisticsService';
import { getServiceAreaNames, formatServiceAreaLabel } from '../constants/serviceAreas';
import DataConsentCheckbox from './DataConsentCheckbox';

const ZONE_OPTIONS = getServiceAreaNames();

const REPORT_META = {
  drainage_blockage: {
    title: 'Report Drainage Blockage',
    subtitle: 'Select your area and describe the blocked drainage.',
    icon: Droplets,
    button: 'Submit Drainage Report',
  },
  flood: {
    title: 'Report Flood',
    subtitle: 'Select your area and describe the flooding.',
    icon: Waves,
    button: 'Submit Flood Report',
  },
};

const ReportHazardModal = ({ isOpen, onClose, reportType = 'drainage_blockage' }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    zone: '',
    address: '',
    landmark: '',
    description: '',
    coordinates: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  if (!isOpen) return null;

  const meta = REPORT_META[reportType] || REPORT_META.drainage_blockage;
  const Icon = meta.icon;

  const resetForm = () => ({
    fullName: '',
    phone: '',
    zone: '',
    address: '',
    landmark: '',
    description: '',
    coordinates: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAlertClose = () => {
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
    if (alertConfig.type === 'success') {
      setFormData(resetForm());
      onClose();
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setAlertConfig({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Geolocation is not supported by your browser.',
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const coords = [latitude, longitude];

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const displayName = data?.display_name || '';
          const detectedZone = inferZone(displayName);

          setFormData((prev) => ({
            ...prev,
            coordinates: coords,
            address: displayName || prev.address,
            zone: detectedZone && ZONE_OPTIONS.includes(detectedZone)
              ? detectedZone
              : prev.zone,
          }));
        } catch {
          setFormData((prev) => ({
            ...prev,
            coordinates: coords,
          }));
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        setAlertConfig({
          isOpen: true,
          type: 'error',
          title: 'Location Failed',
          message: 'Unable to retrieve location. Please select your area manually.',
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.zone) {
      setAlertConfig({
        isOpen: true,
        type: 'error',
        title: 'Missing Information',
        message: 'Please provide your name, phone, and select your area.',
      });
      return;
    }

    if (!consentAccepted) {
      setAlertConfig({
        isOpen: true,
        type: 'error',
        title: 'Consent Required',
        message: 'Please accept our Privacy Policy to submit your report.',
      });
      return;
    }

    setIsSubmitting(true);
    const fullAddress = [formData.address, formData.zone].filter(Boolean).join(', ');
    const result = await submitFloodReport({
      ...formData,
      address: fullAddress || formData.zone,
      reportType,
    });

    if (result.success) {
      setAlertConfig({
        isOpen: true,
        type: 'success',
        title: 'Report Received',
        message: 'Thank you. Our team will investigate this location.',
      });
    } else {
      setAlertConfig({
        isOpen: true,
        type: 'error',
        title: 'Submission Failed',
        message: 'Could not submit your report. Please try again.',
      });
    }

    setIsSubmitting(false);
  };

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="bg-[#1a4032] text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#C3F53C]/20 flex items-center justify-center">
                <Icon size={24} className="text-[#C3F53C]" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{meta.title}</h2>
                <p className="text-xs text-white/70 mt-0.5">{meta.subtitle}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a4032]/20 focus:border-[#1a4032] outline-none"
                    placeholder="Your name"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Phone</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a4032]/20 focus:border-[#1a4032] outline-none"
                    placeholder="+234..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Area / Location</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3 text-slate-400 z-10 pointer-events-none" />
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-3 text-slate-400 z-10 pointer-events-none"
                />
                <select
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-9 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a4032]/20 focus:border-[#1a4032] outline-none appearance-none bg-white"
                >
                  <option value="">Select your area...</option>
                  {ZONE_OPTIONS.map((zone) => (
                    <option key={zone} value={zone}>
                      {formatServiceAreaLabel(zone)}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[10px] text-slate-400">Only areas we operate in are listed. Don&apos;t see yours? We haven&apos;t expanded there yet.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">
                Street / Landmark <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <div className="relative">
                <MapIcon size={16} className="absolute left-3 top-3 text-slate-400 z-10" />
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-9 pr-28 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a4032]/20 focus:border-[#1a4032] outline-none"
                  placeholder="e.g. Ahmadu Bello Way"
                />
                <button
                  type="button"
                  onClick={handleLocateMe}
                  disabled={isLocating}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-[#C3F53C] hover:bg-[#b2e32b] text-[#1a4032] text-xs font-bold rounded-lg flex items-center gap-1 disabled:opacity-60"
                >
                  {isLocating ? <Loader2 size={14} className="animate-spin" /> : <Crosshair size={14} />}
                  GPS
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Details (optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a4032]/20 focus:border-[#1a4032] outline-none resize-none"
                placeholder="Describe the blockage or flood..."
              />
            </div>

            <DataConsentCheckbox
              checked={consentAccepted}
              onChange={setConsentAccepted}
              id="hazard-consent"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1a4032] hover:bg-[#143328] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Submitting...
                </>
              ) : (
                meta.button
              )}
            </button>
          </form>
        </div>
      </div>

      <CustomAlert
        isOpen={alertConfig.isOpen}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={handleAlertClose}
      />
    </>,
    document.body
  );
};

export default ReportHazardModal;
