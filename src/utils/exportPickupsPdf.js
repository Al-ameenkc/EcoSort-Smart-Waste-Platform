import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatOrderDate = (createdAt) => {
  if (!createdAt) return 'N/A';
  const date = typeof createdAt.toDate === 'function' ? createdAt.toDate() : new Date(createdAt);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const buildFilename = (filterStatus) => {
  const stamp = new Date().toISOString().slice(0, 10);
  const suffix = filterStatus && filterStatus !== 'All' ? `-${filterStatus.toLowerCase()}` : '';
  return `kanemwaste-pickups${suffix}-${stamp}.pdf`;
};

export const exportPickupsToPdf = (pickups = [], {
  filterStatus = 'All',
  title,
  subtitle,
  filename,
  includePhone = true,
} = {}) => {
  if (!pickups.length) return { success: false, error: 'No pickup orders to export.' };

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const generatedAt = new Date().toLocaleString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  doc.setFontSize(16);
  doc.setTextColor(26, 64, 50);
  doc.text(title || 'KanemWaste Pickup Orders', 14, 16);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  const statusLabel = filterStatus === 'All' ? 'All statuses' : `${filterStatus} only`;
  const metaLine = subtitle
    ? subtitle
    : `Exported: ${generatedAt}  |  ${statusLabel}  |  Total: ${pickups.length}`;
  doc.text(metaLine, 14, 23);

  const head = includePhone
    ? ['Name', 'Plastic Type', 'Address', 'Phone', 'Order Date']
    : ['Name', 'Plastic Type', 'Address', 'Order Date'];

  const rows = pickups.map((pickup) => {
    const base = [
      pickup.fullName || 'N/A',
      pickup.wasteType || 'N/A',
      pickup.address || 'N/A',
    ];
    if (includePhone) {
      base.push(pickup.phone || 'N/A');
    }
    base.push(formatOrderDate(pickup.createdAt));
    return base;
  });

  autoTable(doc, {
    startY: 28,
    head: [head],
    body: rows,
    styles: {
      fontSize: 9,
      cellPadding: 3,
      overflow: 'linebreak',
      valign: 'top',
    },
    headStyles: {
      fillColor: [26, 64, 50],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: includePhone
      ? {
          0: { cellWidth: 38 },
          1: { cellWidth: 32 },
          2: { cellWidth: 78 },
          3: { cellWidth: 38 },
          4: { cellWidth: 42 },
        }
      : {
          0: { cellWidth: 42 },
          1: { cellWidth: 38 },
          2: { cellWidth: 110 },
          3: { cellWidth: 48 },
        },
    margin: { left: 14, right: 14 },
  });

  doc.save(filename || buildFilename(filterStatus));
  return { success: true };
};
