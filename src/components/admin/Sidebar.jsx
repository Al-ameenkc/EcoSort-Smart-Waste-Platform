import React, { useState } from 'react';
// 1. IMPORT Navigation ICON
import { LayoutDashboard, Users, ChevronLeft, ChevronRight, LogOut, Navigation } from 'lucide-react';
import logo from '../../assets/kanem-logo.png'; 

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);

  // 2. ADD THE OPTIMIZER TO THIS LIST
  const menuItems = [
    { id: 'pickups', label: 'Pickups', icon: LayoutDashboard },
    { id: 'volunteers', label: 'Volunteers', icon: Users },
    { id: 'optimizer', label: 'Route Optimizer', icon: Navigation }, // <--- NEW ITEM
  ];

  return (
    <div 
      className={`h-screen bg-[#1a4032] text-white transition-all duration-300 flex flex-col relative z-50
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* TOGGLE BUTTON */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-10 bg-white text-[#1a4032] p-1 rounded-full shadow-md hover:bg-slate-100 transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* LOGO AREA */}
      <div className="p-6 flex items-center justify-center border-b border-white/10">
         {collapsed ? (
            <div className="w-8 h-8 bg-[#C3F53C] rounded-full flex items-center justify-center font-bold text-[#1a4032]">K</div>
         ) : (
             <div className="flex items-center gap-2">
                 <img src={logo} alt="Logo" className="w-8 h-auto invert brightness-0 grayscale" />
                 <span className="font-bold tracking-tight">Admin</span>
             </div>
         )}
      </div>

      {/* MENU ITEMS */}
      <nav className="flex-1 py-6 space-y-2 px-3">
        {menuItems.map((item) => (
            <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                    w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
                    ${activeTab === item.id 
                        ? 'bg-[#C3F53C] text-[#1a4032] font-bold shadow-lg shadow-lime-900/20' 
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }
                    ${collapsed ? 'justify-center' : ''}
                `}
            >
                <item.icon size={20} />
                {!collapsed && <span>{item.label}</span>}
            </button>
        ))}
      </nav>

      {/* FOOTER - LOGOUT BUTTON */}
      <div className="p-4 border-t border-white/10">
        <button 
            onClick={onLogout} 
            className={`w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/10 hover:text-red-200 rounded-xl transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
        </button>
      </div>

    </div>
  );
};

export default Sidebar;