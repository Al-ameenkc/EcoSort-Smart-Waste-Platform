import { ABUJA_COORDS } from '../constants/abujaZones';

const HEAVY_WEATHER_TYPES = new Set(['Thunderstorm', 'Rain', 'Drizzle']);
const FORECAST_HOURS = 48;

const classifyPrecipitation = (forecastItem) => {
  const weather = forecastItem.weather?.[0];
  if (!weather) return null;

  const main = weather.main;
  const description = weather.description || '';
  const rainVolume = forecastItem.rain?.['3h'] ?? 0;

  const isSevere =
    main === 'Thunderstorm' ||
    description.toLowerCase().includes('heavy') ||
    description.toLowerCase().includes('storm') ||
    description.toLowerCase().includes('extreme') ||
    rainVolume >= 5;

  if (!isSevere) return null;
  if (!HEAVY_WEATHER_TYPES.has(main) && main !== 'Thunderstorm') return null;

  return {
    condition: main,
    description,
    rainMm: rainVolume,
    forecastAt: new Date(forecastItem.dt * 1000),
  };
};

const fetchZoneForecast = async (lat, lon, apiKey) => {
  const url = new URL('https://api.openweathermap.org/data/2.5/forecast');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));
  url.searchParams.set('appid', apiKey);
  url.searchParams.set('units', 'metric');

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`OpenWeather API error: ${response.status}`);
  }

  return response.json();
};

const findWorstForecastInWindow = (list, now, windowEnd) => {
  let worst = null;

  for (const item of list || []) {
    if (item.dt < now || item.dt > windowEnd) continue;

    const classified = classifyPrecipitation(item);
    if (!classified) continue;

    const severity =
      (classified.condition === 'Thunderstorm' ? 100 : 0) +
      classified.rainMm * 2 +
      (classified.description.toLowerCase().includes('heavy') ? 20 : 0);

    if (!worst || severity > worst.severity) {
      worst = { ...classified, severity };
    }
  }

  return worst;
};

/**
 * Checks rain forecasts per Abuja zone over the next 48 hours.
 * @returns {Promise<{ hasAlerts: boolean, alerts: Array, affectedZones: string[] }>}
 */
export async function getRainAlertsByZone(zoneAnchors) {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  if (!apiKey) {
    console.warn('[weatherService] VITE_OPENWEATHER_API_KEY is not configured.');
    return { hasAlerts: false, alerts: [], affectedZones: [] };
  }

  const now = Math.floor(Date.now() / 1000);
  const windowEnd = now + FORECAST_HOURS * 60 * 60;

  const zoneEntries = Object.entries(zoneAnchors);
  const results = await Promise.all(
    zoneEntries.map(async ([zone, [lat, lon]]) => {
      try {
        const data = await fetchZoneForecast(lat, lon, apiKey);
        const forecast = findWorstForecastInWindow(data.list, now, windowEnd);
        if (!forecast) return null;

        return {
          zone,
          condition: forecast.condition,
          description: forecast.description,
          rainMm: forecast.rainMm,
          forecastAt: forecast.forecastAt,
        };
      } catch (error) {
        console.warn(`[weatherService] Forecast failed for ${zone}:`, error);
        return null;
      }
    })
  );

  const alerts = results.filter(Boolean);
  return {
    hasAlerts: alerts.length > 0,
    alerts,
    affectedZones: alerts.map((a) => a.zone),
  };
}

export { ABUJA_COORDS };
