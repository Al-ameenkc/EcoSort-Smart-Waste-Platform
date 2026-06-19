import { ZONE_ANCHORS } from '../constants/abujaZones';

const EARTH_RADIUS_KM = 6371;

export const haversineDistance = ([lat1, lon1], [lat2, lon2]) => {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const nearestNeighborRoute = (locations, startCoords) => {
  const remaining = [...locations];
  const route = [];
  let current = startCoords;

  while (remaining.length > 0) {
    let bestIndex = 0;
    let bestScore = Infinity;

    remaining.forEach((location, index) => {
      const score = haversineDistance(current, location.coordinates);
      if (score < bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });

    const next = remaining.splice(bestIndex, 1)[0];
    route.push(next);
    current = next.coordinates;
  }

  return route;
};

/**
 * Pure nearest-neighbor TSP — used by Route Optimizer and as the default here.
 */
export const solveTSP = (locations, startCoords) => {
  if (!locations?.length) return [];
  return nearestNeighborRoute(locations, startCoords);
};

/**
 * Advisory route for rain-affected zones only (does not alter normal booking routes).
 * 1. Visits rain-affected zones first (nearest zone to depot first)
 * 2. Runs TSP within each affected zone's orders
 * 3. Then TSP for all remaining orders
 */
export const solveRainPrioritizedRoute = (locations, startCoords, affectedZones = []) => {
  if (!locations?.length) return [];

  const affectedSet = new Set(affectedZones);
  if (!affectedSet.size) {
    return solveTSP(locations, startCoords);
  }

  const route = [];
  let current = startCoords;

  const zonesToVisit = [...affectedSet].sort((a, b) => {
    const coordsA = ZONE_ANCHORS[a] || startCoords;
    const coordsB = ZONE_ANCHORS[b] || startCoords;
    return haversineDistance(startCoords, coordsA) - haversineDistance(startCoords, coordsB);
  });

  for (const zone of zonesToVisit) {
    const zoneOrders = locations.filter((loc) => loc.zone === zone);
    if (!zoneOrders.length) continue;

    const zoneRoute = nearestNeighborRoute(zoneOrders, current);
    route.push(...zoneRoute.map((stop) => ({ ...stop, rainPriority: true, priorityZone: zone })));
    current = zoneRoute[zoneRoute.length - 1].coordinates;
  }

  const remaining = locations.filter((loc) => !affectedSet.has(loc.zone));
  if (remaining.length) {
    const restRoute = nearestNeighborRoute(remaining, current);
    route.push(...restRoute.map((stop) => ({ ...stop, rainPriority: false })));
  }

  return route;
};

export const calculateRouteDistance = (route, startCoords) => {
  if (!route.length) return 0;

  let total = haversineDistance(startCoords, route[0].coordinates);
  for (let i = 0; i < route.length - 1; i += 1) {
    total += haversineDistance(route[i].coordinates, route[i + 1].coordinates);
  }
  return total;
};

export const buildGoogleMapsUrl = (route, startCoords) => {
  if (!route.length) return null;

  const allPoints = [startCoords, ...route.map((s) => s.coordinates)];
  if (allPoints.length < 2) return null;

  const origin = allPoints[0].join(',');
  const destination = allPoints[allPoints.length - 1].join(',');
  const waypoints = allPoints.slice(1, -1).map((c) => c.join(',')).join('|');

  const params = new URLSearchParams({
    api: '1',
    origin,
    destination,
    travelmode: 'driving',
  });
  if (waypoints) params.set('waypoints', waypoints);

  return `https://www.google.com/maps/dir/?${params.toString()}`;
};
