import React, { useState } from 'react';
// 1. IMPORT Navigation ICON
import { LayoutDashboard, Users, ChevronLeft, ChevronRight, LogOut, Navigation, X } from 'lucide-react';
import logo from '../../assets/kanem-logo.png'; 

const Sidebar = ({ activeTab, setActiveTab, onLogout, mobileOpen, onCloseMobile }) => {
  const [collapsed, setCollapsed] = useState(false);

  // 2. ADD THE OPTIMIZER TO THIS LIST
  const menuItems = [
    { id: 'pickups', label: 'Pickups', icon: LayoutDashboard },
    { id: 'volunteers', label: 'Volunteers', icon: Users },
    { id: 'optimizer', label: 'Route Optimizer', icon: Navigation }, // <--- NEW ITEM
  ];

  return (
    <>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-[1px] z-40" onClick={onCloseMobile}></div>
      )}
      <div 
      className={`bg-[#1a4032] text-white transition-all duration-300 z-50
        fixed top-0 left-0 h-screen w-72 flex flex-col lg:static lg:h-screen lg:shrink-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        ${collapsed ? 'lg:w-20' : 'lg:w-64'}
      `}
    >
      {/* TOGGLE BUTTON */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex absolute -right-3 top-10 bg-white text-[#1a4032] p-1 rounded-full shadow-md hover:bg-slate-100 transition-colors items-center justify-center"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* LOGO AREA */}
      <div className="p-4 lg:p-6 flex items-center justify-between lg:justify-center border-b border-white/10">
         <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close menu"
         >
            <X size={18} />
         </button>
         {collapsed ? (
            <div className="w-8 h-8 bg-[#C3F53C] rounded-full flex items-center justify-center font-bold text-[#1a4032]">K</div>
         ) : (
             <div className="flex items-center gap-2">
                 <img src={logo} alt="Logo" className="w-8 h-auto invert brightness-0 grayscale" />
                 <span className="font-bold tracking-tight">Admin</span>
             </div>
         )}
         <div className="lg:hidden w-9"></div>
      </div>

      {/* MENU ITEMS */}
      <nav className="flex-1 flex flex-col py-4 px-3 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
            <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onCloseMobile?.();
                }}
                className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                    ${activeTab === item.id 
                        ? 'bg-[#C3F53C] text-[#1a4032] font-bold shadow-lg shadow-lime-900/20' 
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }
                    ${collapsed ? 'lg:justify-center' : ''}
                `}
            >
                <item.icon size={20} />
                {!collapsed && <span className="text-sm lg:text-base text-left">{item.label}</span>}
            </button>
        ))}
      </nav>

      {/* FOOTER - LOGOUT BUTTON */}
      <div className="p-4 border-t border-white/10">
        <button 
            onClick={onLogout} 
            className={`w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/10 hover:text-red-200 rounded-xl transition-colors justify-start ${collapsed ? 'lg:justify-center' : ''}`}
        >
            <LogOut size={20} />
            {(!collapsed || mobileOpen) && <span>Logout</span>}
        </button>
      </div>

    </div>
    </>
  );
};

export default Sidebar;