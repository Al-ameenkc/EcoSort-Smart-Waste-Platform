import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Sidebar from '../components/admin/Sidebar';
import PickupDetailModal from '../components/admin/PickupDetailModal';
import VolunteerDetailModal from '../components/admin/VolunteerDetailModal';
import RouteOptimizer from './RouteOptimizer'; // <--- 1. NEW IMPORT
import { CheckCircle, Clock, MapPin, Package, Phone, Truck, Image as ImageIcon, ChevronLeft, ChevronRight, Filter, Users, MessageCircle, Heart, Menu } from 'lucide-react';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('pickups');
  
  // --- DATA STATES ---
  const [pickups, setPickups] = useState([]);
  const [volunteers, setVolunteers] = useState([]); 
  
  // --- MODAL STATES ---
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  
  // --- FILTER & PAGINATION STATE ---
  const [filterStatus, setFilterStatus] = useState('All'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const itemsPerPage = 10;

  // --- REAL-TIME LISTENERS ---
  useEffect(() => {
    const q = query(collection(db, "pickups"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPickups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "volunteers"), orderBy("joinedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setVolunteers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);


  // --- LOGIC: FILTERING & PAGINATION ---
  const filteredData = activeTab === 'pickups' 
    ? pickups.filter(p => filterStatus === 'All' || p.status === filterStatus)
    : volunteers; 

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  const handleFilterChange = (status) => {
      setFilterStatus(status);
      setCurrentPage(1); 
  };

  useEffect(() => { setCurrentPage(1); }, [activeTab]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 font-sans">
      
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 lg:h-screen overflow-y-auto p-4 md:p-6 lg:p-8 lg:pt-24">
        <div className="flex items-center justify-end lg:hidden mb-3">
            <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-700"
                aria-label="Open menu"
            >
                <Menu size={18} />
            </button>
        </div>
        
        {/* Header Section (Hidden when in Optimizer mode to give map more space) */}
        {activeTab !== 'optimizer' && (
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 lg:mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 capitalize">{activeTab} Management</h1>
                    <p className="text-slate-500 mt-1">Total {activeTab} found: <span className="font-bold text-slate-900">{activeTab === 'pickups' ? pickups.length : volunteers.length}</span></p>
                </div>
                
                {activeTab === 'pickups' && (
                    <div className="w-full sm:w-auto flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                        <Filter size={14} className="text-slate-400 shrink-0" />
                        <select
                            value={filterStatus}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="w-full sm:w-auto min-w-[170px] px-2 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a4032]/20 focus:border-[#1a4032]"
                        >
                            {['All', 'Pending', 'Assigned', 'Completed'].map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        )}

        {/* --- 2. ROUTE OPTIMIZER VIEW --- */}
        {activeTab === 'optimizer' && (
             <RouteOptimizer pickups={pickups} />
        )}

        {/* --- PICKUPS VIEW --- */}
        {activeTab === 'pickups' && (
            <>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-6 mb-6 lg:mb-8">
                    <StatCard icon={Clock} label="Pending" value={pickups.filter(p => p.status === 'Pending').length} color="blue" />
                    <StatCard icon={Truck} label="Assigned" value={pickups.filter(p => p.status === 'Assigned').length} color="orange" />
                    <StatCard icon={CheckCircle} label="Completed" value={pickups.filter(p => p.status === 'Completed').length} color="green" />
                </div>

                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
                    <div className="md:hidden flex-1 p-4 space-y-3">
                        {currentItems.map((pickup) => (
                            <PickupMobileCard key={pickup.id} pickup={pickup} onSelect={() => setSelectedPickup(pickup)} />
                        ))}
                        {currentItems.length === 0 && (
                            <div className="py-16 text-center text-slate-400">No requests found.</div>
                        )}
                    </div>
                    <div className="hidden md:block overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-slate-900">Request</th>
                                    <th className="px-6 py-4 font-bold text-slate-900">Location</th>
                                    <th className="px-6 py-4 font-bold text-slate-900">Status</th>
                                    <th className="px-6 py-4 font-bold text-slate-900 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {currentItems.map((pickup) => (
                                    <tr key={pickup.id} onClick={() => setSelectedPickup(pickup)} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {pickup.imageUrl ? (<img src={pickup.imageUrl} alt="waste" className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200" />) : (<div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center"><ImageIcon size={16} className="text-slate-300"/></div>)}
                                                <div><p className="font-bold text-slate-900">{pickup.fullName}</p><span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{pickup.wasteType}</span></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><div className="flex items-start gap-2 max-w-[200px]"><MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" /><p className="font-medium text-slate-800 truncate">{pickup.address}</p></div></td>
                                        <td className="px-6 py-4"><StatusBadge status={pickup.status} /></td>
                                        <td className="px-6 py-4 text-right"><button className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold hover:bg-[#1a4032] hover:text-white hover:border-[#1a4032] transition-colors">View</button></td>
                                    </tr>
                                ))}
                                {currentItems.length === 0 && <tr><td colSpan="4" className="px-6 py-20 text-center text-slate-400">No requests found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    <PaginationControls currentPage={currentPage} totalPages={totalPages} paginate={paginate} currentCount={currentItems.length} totalCount={filteredData.length} />
                </div>
            </>
        )}

        {/* --- VOLUNTEERS VIEW --- */}
        {activeTab === 'volunteers' && (
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
                 <div className="md:hidden flex-1 p-4 space-y-3">
                    {currentItems.map((vol) => (
                        <VolunteerMobileCard key={vol.id} volunteer={vol} onSelect={() => setSelectedVolunteer(vol)} />
                    ))}
                    {currentItems.length === 0 && (
                        <div className="py-16 text-center text-slate-400">No volunteers yet.</div>
                    )}
                 </div>
                 <div className="hidden md:block overflow-x-auto flex-1">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-bold text-slate-900">Volunteer Name</th>
                                <th className="px-6 py-4 font-bold text-slate-900">Phone</th>
                                <th className="px-6 py-4 font-bold text-slate-900">WhatsApp</th>
                                <th className="px-6 py-4 font-bold text-slate-900">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {currentItems.map((vol) => (
                                <tr key={vol.id} onClick={() => setSelectedVolunteer(vol)} className="hover:bg-slate-50/80 transition-colors cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#1a4032] border border-slate-200"><Users size={18} /></div>
                                            <span className="font-bold text-slate-900">{vol.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><div className="flex items-center gap-2"><Phone size={14} className="text-slate-400" /><span className="font-medium text-slate-700">{vol.phone}</span></div></td>
                                    <td className="px-6 py-4"><div className="flex items-center gap-2"><MessageCircle size={14} className="text-green-500" /><span className="font-medium text-slate-700">{vol.whatsapp || '-'}</span></div></td>
                                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-bold border flex w-fit items-center gap-1 ${vol.status === 'Verified' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}><Heart size={10} fill="currentColor" /> {vol.status || 'New'}</span></td>
                                </tr>
                            ))}
                            {currentItems.length === 0 && <tr><td colSpan="4" className="px-6 py-20 text-center text-slate-400">No volunteers yet.</td></tr>}
                        </tbody>
                    </table>
                 </div>
                 <PaginationControls currentPage={currentPage} totalPages={totalPages} paginate={paginate} currentCount={currentItems.length} totalCount={filteredData.length} />
            </div>
        )}

      </div>

      <PickupDetailModal pickup={selectedPickup} onClose={() => setSelectedPickup(null)} />
      <VolunteerDetailModal volunteer={selectedVolunteer} onClose={() => setSelectedVolunteer(null)} />

    </div>
  );
};

// --- SUB-COMPONENTS ---
const PaginationControls = ({ currentPage, totalPages, paginate, currentCount, totalCount }) => (
    <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-xs text-slate-500 font-medium">Showing <span className="font-bold text-slate-900">{currentCount}</span> of <span className="font-bold text-slate-900">{totalCount}</span> results</p>
        <div className="flex items-center gap-2 self-end sm:self-auto">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft size={16} /></button>
            <span className="text-sm font-bold text-slate-700 px-2">Page {currentPage} of {totalPages || 1}</span>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight size={16} /></button>
        </div>
    </div>
);

const PickupMobileCard = ({ pickup, onSelect }) => (
    <button
        onClick={onSelect}
        className="w-full text-left p-4 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-[#1a4032]/40 transition-colors"
    >
        <div className="flex items-start gap-3">
            {pickup.imageUrl ? (
                <img src={pickup.imageUrl} alt="waste" className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0" />
            ) : (
                <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    <ImageIcon size={16} className="text-slate-300" />
                </div>
            )}
            <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900 truncate">{pickup.fullName}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">{pickup.address}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{pickup.wasteType}</span>
                    <StatusBadge status={pickup.status} />
                </div>
            </div>
        </div>
    </button>
);

const VolunteerMobileCard = ({ volunteer, onSelect }) => (
    <button
        onClick={onSelect}
        className="w-full text-left p-4 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-[#1a4032]/40 transition-colors"
    >
        <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#1a4032] border border-slate-200 shrink-0">
                <Users size={18} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900 truncate">{volunteer.fullName}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                    <Phone size={12} />
                    <span>{volunteer.phone}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                    <MessageCircle size={12} className="text-green-500" />
                    <span>{volunteer.whatsapp || '-'}</span>
                </div>
                <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex w-fit items-center gap-1 ${volunteer.status === 'Verified' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        <Heart size={10} fill="currentColor" /> {volunteer.status || 'New'}
                    </span>
                </div>
            </div>
        </div>
    </button>
);

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-2 sm:p-3 lg:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 min-w-0">
        <p className="text-[9px] sm:text-[10px] lg:text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1 truncate">{label}</p>
        <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center text-${color}-600 bg-${color}-50`}>
            <Icon size={16} className="sm:hidden" />
            <Icon size={20} className="hidden sm:block lg:hidden" />
            <Icon size={22} className="hidden lg:block" />
        </div>
        <p className="mt-1.5 text-base sm:text-lg lg:text-2xl font-medium text-slate-900 leading-tight">{value}</p>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = { Pending: "bg-blue-100 text-blue-700 border border-blue-200", Assigned: "bg-orange-100 text-orange-700 border border-orange-200", Completed: "bg-green-100 text-green-700 border border-green-200" };
    return <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
};

export default AdminDashboard;