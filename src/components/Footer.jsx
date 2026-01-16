import React from 'react';
import { Link } from 'react-router-dom'; 
import logo from '../assets/kanem-logo.png'; 
import { Instagram, Twitter, Facebook, Linkedin, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to open Eco-AI sidebar globally
  const handleOpenEcoAi = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-eco-ai'));
  };

  // Helper to open Navbar Contact Dropdown
  const handleTriggerContact = (e) => {
    e.preventDefault();
    // UPDATED: Removed window.scrollTo so page doesn't jump up
    window.dispatchEvent(new CustomEvent('toggle-nav-contact'));
  };

  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-10 px-6">
      <div className="max-w-[1400px] mx-auto">
        
        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 mb-16">
            
            {/* COLUMN 1: BRAND */}
            <div className="col-span-2 md:col-span-1">
                <Link to="/" onClick={handleScrollTop} className="flex items-center gap-2 mb-6 group w-fit">
                    <img src={logo} alt="KanemWaste" className="h-8 w-auto group-hover:scale-105 transition-transform" />
                    <span className="text-lg font-semibold tracking-tight text-slate-900">KanemWaste</span>
                </Link>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs">
                    Empowering communities to create a cleaner, greener future through smart recycling and innovation.
                </p>
                <div className="flex gap-4">
                    <SocialIcon href="https://instagram.com" icon={<Instagram size={18}/>} />
                    <SocialIcon href="https://twitter.com" icon={<Twitter size={18}/>} />
                    <SocialIcon href="https://linkedin.com" icon={<Linkedin size={18}/>} />
                </div>
            </div>

            {/* COLUMN 2: COMPANY */}
            <div className="col-span-1">
                <h4 className="font-bold text-slate-900 mb-6">Company</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                    <li><Link to="/about" onClick={handleScrollTop} className="hover:text-green-600 transition-colors">About Us</Link></li>
                    
                    {/* Trigger Button */}
                    <li>
                        <button onClick={handleTriggerContact} className="hover:text-green-600 transition-colors text-left">
                            Contact Us
                        </button>
                    </li>
                    
                    <li><Link to="/book-pickup" onClick={handleScrollTop} className="hover:text-green-600 transition-colors">Book a Pickup</Link></li>
                </ul>
            </div>

            {/* COLUMN 3: RESOURCES */}
            <div className="col-span-1">
                <h4 className="font-bold text-slate-900 mb-6">Resources</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                    <li>
                        <button onClick={handleOpenEcoAi} className="hover:text-green-600 transition-colors text-left">
                            Eco-AI
                        </button>
                    </li>
                    <li><a href="#" className="hover:text-green-600 transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-green-600 transition-colors">Media</a></li>
                </ul>
            </div>

            {/* COLUMN 4: NEWSLETTER */}
            <div className="col-span-2 md:col-span-1">
                <h4 className="font-bold text-slate-900 mb-6">Stay Updated</h4>
                <p className="text-slate-500 text-sm mb-4">Subscribe to our newsletter for the latest eco-tips.</p>
                <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-sm w-full focus:outline-none focus:border-green-500 transition-colors"
                    />
                    <button type="submit" className="bg-[#1a4032] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-green-800 transition-colors shrink-0 shadow-md hover:scale-105">
                        <ArrowUpRight size={18} />
                    </button>
                </form>
            </div>

        </div>

        {/* --- BOTTOM SECTION: COPYRIGHT --- */}
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
                © 2026 KanemWaste. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm text-slate-400">
                <Link to="/terms" onClick={handleScrollTop} className="hover:text-slate-900 transition-colors">Terms</Link>
                <Link to="/privacy" onClick={handleScrollTop} className="hover:text-slate-900 transition-colors">Privacy</Link>
                <Link to="/cookies" onClick={handleScrollTop} className="hover:text-slate-900 transition-colors">Cookies</Link>
            </div>
        </div>

      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, href }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-[#C3F53C] hover:text-black transition-all duration-300 hover:scale-110"
    >
        {icon}
    </a>
);

export default Footer;