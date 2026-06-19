import { db } from '../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { inferZone, resolveCoordinates } from './logisticsService';

const COLLECTION = 'flood_reports';

export const REPORT_TYPES = {
  drainage_blockage: 'Drainage Blockage',
  flood: 'Flood',
};

export const REPORT_STATUSES = ['Pending', 'Investigating', 'Verified', 'Resolved'];

const buildReportPayload = (data, source = 'public') => {
  const zone = data.zone || inferZone(`${data.address || ''} ${data.landmark || ''}`);
  const coordinates =
    data.coordinates || resolveCoordinates({ address: data.address, zone }, 0);

  return {
    reportType: data.reportType,
    fullName: data.fullName,
    phone: data.phone,
    address: data.address,
    landmark: data.landmark || '',
    description: data.description || '',
    zone,
    coordinates,
    status: data.status || 'Pending',
    source,
    createdAt: serverTimestamp(),
  };
};

export const submitFloodReport = async (formData) => {
  try {
    await addDoc(collection(db, COLLECTION), buildReportPayload(formData, 'public'));
    return { success: true };
  } catch (error) {
    console.error('[floodReportService] submit failed:', error);
    return { success: false, error };
  }
};

export const createAdminFloodReport = async (formData) => {
  try {
    await addDoc(collection(db, COLLECTION), buildReportPayload(formData, 'admin'));
    return { success: true };
  } catch (error) {
    console.error('[floodReportService] admin create failed:', error);
    return { success: false, error };
  }
};

export const updateFloodReportStatus = async (reportId, status, extra = {}) => {
  try {
    await updateDoc(doc(db, COLLECTION, reportId), {
      status,
      ...extra,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('[floodReportService] update failed:', error);
    return { success: false, error };
  }
};

export const deleteFloodReport = async (reportId) => {
  try {
    await deleteDoc(doc(db, COLLECTION, reportId));
    return { success: true };
  } catch (error) {
    console.error('[floodReportService] delete failed:', error);
    return { success: false, error };
  }
};
