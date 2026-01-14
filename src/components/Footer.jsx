import React from 'react';
import logo from '../assets/kanem-logo.png'; 
import { Instagram, Twitter, Facebook, Linkedin, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-10 px-6">
      <div className="max-w-[1400px] mx-auto">
        
        {/* --- TOP SECTION: COLUMNS --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            {/* COLUMN 1: BRAND */}
            <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-6">
                    <img src={logo} alt="KanemWaste" className="h-8 w-auto" />
                    <span className="text-lg font-semibold tracking-tight">KanemWaste</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    Empowering communities to create a cleaner, greener future through smart recycling and innovation.
                </p>
                <div className="flex gap-4">
                    <SocialIcon icon={<Instagram size={18}/>} />
                    <SocialIcon icon={<Twitter size={18}/>} />
                    <SocialIcon icon={<Linkedin size={18}/>} />
                </div>
            </div>

            {/* COLUMN 2: COMPANY (Updated Links) */}
            <div>
                <h4 className="font-bold text-slate-900 mb-6">Company</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                    <FooterLink text="About Us" />
                    <FooterLink text="Contact Us" />
                    <FooterLink text="Book a Pickup" />
                </ul>
            </div>

            {/* COLUMN 3: RESOURCES (Updated Links) */}
            <div>
                <h4 className="font-bold text-slate-900 mb-6">Resources</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                    <FooterLink text="Privacy Policy" />
                    <FooterLink text="Media" />
                </ul>
            </div>

            {/* COLUMN 4: NEWSLETTER */}
            <div>
                <h4 className="font-bold text-slate-900 mb-6">Stay Updated</h4>
                <p className="text-slate-500 text-sm mb-4">Subscribe to our newsletter for the latest eco-tips.</p>
                <div className="flex gap-2">
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-sm w-full focus:outline-none focus:border-green-500 transition-colors"
                    />
                    <button className="bg-[#1a4032] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-green-800 transition-colors shrink-0">
                        <ArrowUpRight size={18} />
                    </button>
                </div>
            </div>
        </div>

        {/* --- BOTTOM SECTION: COPYRIGHT --- */}
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
                © 2026 KanemWaste. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm text-slate-400">
                <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Cookies</a>
            </div>
        </div>

      </div>
    </footer>
  );
};

// --- HELPER COMPONENTS ---

const FooterLink = ({ text }) => (
    <li>
        <a href="#" className="hover:text-green-600 transition-colors flex items-center gap-1 group">
            {text}
        </a>
    </li>
);

const SocialIcon = ({ icon }) => (
    <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-[#C3F53C] hover:text-black transition-all duration-300">
        {icon}
    </a>
);

export default Footer;