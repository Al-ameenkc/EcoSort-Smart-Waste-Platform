import React, { useState } from 'react';
import { Droplets, Waves, Plus, MapPin, Phone, Filter } from 'lucide-react';
import { createAdminFloodReport, REPORT_TYPES, REPORT_STATUSES } from '../../services/floodReportService';
import { ZONE_ANCHORS } from '../../constants/abujaZones';
import FloodReportDetailModal from './FloodReportDetailModal';
import CustomAlert from '../CustomAlert';

const FloodReportsPanel = ({ reports = [] }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  const [formData, setFormData] = useState({
    reportType: 'drainage_blockage',
    fullName: 'Admin',
    phone: '',
    address: '',
    zone: '',
    landmark: '',
    description: '',
    status: 'Verified',
  });

  const filtered = reports.filter((r) => {
    if (filterType !== 'All' && r.reportType !== filterType) return false;
    if (filterStatus !== 'All' && r.status !== filterStatus) return false;
    return true;
  });

  const handleAddReport = async (e) => {
    e.preventDefault();
    if (!formData.address || !formData.zone) {
      setAlertConfig({
        isOpen: true,
        type: 'error',
        title: 'Missing fields',
        message: 'Address and zone are required.',
      });
      return;
    }

    setIsSubmitting(true);
    const result = await createAdminFloodReport({
      ...formData,
      address: `${formData.address}, ${formData.zone}`,
    });

    if (result.success) {
      setShowAddForm(false);
      setFormData({
        reportType: 'drainage_blockage',
        fullName: 'Admin',
        phone: '',
        address: '',
        zone: '',
        landmark: '',
        description: '',
        status: 'Verified',
      });
      setAlertConfig({
        isOpen: true,
        type: 'success',
        title: 'Report Added',
        message: 'Hazard location has been logged for flood monitoring.',
      });
    } else {
      setAlertConfig({
        isOpen: true,
        type: 'error',
        title: 'Failed',
        message: 'Could not save the report.',
      });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-white"
          >
            <option value="All">All Types</option>
            <option value="drainage_blockage">Drainage</option>
            <option value="flood">Flood</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-white"
          >
            <option value="All">All Statuses</option>
            {REPORT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a4032] text-[#C3F53C] rounded-xl font-bold text-sm hover:bg-green-900 transition-colors"
        >
          <Plus size={16} /> Log Hazard Location
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddReport}
          className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm space-y-4"
        >
          <h3 className="font-bold text-slate-900">Add Hazard Report (Admin)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500">Type</label>
              <select
                value={formData.reportType}
                onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm"
              >
                <option value="drainage_blockage">Drainage Blockage</option>
                <option value="flood">Flood</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">Zone</label>
              <select
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm"
                required
              >
                <option value="">Select zone...</option>
                {Object.keys(ZONE_ANCHORS).map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500">Street / Location</label>
              <input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm"
                placeholder="Street address or landmark"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500">Notes</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm resize-none"
                rows={2}
                placeholder="Drainage blocked near market..."
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#C3F53C] text-[#1a4032] font-bold rounded-xl text-sm disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Save Report'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-900">Report</th>
                <th className="px-6 py-4 font-bold text-slate-900">Zone</th>
                <th className="px-6 py-4 font-bold text-slate-900">Contact</th>
                <th className="px-6 py-4 font-bold text-slate-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((report) => (
                <tr
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          report.reportType === 'flood' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {report.reportType === 'flood' ? <Waves size={18} /> : <Droplets size={18} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          {REPORT_TYPES[report.reportType] || report.reportType}
                        </p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{report.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">{report.zone || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      <span>{report.phone || '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        report.drainageBlocked
                          ? 'bg-red-100 text-red-700 border-red-200'
                          : report.status === 'Pending'
                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                            : report.status === 'Investigating'
                              ? 'bg-orange-100 text-orange-700 border-orange-200'
                              : report.status === 'Resolved'
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : 'bg-red-100 text-red-700 border-red-200'
                      }`}
                    >
                      {report.drainageBlocked ? 'Drainage Blocked' : report.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center text-slate-400">
                    No hazard reports yet. Public reports or admin entries will appear here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FloodReportDetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      <CustomAlert
        isOpen={alertConfig.isOpen}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />
    </>
  );
};

export default FloodReportsPanel;
