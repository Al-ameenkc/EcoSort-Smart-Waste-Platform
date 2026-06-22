/**
 * KanemWaste operational service areas in Abuja.
 * Edit this file to add/remove locations or change pickup days.
 * If a zone is not listed here, we do not operate there yet.
 */
export const WEEKLY_PICKUP_FEE_NGN = 2000;

export const SERVICE_AREAS = {
  Lokogoma: { coords: [8.99, 7.47], pickupDay: 'Friday' },
  Galadimawa: { coords: [9.0, 7.44], pickupDay: 'Wednesday' },
  Apo: { coords: [9.01, 7.49], pickupDay: 'Monday' },
  'Apo Resettlement': { coords: [9.0, 7.505], pickupDay: 'Monday' },
  Durumi: { coords: [9.015, 7.46], pickupDay: 'Tuesday' },
  Gaduwa: { coords: [9.005, 7.465], pickupDay: 'Tuesday' },
  'Games Village': { coords: [9.025, 7.465], pickupDay: 'Thursday' },
  Lugbe: { coords: [8.98, 7.36], pickupDay: 'Saturday' },
};

export const SERVICE_AREA_CENTER = { lat: 9.0, lon: 7.455 };

export const getServiceAreaNames = () => Object.keys(SERVICE_AREAS).sort();

export const getPickupDay = (zone) => SERVICE_AREAS[zone]?.pickupDay ?? null;

export const formatServiceAreaLabel = (zone) => {
  const day = getPickupDay(zone);
  return day ? `${zone} (Pickup on ${day}s)` : zone;
};

export const isServiceArea = (zone) => Boolean(SERVICE_AREAS[zone]);
