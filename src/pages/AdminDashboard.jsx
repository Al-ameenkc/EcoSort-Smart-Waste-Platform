import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Sidebar from '../components/admin/Sidebar';
import PickupDetailModal from '../components/admin/PickupDetailModal';
import { CheckCircle, Clock, MapPin, Package, Phone, Truck, Image as ImageIcon, ChevronLeft, ChevronRight, Filter, Users, MessageCircle, Heart } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pickups');
  
  // --- DATA STATES ---
  const [pickups, setPickups] = useState([]);
  const [volunteers, setVolunteers] = useState([]); // <--- NEW STATE FOR VOLUNTEERS
  const [selectedPickup, setSelectedPickup] = useState(null);
  
  // --- FILTER & PAGINATION STATE ---
  const [filterStatus, setFilterStatus] = useState('All'); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- 1. REAL-TIME LISTENER FOR PICKUPS ---
  useEffect(() => {
    const q = query(collection(db, "pickups"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPickups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // --- 2. REAL-TIME LISTENER FOR VOLUNTEERS (NEW) ---
  useEffect(() => {
    // We order by 'joinedAt' desc so newest volunteers show first
    const q = query(collection(db, "volunteers"), orderBy("joinedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setVolunteers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);


  // --- LOGIC: FILTERING (Pickups Only for now) ---
  const filteredData = activeTab === 'pickups' 
    ? pickups.filter(p => filterStatus === 'All' || p.status === filterStatus)
    : volunteers; // No filtering for volunteers yet

  // --- LOGIC: PAGINATION ---
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

  // Reset page when switching tabs
  useEffect(() => { setCurrentPage(1); }, [activeTab]);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto p-8 pt-32">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 capitalize">{activeTab} Management</h1>
                <p className="text-slate-500 mt-1">Total {activeTab} found: <span className="font-bold text-slate-900">{activeTab === 'pickups' ? pickups.length : volunteers.length}</span></p>
            </div>
            
            {/* Filter only visible for Pickups */}
            {activeTab === 'pickups' && (
                <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    <div className="px-3 py-1 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <Filter size={14} /> Filter:
                    </div>
                    {['All', 'Pending', 'Assigned', 'Completed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => handleFilterChange(status)}
                            className={`
                                px-4 py-2 rounded-lg text-sm font-bold transition-all
                                ${filterStatus === status 
                                    ? 'bg-[#1a4032] text-white shadow-md' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }
                            `}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* --- PICKUPS VIEW --- */}
        {activeTab === 'pickups' && (
            <>
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard icon={Clock} label="Pending" value={pickups.filter(p => p.status === 'Pending').length} color="blue" />
                    <StatCard icon={Truck} label="Assigned" value={pickups.filter(p => p.status === 'Assigned').length} color="orange" />
                    <StatCard icon={CheckCircle} label="Completed" value={pickups.filter(p => p.status === 'Completed').length} color="green" />
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
                    <div className="overflow-x-auto flex-1">
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
                                    <tr 
                                        key={pickup.id} 
                                        onClick={() => setSelectedPickup(pickup)} 
                                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {pickup.imageUrl ? (
                                                    <img src={pickup.imageUrl} alt="waste" className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center"><ImageIcon size={16} className="text-slate-300"/></div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-slate-900">{pickup.fullName}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{pickup.wasteType}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-2 max-w-[200px]">
                                                <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
                                                <p className="font-medium text-slate-800 truncate">{pickup.address}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={pickup.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold hover:bg-[#1a4032] hover:text-white hover:border-[#1a4032] transition-colors">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {currentItems.length === 0 && (
                                    <tr><td colSpan="4" className="px-6 py-20 text-center text-slate-400">No requests found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <PaginationControls currentPage={currentPage} totalPages={totalPages} paginate={paginate} currentCount={currentItems.length} totalCount={filteredData.length} />
                </div>
            </>
        )}

        {/* --- VOLUNTEERS VIEW (NEW) --- */}
        {activeTab === 'volunteers' && (
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
                 <div className="overflow-x-auto flex-1">
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
                                <tr key={vol.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#1a4032] border border-slate-200">
                                                <Users size={18} />
                                            </div>
                                            <span className="font-bold text-slate-900">{vol.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className="text-slate-400" />
                                            <span className="font-medium text-slate-700">{vol.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <MessageCircle size={14} className="text-green-500" />
                                            <span className="font-medium text-slate-700">{vol.whatsapp || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 flex w-fit items-center gap-1">
                                            <Heart size={10} fill="currentColor" /> {vol.status || 'New'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {currentItems.length === 0 && (
                                <tr><td colSpan="4" className="px-6 py-20 text-center text-slate-400">No volunteers yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                 </div>
                 <PaginationControls currentPage={currentPage} totalPages={totalPages} paginate={paginate} currentCount={currentItems.length} totalCount={filteredData.length} />
            </div>
        )}

      </div>

      {/* Detail Modal */}
      <PickupDetailModal 
        pickup={selectedPickup} 
        onClose={() => setSelectedPickup(null)} 
      />

    </div>
  );
};

// --- SUB-COMPONENTS ---

const PaginationControls = ({ currentPage, totalPages, paginate, currentCount, totalCount }) => (
    <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{currentCount}</span> of <span className="font-bold text-slate-900">{totalCount}</span> results
        </p>
        <div className="flex items-center gap-2">
            <button 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-bold text-slate-700 px-2">Page {currentPage} of {totalPages || 1}</span>
            <button 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    </div>
);

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-${color}-600 bg-${color}-50`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{label}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        Pending: "bg-blue-100 text-blue-700 border border-blue-200",
        Assigned: "bg-orange-100 text-orange-700 border border-orange-200",
        Completed: "bg-green-100 text-green-700 border border-green-200"
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
            {status}
        </span>
    );
};

export default AdminDashboard;