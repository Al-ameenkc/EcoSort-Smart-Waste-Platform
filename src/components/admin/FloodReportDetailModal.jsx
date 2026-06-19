import React, { useState } from 'react';
import { X, Phone, MapPin, Droplets, Waves, CheckCircle, Search, Trash2 } from 'lucide-react';
import { updateFloodReportStatus, deleteFloodReport, REPORT_TYPES } from '../../services/floodReportService';
import { inferZone } from '../../services/logisticsService';

const FloodReportDetailModal = ({ report, onClose }) => {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!report) return null;

  const isDrainage = report.reportType === 'drainage_blockage';
  const TypeIcon = isDrainage ? Droplets : Waves;

  const handleStatus = async (status) => {
    setUpdating(true);
    const zone = report.zone || inferZone(`${report.address || ''} ${report.landmark || ''}`);
    await updateFloodReportStatus(report.id, status, {
      drainageBlocked: status === 'Verified' && isDrainage,
      zone: zone || report.zone,
    });
    setUpdating(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this hazard report? This cannot be undone.')) {
      return;
    }

    setDeleting(true);
    const result = await deleteFloodReport(report.id);
    setDeleting(false);

    if (result.success) {
      onClose();
    } else {
      alert('Could not delete this report. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-[#1a4032] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#C3F53C]/20 flex items-center justify-center">
              <TypeIcon size={22} className="text-[#C3F53C]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/60">Hazard Report</p>
              <h2 className="text-lg font-bold">{REPORT_TYPES[report.reportType] || report.reportType}</h2>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Status</span>
            <StatusBadge status={report.status} drainageBlocked={report.drainageBlocked} />
          </div>

          <div className="space-y-3 text-sm">
            <p className="font-bold text-slate-900">{report.fullName}</p>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone size={14} />
              <a href={`tel:${report.phone}`} className="hover:text-green-700">
                {report.phone}
              </a>
            </div>
            <div className="flex items-start gap-2 text-slate-600">
              <MapPin size={14} className="mt-0.5 shrink-0" />
              <span>{report.address}</span>
            </div>
            {report.landmark && (
              <p className="text-xs text-slate-500">Landmark: {report.landmark}</p>
            )}
            {report.zone && (
              <p className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg w-fit">
                Zone: {report.zone}
              </p>
            )}
            {report.description && (
              <p className="text-slate-600 bg-slate-50 p-3 rounded-xl text-xs">{report.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              disabled={updating || report.status === 'Investigating'}
              onClick={() => handleStatus('Investigating')}
              className="py-2.5 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 font-bold text-xs hover:bg-orange-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
            >
              <Search size={14} /> Investigate
            </button>
            {isDrainage && (
              <button
                disabled={updating || report.status === 'Verified'}
                onClick={() => handleStatus('Verified')}
                className="py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
              >
                <CheckCircle size={14} /> Confirm Blocked
              </button>
            )}
            <button
              disabled={updating || report.status === 'Resolved'}
              onClick={() => handleStatus('Resolved')}
              className="col-span-2 py-2.5 rounded-xl bg-[#1a4032] text-[#C3F53C] font-bold text-xs hover:bg-green-900 transition-colors disabled:opacity-50"
            >
              Mark Resolved
            </button>
          </div>

          <button
            onClick={handleDelete}
            disabled={deleting || updating}
            className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition-colors border border-red-100 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Trash2 size={16} />
            {deleting ? 'Deleting...' : 'Delete Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status, drainageBlocked }) => {
  const styles = {
    Pending: 'bg-blue-100 text-blue-700 border-blue-200',
    Investigating: 'bg-orange-100 text-orange-700 border-orange-200',
    Verified: 'bg-red-100 text-red-700 border-red-200',
    Resolved: 'bg-green-100 text-green-700 border-green-200',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {drainageBlocked ? 'Drainage Blocked' : status}
    </span>
  );
};

export default FloodReportDetailModal;
