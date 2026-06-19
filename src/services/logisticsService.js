import { ABUJA_COORDS, ZONE_ANCHORS, ABUJA_CENTER } from '../constants/abujaZones';

export { ZONE_ANCHORS, ABUJA_CENTER };

export const inferZone = (address = '') => {
  const lower = (address || '').toLowerCase();
  const sortedZones = Object.keys(ZONE_ANCHORS).sort((a, b) => b.length - a.length);
  return sortedZones.find((zone) => lower.includes(zone.toLowerCase())) || null;
};

const offsetCoords = (base, index) => {
  const latOffset = (((index * 13) % 100) / 10000) - 0.005;
  const lngOffset = (((index * 7) % 100) / 10000) - 0.005;
  return [base[0] + latOffset, base[1] + lngOffset];
};

export const resolveCoordinates = (pickup, index = 0) => {
  if (Array.isArray(pickup.coordinates) && pickup.coordinates.length === 2) {
    return pickup.coordinates;
  }

  const zone = pickup.zone || inferZone(pickup.address);
  const base = zone ? ZONE_ANCHORS[zone] : [ABUJA_COORDS.lat, ABUJA_COORDS.lon];
  return offsetCoords(base, index);
};

export const normalizePickupLocations = (pickups = []) =>
  pickups.map((pickup, index) => {
    const zone = pickup.zone || inferZone(pickup.address);
    return {
      id: pickup.id,
      coordinates: resolveCoordinates(pickup, index),
      zone,
      status: pickup.status,
      label: pickup.address || pickup.fullName || `Stop ${index + 1}`,
      fullName: pickup.fullName,
      wasteType: pickup.wasteType,
    };
  });

export const normalizeFloodReports = (reports = []) =>
  reports.map((report, index) => {
    const zone = report.zone || inferZone(`${report.address || ''} ${report.landmark || ''}`);
    return {
      id: report.id,
      coordinates:
        Array.isArray(report.coordinates) && report.coordinates.length === 2
          ? report.coordinates
          : resolveCoordinates({ address: report.address, zone }, index),
      zone,
      reportType: report.reportType,
      status: report.status,
      drainageBlocked: report.drainageBlocked || report.status === 'Verified',
      label: report.address || `Hazard report ${index + 1}`,
      fullName: report.fullName,
      description: report.description,
    };
  });
