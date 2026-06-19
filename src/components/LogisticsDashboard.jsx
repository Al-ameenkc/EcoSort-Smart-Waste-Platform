import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  AlertTriangle,
  CloudRain,
  ExternalLink,
  Loader2,
  MapPin,
  Navigation,
  RefreshCw,
  Route,
  ShieldCheck,
  Sun,
} from 'lucide-react';
import { getRainAlertsByZone } from '../services/weatherService';
import {
  normalizeFloodReports,
  ABUJA_CENTER,
  ZONE_ANCHORS,
  inferZone,
} from '../services/logisticsService';
import { REPORT_TYPES } from '../services/floodReportService';
import {
  solveRainPrioritizedRoute,
  calculateRouteDistance,
  buildGoogleMapsUrl,
} from '../utils/tspSolver';

const hazardIcon = (reportType) =>
  L.divIcon({
    className: '',
    html: `<div class="drainage-marker-pulse" style="width:22px;height:22px;background:${
      reportType === 'flood' ? '#f59e0b' : '#ef4444'
    };border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(239,68,68,0.25);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });

const depotIcon = L.divIcon({
  className: '',
  html: `<div style="width:20px;height:20px;background:#C3F53C;border:3px solid #1a4032;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.35);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const formatForecastTime = (date) =>
  date?.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const LogisticsDashboard = ({ floodReports = [] }) => {
  const [rainAlerts, setRainAlerts] = useState({ hasAlerts: false, alerts: [], affectedZones: [] });
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const openReports = useMemo(
    () => floodReports.filter((r) => r.status !== 'Resolved'),
    [floodReports]
  );

  const zonesWithRain = useMemo(
    () => new Set(rainAlerts.alerts.map((a) => a.zone)),
    [rainAlerts]
  );

  const rainMatchedReports = useMemo(() => {
    if (!rainAlerts.hasAlerts) return [];
    return normalizeFloodReports(openReports).filter(
      (r) => r.zone && zonesWithRain.has(r.zone)
    );
  }, [openReports, rainAlerts.hasAlerts, zonesWithRain]);

  const actionableAlerts = useMemo(
    () =>
      rainAlerts.alerts.filter((alert) =>
        rainMatchedReports.some((r) => r.zone === alert.zone)
      ),
    [rainAlerts, rainMatchedReports]
  );

  const actionableZones = useMemo(
    () => actionableAlerts.map((a) => a.zone),
    [actionableAlerts]
  );

  const reportsMissingZone = useMemo(
    () => openReports.filter((r) => !r.zone && !inferZone(`${r.address || ''} ${r.landmark || ''}`)),
    [openReports]
  );

  const optimizedRoute = useMemo(
    () => solveRainPrioritizedRoute(rainMatchedReports, ABUJA_CENTER, actionableZones),
    [rainMatchedReports, actionableZones]
  );

  const routeDistance = useMemo(
    () => calculateRouteDistance(optimizedRoute, ABUJA_CENTER),
    [optimizedRoute]
  );

  const polylinePositions = useMemo(() => {
    if (!optimizedRoute.length) return [];
    return [ABUJA_CENTER, ...optimizedRoute.map((stop) => stop.coordinates)];
  }, [optimizedRoute]);

  const googleMapsUrl = useMemo(
    () => buildGoogleMapsUrl(optimizedRoute, ABUJA_CENTER),
    [optimizedRoute]
  );

  const routeSections = useMemo(() => {
    if (!actionableZones.length || !optimizedRoute.length) return [];

    return actionableZones
      .map((zone) => {
        const stops = optimizedRoute.filter((s) => s.priorityZone === zone || s.zone === zone);
        if (!stops.length) return null;
        const alert = actionableAlerts.find((a) => a.zone === zone);
        return { zone, alert, stops, isRainSection: true };
      })
      .filter(Boolean);
  }, [optimizedRoute, actionableAlerts, actionableZones]);

  const loadWeatherStatus = async () => {
    setWeatherLoading(true);
    setWeatherError(null);

    try {
      const result = await getRainAlertsByZone(ZONE_ANCHORS);
      setRainAlerts(result);
      setLastChecked(new Date());
    } catch (error) {
      console.error('[LogisticsDashboard] Weather check failed:', error);
      setWeatherError('Unable to reach OpenWeather API.');
      setRainAlerts({ hasAlerts: false, alerts: [], affectedZones: [] });
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherStatus();
    const interval = setInterval(loadWeatherStatus, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const openGoogleMaps = () => {
    if (!googleMapsUrl) return;
    window.open(googleMapsUrl, '_blank');
  };

  const showResponsePlan = rainMatchedReports.length > 0;

  return (
    <div className="h-full flex flex-col gap-4 lg:gap-6">
      <div
        className={`rounded-2xl px-4 py-3 md:px-6 md:py-4 border ${
          actionableAlerts.length > 0
            ? 'storm-surge-banner bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400 text-white'
            : 'bg-gradient-to-r from-[#1a4032] to-[#245a47] border-[#C3F53C]/30 text-white'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {actionableAlerts.length > 0 ? (
              <AlertTriangle size={22} className="shrink-0 mt-0.5 animate-pulse" />
            ) : (
              <Sun size={22} className="shrink-0 mt-0.5 text-[#C3F53C]" />
            )}
            <div>
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] opacity-80">
                Flood Response Advisory
              </p>
              <p className="text-sm md:text-base font-bold">
                {actionableAlerts.length > 0
                  ? `${actionableAlerts.length} reported hazard${actionableAlerts.length !== 1 ? 's' : ''} in rain-affected zone${actionableAlerts.length !== 1 ? 's' : ''} — investigation route ready`
                  : rainAlerts.hasAlerts
                    ? 'Rain forecast active, but no reported hazards in affected zones'
                    : 'No rain forecast in Abuja zones (next 48h)'}
              </p>
              <p className="text-xs opacity-80 mt-1">
                Only reported drainage/flood hazards in rain-affected areas appear here. Pickup bookings are unaffected.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {weatherLoading ? (
              <span className="text-xs flex items-center gap-2 opacity-90">
                <Loader2 size={14} className="animate-spin" /> Scanning zones...
              </span>
            ) : (
              <button
                onClick={loadWeatherStatus}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw size={12} /> Refresh
              </button>
            )}
          </div>
        </div>
      </div>

      {actionableAlerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {actionableAlerts.map((alert) => {
            const reportCount = rainMatchedReports.filter((r) => r.zone === alert.zone).length;
            return (
              <div
                key={alert.zone}
                className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3"
              >
                <CloudRain size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900 text-sm">{alert.zone}</p>
                  <p className="text-xs text-amber-800 mt-0.5 capitalize">
                    {alert.description}
                    {alert.rainMm > 0 && ` · ~${alert.rainMm.toFixed(1)} mm / 3h`}
                  </p>
                  <p className="text-[10px] text-amber-700 mt-1">
                    Expected around {formatForecastTime(alert.forecastAt)}
                  </p>
                  <p className="text-xs font-semibold text-amber-900 mt-2">
                    {reportCount} hazard report{reportCount !== 1 ? 's' : ''} to investigate
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {weatherError && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
          {weatherError}
        </div>
      )}

      {!weatherLoading && !showResponsePlan && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <ShieldCheck size={40} className="mx-auto text-[#1a4032] mb-3 opacity-60" />
          <p className="font-bold text-slate-800">
            {openReports.length > 0 && rainAlerts.hasAlerts
              ? 'No hazard reports match rain-affected zones'
              : openReports.length > 0
                ? 'Hazard reports on file — waiting for rain forecast in those zones'
                : 'All clear — no flood response needed'}
          </p>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {reportsMissingZone.length > 0
              ? `${reportsMissingZone.length} report(s) have no area assigned. Re-open them in Hazard Reports and confirm again, or log a new report with the area dropdown.`
              : openReports.length > 0
                ? 'Confirmed blockages appear on the map when rain is forecast in the same zone. Check Hazard Reports for status.'
                : 'Report hazards from the homepage card. They appear here when rain is expected in that zone.'}
          </p>
        </div>
      )}

      {showResponsePlan && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <StatTile icon={MapPin} label="Zones on Alert" value={actionableZones.length} accent="amber" />
            <StatTile icon={AlertTriangle} label="Hazards to Visit" value={rainMatchedReports.length} accent="red" />
            <StatTile
              icon={Route}
              label="Investigation Route"
              value={`${routeDistance.toFixed(1)} km`}
              accent="lime"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 flex-1 min-h-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-[360px] max-h-[560px]">
              <div className="p-4 border-b border-slate-100 bg-[#1a4032] text-white rounded-t-2xl">
                <h3 className="font-bold flex items-center gap-2">
                  <Navigation size={18} className="text-[#C3F53C]" />
                  Investigation Route
                </h3>
                <p className="text-xs text-white/70 mt-1">
                  TSP optimized within each rain-affected zone&apos;s hazard reports.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <button
                  onClick={openGoogleMaps}
                  disabled={!googleMapsUrl}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
                >
                  <ExternalLink size={18} /> Open Route in Google Maps
                </button>

                {routeSections.map((section) => (
                  <div key={section.zone || 'all'}>
                    {section.zone && (
                      <div className="text-xs font-bold uppercase tracking-wider mb-2 px-2 py-1 rounded-lg bg-amber-100 text-amber-800">
                        ⚠ {section.zone} — investigate first
                      </div>
                    )}
                    <div className="space-y-2">
                      {section.stops.map((stop) => {
                        const globalIndex = optimizedRoute.findIndex((s) => s.id === stop.id) + 1;
                        return (
                          <div
                            key={stop.id}
                            className="flex items-start gap-3 p-3 rounded-xl border bg-amber-50 border-amber-200 hover:border-amber-400 transition-colors"
                          >
                            <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                              {globalIndex}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                {REPORT_TYPES[stop.reportType] || stop.reportType}
                                {stop.drainageBlocked && ' · Blocked'}
                              </p>
                              <p className="text-sm font-semibold text-slate-800 truncate">{stop.label}</p>
                              {stop.fullName && (
                                <p className="text-xs text-slate-500 truncate">{stop.fullName}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {lastChecked && (
                <div className="px-4 py-2 border-t border-slate-100 text-[10px] text-slate-400">
                  Weather last checked: {lastChecked.toLocaleTimeString()}
                </div>
              )}
            </div>

            <div className="xl:col-span-2 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner min-h-[360px] h-[420px] xl:h-auto xl:min-h-[500px]">
              <MapContainer center={ABUJA_CENTER} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap"
                />

                <Marker position={ABUJA_CENTER} icon={depotIcon}>
                  <Popup>
                    <b>KanemWaste Depot</b>
                  </Popup>
                </Marker>

                {optimizedRoute.map((stop, index) => (
                  <Marker
                    key={stop.id}
                    position={stop.coordinates}
                    icon={hazardIcon(stop.reportType)}
                  >
                    <Popup>
                      <b>Stop {index + 1}</b>
                      <br />
                      {REPORT_TYPES[stop.reportType]}
                      <br />
                      {stop.label}
                    </Popup>
                  </Marker>
                ))}

                {polylinePositions.length > 1 && (
                  <Polyline
                    positions={polylinePositions}
                    pathOptions={{ color: '#f59e0b', weight: 4, dashArray: '10, 10' }}
                  />
                )}
              </MapContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const StatTile = ({ icon: Icon, label, value, accent = 'green' }) => {
  const accents = {
    green: 'text-[#1a4032] bg-[#C3F53C]/20',
    amber: 'text-amber-600 bg-amber-50',
    red: 'text-red-600 bg-red-50',
    lime: 'text-[#1a4032] bg-[#C3F53C]/30',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${accents[accent]}`}>
        <Icon size={18} />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="text-xl font-bold text-slate-900 mt-0.5">{value}</p>
    </div>
  );
};

export default LogisticsDashboard;
