import React from 'react';
import { CloudRain, Droplets, MapPin, ShieldCheck, Users, Wallet } from 'lucide-react';

const SECTIONS = [
  {
    icon: CloudRain,
    title: 'Stopping flash floods before they start',
    body: `Since 2023 we have tackled urban flash flooding in Abuja. Choked drains from plastic and debris leave rainwater nowhere to go. We built a rapid, hyper-local response to clear blockages before storms hit.`,
  },
  {
    icon: Users,
    title: 'Community tips, verified and rewarded',
    body: `Residents report clogged drains through our website with the exact location. Once verified, we pay a cash reward for the info tip itself, not the cleanup. Local awareness becomes reliable income.`,
  },
  {
    icon: Droplets,
    title: 'Hands-on clearance by our own team',
    body: `Our core team clears drainage bottlenecks by hand with shovels, rakes, and protective gear. We sync with live weather data and go on standby 24 hours before severe storms.`,
  },
  {
    icon: Wallet,
    title: 'A self-sustaining financial loop',
    body: `Tip rewards and cleanup fuel are funded by our waste operations. Bulk plastic sold to our partner factory creates a loop that protects flood-vulnerable homes and market shops.`,
  },
];

const FloodOperations = () => (
  <section className="py-16 px-6 max-w-[1400px] mx-auto">
    <div className="rounded-[2.5rem] bg-gradient-to-br from-[#1a4032] to-[#0f291e] text-white p-8 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#C3F53C]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-6">
          <ShieldCheck size={14} className="text-[#C3F53C]" />
          <span className="text-xs font-bold text-[#C3F53C] uppercase tracking-wider">Flood Resilience</span>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
          How we fight <span className="text-[#C3F53C]">urban flooding</span> in Abuja
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SECTIONS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#C3F53C]/20 flex items-center justify-center text-[#C3F53C] mb-4">
                <Icon size={20} />
              </div>
              <h3 className="font-bold text-lg mb-3 text-white">{title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed line-clamp-4">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <MapPin size={16} className="text-[#C3F53C]" />
          <span>
            Spot a blocked drain in our service areas? Use the{' '}
            <strong className="text-white">Report Drainage Blockage</strong> button on our homepage.
          </span>
        </div>
      </div>
    </div>
  </section>
);

export default FloodOperations;
