import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Truck, Navigation, ExternalLink, Calculator, ArrowRight, MapPin, Flag, ChevronDown, Search, Check } from 'lucide-react';
import L from 'leaflet';

// --- LEAFLET ICON FIX ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- EXPANDED ABUJA COORDINATES ---
const ANCHORS = {
  'Central Area': [9.0500, 7.4950],
  'Wuse': [9.0600, 7.4700],
  'Wuse 2': [9.0700, 7.4800],
  'Maitama': [9.0882, 7.4980],
  'Asokoro': [9.0495, 7.5191],
  'Garki': [9.0300, 7.4900],
  'Garki II': [9.0400, 7.4850],
  'Guzape': [9.0350, 7.5100],
  'Utako': [9.0650, 7.4450],
  'Jabi': [9.0765, 7.4200],
  'Wuye': [9.0450, 7.4550],
  'Mabushi': [9.0850, 7.4550],
  'Katampe': [9.0950, 7.4650],
  'Katampe Ext.': [9.1050, 7.4700],
  'Jahi': [9.0850, 7.4350],
  'Gwarimpa': [9.1099, 7.4050],
  'Life Camp': [9.0700, 7.3900],
  'Kado': [9.0800, 7.4100],
  'Dakibiyu': [9.0500, 7.4300],
  'Durumi': [9.0150, 7.4600],
  'Gaduwa': [9.0050, 7.4650],
  'Lokogoma': [8.9900, 7.4700],
  'Apo': [9.0100, 7.4900],
  'Apo Resettlement': [9.0000, 7.5050],
  'Galadimawa': [9.0000, 7.4400],
  'Games Village': [9.0250, 7.4650],
  'Lugbe': [8.9800, 7.3600],
  'Mpape': [9.1400, 7.4900],
  'Dawaki': [9.1300, 7.4100],
  'Kubwa': [9.1500, 7.3300],
  'Dei-Dei': [9.1100, 7.2900],
  'Nyanya': [9.0300, 7.5600],
  'Karu': [9.0100, 7.5500]
};

// --- CUSTOM ICONS ---
const startIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/markers-default/green-2x.png',
    iconSize: [25, 41], iconAnchor: [12, 41]
});
const targetIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/markers-default/red-2x.png',
    iconSize: [25, 41], iconAnchor: [12, 41]
});

// --- SUB-COMPONENT: Custom Dropdown ---
const CustomSelect = ({ label, value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef(null);

    const filteredOptions = options.filter(opt => 
        opt.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">{label}</label>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between border rounded-xl px-4 py-2.5 text-sm font-medium bg-slate-50 transition-all
                    ${isOpen ? 'border-green-500 ring-2 ring-green-100' : 'border-slate-300 hover:border-green-400'}
                `}
            >
                <span className="truncate">{value}</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 z-[1000] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 border-b border-slate-100 bg-slate-50">
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1.5">
                            <Search size={14} className="text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search area..." 
                                className="w-full text-xs outline-none text-slate-700 placeholder:text-slate-400"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto p-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        onChange(opt);
                                        setIsOpen(false);
                                        setSearch('');
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between group transition-colors
                                        ${value === opt ? 'bg-green-50 text-green-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}
                                    `}
                                >
                                    <span>{opt}</span>
                                    {value === opt && <Check size={14} className="text-green-600" />}
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center text-xs text-slate-400">No areas found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MAIN COMPONENT ---
const RouteOptimizer = ({ pickups = [] }) => {
  const [startPoint, setStartPoint] = useState('Jabi');
  const [targetPoint, setTargetPoint] = useState('Central Area');
  const [routeStep, setRouteStep] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [totalDist, setTotalDist] = useState(0);

  const getDistance = ([lat1, lon1], [lat2, lon2]) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
  };

  const generateSimulatedCoords = (zoneName, index) => {
    const base = ANCHORS[zoneName] || [9.05, 7.45];
    const latOffset = (((index * 13) % 100) / 10000) - 0.005; 
    const lngOffset = (((index * 7) % 100) / 10000) - 0.005;
    return [base[0] + latOffset, base[1] + lngOffset];
  };

  const permute = (arr) => {
    if (arr.length > 9) return null;
    let result = [];
    const backtrack = (current, remaining) => {
      if (remaining.length === 0) {
        result.push(current);
        return;
      }
      for (let i = 0; i < remaining.length; i++) {
        backtrack([...current, remaining[i]], remaining.filter((_, idx) => idx !== i));
      }
    };
    backtrack([], arr);
    return result;
  };

  const runOptimization = () => {
    setIsOptimizing(true);
    
    setTimeout(() => {
      try {
        const pendingPickups = pickups.filter(p => p.status === 'Pending');
        let stops = [];

        pendingPickups.forEach((pickup, idx) => {
            let matchedZone = 'Unclassified';
            const addressLower = pickup.address.toLowerCase();
            Object.keys(ANCHORS).forEach(zone => {
            if (addressLower.includes(zone.toLowerCase())) matchedZone = zone;
            });

            if (matchedZone !== 'Unclassified') {
                stops.push({
                    id: pickup.id,
                    name: pickup.address,
                    zone: matchedZone,
                    coords: generateSimulatedCoords(matchedZone, idx)
                });
            }
        });

        if (stops.length === 0) {
            alert("No pending pickups found that match the known zones.");
            setIsOptimizing(false);
            return;
        }

        let bestOrder = [];
        let minTotalDistance = Infinity;
        const startCoords = ANCHORS[startPoint];
        const targetCoords = ANCHORS[targetPoint];

        if (stops.length < 9) {
            const allPermutations = permute(stops);
            if (allPermutations && allPermutations.length > 0) {
                allPermutations.forEach(order => {
                    let currentDist = getDistance(startCoords, order[0].coords);
                    for (let i = 0; i < order.length - 1; i++) {
                        currentDist += getDistance(order[i].coords, order[i+1].coords);
                    }
                    currentDist += getDistance(order[order.length - 1].coords, targetCoords);

                    if (currentDist < minTotalDistance) {
                        minTotalDistance = currentDist;
                        bestOrder = order;
                    }
                });
            }
        } else {
            let currentPos = startCoords;
            let remaining = [...stops];
            let distSum = 0;
            while (remaining.length > 0) {
                let nearestIdx = -1;
                let minDist = Infinity;
                remaining.forEach((stop, i) => {
                    const d = getDistance(currentPos, stop.coords);
                    if (d < minDist) { minDist = d; nearestIdx = i; }
                });
                const nextStop = remaining[nearestIdx];
                distSum += minDist;
                bestOrder.push(nextStop);
                currentPos = nextStop.coords;
                remaining.splice(nearestIdx, 1);
            }
            distSum += getDistance(currentPos, targetCoords);
            minTotalDistance = distSum;
        }

        const finalPath = [];
        finalPath.push({ type: 'start', name: startPoint, zone: startPoint, coords: startCoords });

        let prevPos = startCoords;
        if (bestOrder.length > 0) {
            bestOrder.forEach((stop) => {
                const legDist = getDistance(prevPos, stop.coords);
                finalPath.push({
                    type: 'stop',
                    name: stop.name,
                    zone: stop.zone,
                    coords: stop.coords,
                    distFromPrev: legDist.toFixed(2)
                });
                prevPos = stop.coords;
            });
        }

        const finalLeg = getDistance(prevPos, targetCoords);
        finalPath.push({ type: 'target', name: targetPoint, zone: targetPoint, coords: targetCoords, distFromPrev: finalLeg.toFixed(2) });

        setRouteStep(finalPath);
        setTotalDist(minTotalDistance.toFixed(2));
      } catch (error) {
          console.error("Optimization Error:", error);
          alert("An error occurred during calculation.");
      } finally {
          setIsOptimizing(false);
      }
    }, 1200);
  };

  const openGoogleMaps = () => {
    if (routeStep.length < 2) return;
    const origin = routeStep[0].coords.join(',');
    const destination = routeStep[routeStep.length - 1].coords.join(',');
    const waypoints = routeStep.slice(1, routeStep.length - 1).map(step => step.coords.join(',')).join('|');
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const getVisualSequence = () => {
      if (routeStep.length === 0) return [];
      const sequence = [];
      let lastZone = null;
      routeStep.forEach(step => {
          if (step.zone !== lastZone) {
              sequence.push({ type: step.type, label: step.zone });
              lastZone = step.zone;
          }
      });
      return sequence;
  };

  const visualSequence = getVisualSequence();
  const getShortName = (name) => name.length > 20 ? name.substring(0, 20) + "..." : name;

  return (
    <div className="h-full flex flex-col gap-6">
      
      {/* VISUAL SEQUENCE BAR */}
      {visualSequence.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 animate-in slide-in-from-top-4">
             <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Truck className="text-green-600" /> Route Overview
                 </h3>
                 <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {totalDist} KM Total
                 </span>
             </div>
             
             <div className="overflow-x-auto pb-2">
                <div className="flex items-center gap-4 min-w-max">
                    {visualSequence.map((step, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && <div className="text-slate-300"><ArrowRight size={24} strokeWidth={3} /></div>}
                            <div className={`
                                flex flex-col items-center justify-center px-6 py-3 rounded-xl border-2 shadow-sm min-w-[120px]
                                ${step.type === 'start' ? 'bg-[#1a4032] text-white border-[#1a4032]' : 
                                step.type === 'target' ? 'bg-red-500 text-white border-red-500' : 
                                'bg-white text-slate-800 border-slate-200 hover:border-green-400'}
                            `}>
                                <div className="flex items-center gap-2 mb-1">
                                    {step.type === 'start' && <MapPin size={16} className="text-[#C3F53C]" />}
                                    {step.type === 'target' && <Flag size={16} className="text-white" />}
                                    <span className="text-[10px] font-bold uppercase opacity-80">
                                        {step.type === 'start' ? 'Start' : step.type === 'target' ? 'End' : 'Area'}
                                    </span>
                                </div>
                                <span className="font-bold text-lg">{step.label}</span>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
             </div>
        </div>
      )}

      {/* CONTROLS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="md:col-span-1">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Navigation className="text-green-600" /> Granular AI
            </h2>
            <p className="text-xs text-slate-500">Stop-by-stop optimization.</p>
        </div>
        
        {/* CUSTOM DROPDOWNS */}
        <div className="z-20">
            <CustomSelect 
                label="Start Point" 
                value={startPoint} 
                onChange={setStartPoint} 
                options={Object.keys(ANCHORS).sort()} 
            />
        </div>
        <div className="z-10">
            <CustomSelect 
                label="Target Point" 
                value={targetPoint} 
                onChange={setTargetPoint} 
                options={Object.keys(ANCHORS).sort()} 
            />
        </div>

        <button 
            onClick={runOptimization}
            disabled={isOptimizing}
            className="bg-[#1a4032] hover:bg-green-800 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 h-[42px]"
        >
            {isOptimizing ? 'Calculating...' : 'Calculate Optimal Path'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
        {/* Sequence List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-0 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-700">Detailed Stops</h3>
            </div>
            
            <div className="overflow-y-auto flex-1 p-4 space-y-4">
                {routeStep.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        <Calculator size={40} className="mx-auto mb-2 opacity-50" />
                        <p>Ready to calculate.</p>
                    </div>
                ) : (
                    <>
                        <button onClick={openGoogleMaps} className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95">
                            <ExternalLink size={18} /> Open Route in Google Maps
                        </button>

                        <div className="relative border-l-2 border-dashed border-slate-300 ml-3 space-y-8 pb-2">
                            {routeStep.map((step, index) => (
                                <div key={index} className="relative pl-6">
                                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${step.type === 'start' ? 'bg-green-500' : step.type === 'target' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl hover:border-green-500 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-slate-800 text-sm">
                                                {step.type === 'start' ? 'START' : step.type === 'target' ? 'END' : `STOP ${index}`}
                                            </h4>
                                            {step.distFromPrev && <span className="text-[10px] bg-white border px-1.5 rounded text-slate-500">{step.distFromPrev} km</span>}
                                        </div>
                                        <p className="text-xs text-slate-600 mt-1 truncate">{step.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-2 bg-slate-100 rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative z-0">
          <MapContainer center={ANCHORS['Wuse']} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='© OpenStreetMap' />
            {routeStep.map((step, index) => (
               <React.Fragment key={index}>
                   <Marker position={step.coords} icon={step.type === 'start' ? startIcon : step.type === 'target' ? targetIcon : new L.Icon.Default()}>
                       <Popup><b>{step.name}</b></Popup>
                   </Marker>
               </React.Fragment>
            ))}
            {routeStep.length > 1 && <Polyline positions={routeStep.map(s => s.coords)} pathOptions={{ color: '#1a4032', weight: 4, dashArray: '10, 10' }} />}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default RouteOptimizer;