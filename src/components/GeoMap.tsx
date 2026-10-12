import React, { useState, useEffect, useRef } from 'react';
import { GeoPoint, geodesicPolygonAreaSqM, haversineDistanceMeters, latLngToUTM, utmToMGRS, degToDms } from '../units';
import { Crosshair, Navigation, Plus, Minus, Trash2 } from 'lucide-react';

interface GeoMapProps {
  onAreaChange?: (areaSqFt: number, points: GeoPoint[]) => void;
}

export const GeoMap: React.FC<GeoMapProps> = ({ onAreaChange }) => {
  const [center, setCenter] = useState<GeoPoint>({ lat: 27.7172, lng: 85.3240 });
  const [zoom, setZoom] = useState<number>(17);
  const [mapType, setMapType] = useState<'satellite' | 'street' | 'topo'>('street');
  
  const [points, setPoints] = useState<GeoPoint[]>([
    { lat: 27.7175, lng: 85.3235 },
    { lat: 27.7180, lng: 85.3242 },
    { lat: 27.7176, lng: 85.3249 },
    { lat: 27.7169, lng: 85.3243 },
  ]);

  const [isLocating, setIsLocating] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const areaSqM = geodesicPolygonAreaSqM(points);
  const areaSqFt = areaSqM * 10.7639;

  useEffect(() => {
    if (onAreaChange) {
      onAreaChange(areaSqFt, points);
    }
  }, [points]);

  const latLngToPixel = (p: GeoPoint, width: number, height: number) => {
    const scale = Math.pow(2, zoom) * 256 / 360;
    const x = width / 2 + (p.lng - center.lng) * scale;
    const latRad = (p.lat * Math.PI) / 180;
    const centerLatRad = (center.lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const centerMercN = Math.log(Math.tan(Math.PI / 4 + centerLatRad / 2));
    const y = height / 2 - (mercN - centerMercN) * (scale * 180 / Math.PI);
    return { x, y };
  };

  const pixelToLatLng = (x: number, y: number, width: number, height: number): GeoPoint => {
    const scale = Math.pow(2, zoom) * 256 / 360;
    const lng = center.lng + (x - width / 2) / scale;
    const centerLatRad = (center.lat * Math.PI) / 180;
    const centerMercN = Math.log(Math.tan(Math.PI / 4 + centerLatRad / 2));
    const mercN = centerMercN - ((y - height / 2) / (scale * 180 / Math.PI));
    const latRad = 2 * (Math.atan(Math.exp(mercN)) - Math.PI / 4);
    const lat = (latRad * 180) / Math.PI;
    return { lat, lng };
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newGeo = pixelToLatLng(x, y, rect.width, rect.height);
    setPoints([...points, newGeo]);
  };

  const handleCurrentGPS = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCenter(loc);
          setPoints((prev) => [...prev, loc]);
          setIsLocating(false);
        },
        () => {
          const jitterLat = center.lat + (Math.random() - 0.5) * 0.0004;
          const jitterLng = center.lng + (Math.random() - 0.5) * 0.0004;
          const loc = { lat: jitterLat, lng: jitterLng };
          setPoints((prev) => [...prev, loc]);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const centerUTM = latLngToUTM(center.lat, center.lng);
  const centerMGRS = utmToMGRS(centerUTM);

  const width = containerRef.current?.clientWidth || 400;
  const height = containerRef.current?.clientHeight || 320;

  const projectedPoints = points.map((p) => latLngToPixel(p, width, height));
  const polygonPointsStr = projectedPoints.map((p) => `${p.x},${p.y}`).join(' ');

  let perimeterMeters = 0;
  for (let i = 0; i < points.length; i++) {
    const next = (i + 1) % points.length;
    perimeterMeters += haversineDistanceMeters(points[i], points[next]);
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Top Map Bar */}
      <div className="bg-zinc-950 px-3.5 py-2.5 border-b border-zinc-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-300">Geodesic Map Plotter</span>
          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">
            {points.length} Points
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-[10px]">
            <button
              onClick={() => setMapType('street')}
              className={`px-2 py-0.5 rounded font-medium ${
                mapType === 'street' ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-2 py-0.5 rounded font-medium ${
                mapType === 'satellite' ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapType('topo')}
              className={`px-2 py-0.5 rounded font-medium ${
                mapType === 'topo' ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500'
              }`}
            >
              Topo
            </button>
          </div>

          <button
            onClick={() => setZoom((z) => Math.min(20, z + 1))}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            title="Zoom In"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(12, z - 1))}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            title="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setPoints([])}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            title="Clear"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Map Surface */}
      <div
        ref={containerRef}
        onClick={handleMapClick}
        className="relative w-full h-80 sm:h-96 bg-zinc-950 cursor-crosshair overflow-hidden select-none"
      >
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, #71717a 1px, transparent 1px), linear-gradient(to bottom, #71717a 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Center reticle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-25">
          <div className="w-6 h-6 border border-zinc-400 rounded-full" />
          <div className="w-px h-8 bg-zinc-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="w-8 h-px bg-zinc-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Polygon Vector Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {projectedPoints.length >= 3 && (
            <polygon
              points={polygonPointsStr}
              fill="rgba(255, 255, 255, 0.08)"
              stroke="#e4e4e7"
              strokeWidth="1.8"
            />
          )}

          {projectedPoints.length === 2 && (
            <line
              x1={projectedPoints[0].x}
              y1={projectedPoints[0].y}
              x2={projectedPoints[1].x}
              y2={projectedPoints[1].y}
              stroke="#e4e4e7"
              strokeWidth="1.8"
            />
          )}

          {/* Segment lengths */}
          {points.map((p, idx) => {
            if (points.length < 2) return null;
            const nextIdx = (idx + 1) % points.length;
            if (points.length === 2 && idx === 1) return null;
            const nextGeo = points[nextIdx];
            const p1 = projectedPoints[idx];
            const p2 = projectedPoints[nextIdx];
            if (!p1 || !p2) return null;

            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            const distM = haversineDistanceMeters(p, nextGeo);

            return (
              <g key={`dist-${idx}`}>
                <rect
                  x={midX - 22}
                  y={midY - 8}
                  width="44"
                  height="16"
                  rx="3"
                  fill="#18181b"
                  stroke="#3f3f46"
                  strokeWidth="0.8"
                />
                <text
                  x={midX}
                  y={midY + 3}
                  textAnchor="middle"
                  fill="#d4d4d8"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {distM.toFixed(1)}m
                </text>
              </g>
            );
          })}
        </svg>

        {/* Markers */}
        {projectedPoints.map((p, idx) => (
          <div
            key={`pin-${idx}`}
            style={{ left: `${p.x}px`, top: `${p.y}px` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
          >
            <div className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-950 flex items-center justify-center text-[10px] font-bold text-zinc-950 shadow-sm">
              {idx + 1}
            </div>
          </div>
        ))}

        {/* Location Trigger */}
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={handleCurrentGPS}
            disabled={isLocating}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 p-2 rounded-lg border border-zinc-700 transition-colors"
            title="Mark current position"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* HUD Info */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 pointer-events-auto flex items-center gap-3">
            <div>
              <span className="text-[10px] text-zinc-500 block">Area</span>
              <span className="font-mono font-semibold text-zinc-100">
                {areaSqM.toFixed(1)} m²
              </span>
            </div>
            <div className="h-5 w-px bg-zinc-800" />
            <div>
              <span className="text-[10px] text-zinc-500 block">Perimeter</span>
              <span className="font-mono font-semibold text-zinc-300">{perimeterMeters.toFixed(1)} m</span>
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg px-2.5 py-1 text-[11px] text-zinc-400 pointer-events-auto font-mono">
            UTM: {centerUTM.formatted}
          </div>
        </div>
      </div>

      <div className="px-3.5 py-2 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
        <div>Center: {degToDms(center.lat, true)} | {degToDms(center.lng, false)}</div>
        <div className="font-mono">MGRS: {centerMGRS}</div>
      </div>
    </div>
  );
};
