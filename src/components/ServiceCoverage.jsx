import React from 'react';
import { Calendar, MapPin, Info } from 'lucide-react';
import {
  getServiceAreaNames,
  getPickupDay,
  WEEKLY_PICKUP_FEE_NGN,
} from '../constants/serviceAreas';

const ServiceCoverage = () => {
  const areas = getServiceAreaNames();

  return (
    <section className="py-12 px-6 max-w-[1400px] mx-auto">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 md:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F1FCC2] text-[#1a4032] text-xs font-bold uppercase tracking-wider mb-4">
              <MapPin size={14} /> Service Coverage
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Where we operate
            </h2>
            <p className="text-slate-500 text-sm mt-2 max-w-xl">
              We currently pick up in the areas below. If your location is not listed, we have not
              expanded there yet. Check back as we grow.
            </p>
          </div>
          <div className="bg-[#1a4032] text-white rounded-2xl px-6 py-4 shrink-0">
            <p className="text-xs text-slate-300 uppercase tracking-wider font-bold">Weekly pickup fee</p>
            <p className="text-2xl font-bold text-[#C3F53C]">₦{WEEKLY_PICKUP_FEE_NGN.toLocaleString()}</p>
            <p className="text-xs text-slate-300 mt-1">Paid on pickup · Not for profit</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {areas.map((zone) => (
            <div
              key={zone}
              className="flex items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#C3F53C]/50 transition-colors"
            >
              <span className="font-bold text-slate-900 text-sm">{zone}</span>
              <span className="flex items-center gap-1 text-xs font-medium text-[#1a4032] bg-[#E8F89C] px-2.5 py-1 rounded-full shrink-0">
                <Calendar size={12} />
                {getPickupDay(zone)}s
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
          <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 leading-relaxed">
            <strong>Bring bottles to us?</strong> We pay cash for PET bottles dropped off at our
            collection point. The ₦{WEEKLY_PICKUP_FEE_NGN.toLocaleString()} weekly fee applies only to
            door-to-door pickup. It covers fuel and logistics to sustain the service, not profit.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServiceCoverage;
