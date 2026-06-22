import { SERVICE_AREAS, SERVICE_AREA_CENTER } from './serviceAreas';

export const ABUJA_COORDS = SERVICE_AREA_CENTER;

export const ZONE_ANCHORS = Object.fromEntries(
  Object.entries(SERVICE_AREAS).map(([name, { coords }]) => [name, coords])
);

export const ABUJA_CENTER = [ABUJA_COORDS.lat, ABUJA_COORDS.lon];
