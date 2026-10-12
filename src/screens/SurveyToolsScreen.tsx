import React, { useState } from 'react';
import {
  latLngToUTM,
  utmToMGRS,
  degToDms,
  dmsToDeg,
  calculateTraverseClosure,
  TraverseLeg,
} from '../units';
import { StakeoutCompass } from '../components/StakeoutCompass';
import { DOPMeter } from '../components/DOPMeter';
import { CutFillCalculator } from '../components/CutFillCalculator';
import {
  Wrench,
  Navigation,
  Compass,
  Shovel,
  Activity,
  Layers,
  MapPin,
  TrendingUp,
  Plus,
  Trash2,
  CheckCircle,
} from 'lucide-react';

export const SurveyToolsScreen: React.FC = () => {
  const [activeTool, setActiveTool] = useState<
    'coords' | 'closure' | 'stakeout' | 'cutfill' | 'dop' | 'contour'
  >('coords');

  // Coordinate Conversion state
  const [latInput, setLatInput] = useState<string>('27.7172');
  const [lngInput, setLngInput] = useState<string>('85.3240');
  const [selectedEpsg, setSelectedEpsg] = useState<string>('EPSG:32645'); // UTM Zone 45N (Central & East Nepal)

  // Traverse Closure Error state
  const [traverseLegs, setTraverseLegs] = useState<TraverseLeg[]>([
    { bearingDeg: 45.0, distance: 100.0 },
    { bearingDeg: 135.0, distance: 100.0 },
    { bearingDeg: 225.0, distance: 100.0 },
    { bearingDeg: 315.0, distance: 99.85 }, // small intentional 0.15m error
  ]);
  const [newBearing, setNewBearing] = useState<string>('');
  const [newDistance, setNewDistance] = useState<string>('');

  // Contour & Profile state
  const [contourInterval, setContourInterval] = useState<number>(1.0); // 1 meter intervals
  const [profilePoints, setProfilePoints] = useState<number[]>([
    1320.5, 1321.8, 1324.2, 1326.0, 1328.4, 1327.1, 1325.3, 1323.0,
  ]);

  // Coordinates Calculations
  const latNum = parseFloat(latInput) || 0;
  const lngNum = parseFloat(lngInput) || 0;
  const utm = latLngToUTM(latNum, lngNum);
  const mgrs = utmToMGRS(utm);
  const dmsLat = degToDms(latNum, true);
  const dmsLng = degToDms(lngNum, false);

  // Traverse calculation
  const closureResult = calculateTraverseClosure(traverseLegs);

  const handleAddTraverseLeg = () => {
    const b = parseFloat(newBearing);
    const d = parseFloat(newDistance);
    if (!isNaN(b) && !isNaN(d) && d > 0) {
      setTraverseLegs([...traverseLegs, { bearingDeg: b, distance: d }]);
      setNewBearing('');
      setNewDistance('');
    }
  };

  const handleRemoveTraverseLeg = (idx: number) => {
    setTraverseLegs(traverseLegs.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-5 pb-8 max-w-3xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
            Field Geomatics Suite
          </span>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-emerald-400" /> Professional Survey Tools
          </h2>
        </div>
      </div>

      {/* Sub-Tool Navigation Pills */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
        <button
          onClick={() => setActiveTool('coords')}
          className={`py-2 px-2 rounded-xl text-xs font-semibold text-center border transition-all ${
            activeTool === 'coords'
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          UTM / MGRS
        </button>

        <button
          onClick={() => setActiveTool('stakeout')}
          className={`py-2 px-2 rounded-xl text-xs font-semibold text-center border transition-all ${
            activeTool === 'stakeout'
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          Stakeout
        </button>

        <button
          onClick={() => setActiveTool('closure')}
          className={`py-2 px-2 rounded-xl text-xs font-semibold text-center border transition-all ${
            activeTool === 'closure'
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          Closure Error
        </button>

        <button
          onClick={() => setActiveTool('cutfill')}
          className={`py-2 px-2 rounded-xl text-xs font-semibold text-center border transition-all ${
            activeTool === 'cutfill'
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          Cut / Fill
        </button>

        <button
          onClick={() => setActiveTool('contour')}
          className={`py-2 px-2 rounded-xl text-xs font-semibold text-center border transition-all ${
            activeTool === 'contour'
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          Section Profile
        </button>

        <button
          onClick={() => setActiveTool('dop')}
          className={`py-2 px-2 rounded-xl text-xs font-semibold text-center border transition-all ${
            activeTool === 'dop'
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          PDOP Meter
        </button>
      </div>

      {/* 1. COORDINATE CONVERSION & EPSG */}
      {activeTool === 'coords' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white">Geodetic & Projected Coordinate Systems</span>
              <span className="text-[10px] text-emerald-400 font-mono">WGS84 / Nagarkot Datum</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Latitude (Decimal)</label>
                <input
                  type="number"
                  step="any"
                  value={latInput}
                  onChange={(e) => setLatInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-white text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Longitude (Decimal)</label>
                <input
                  type="number"
                  step="any"
                  value={lngInput}
                  onChange={(e) => setLngInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">EPSG Coordinate Reference System (CRS)</label>
              <select
                value={selectedEpsg}
                onChange={(e) => setSelectedEpsg(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="EPSG:4326">EPSG:4326 - WGS 84 (Global Geographic 2D)</option>
                <option value="EPSG:32644">EPSG:32644 - WGS 84 / UTM Zone 44N (Western Nepal)</option>
                <option value="EPSG:32645">EPSG:32645 - WGS 84 / UTM Zone 45N (Central & Eastern Nepal)</option>
                <option value="EPSG:6207">EPSG:6207 - Everest 1830 / Nepal Nagarkot TM 84</option>
                <option value="EPSG:3857">EPSG:3857 - WGS 84 / Pseudo-Mercator</option>
              </select>
            </div>

            {/* Formatted Output Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">UTM Coordinates</span>
                <span className="text-base font-mono font-bold text-emerald-400 mt-1 block">
                  {utm.formatted}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Easting: {utm.easting}m | Northing: {utm.northing}m
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">MGRS Grid</span>
                <span className="text-base font-mono font-bold text-amber-300 mt-1 block">
                  {mgrs}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">NATO military grid 10m res</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 sm:col-span-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">DMS (Degrees Minutes Seconds)</span>
                <div className="flex flex-wrap gap-4 mt-1 font-mono text-sm text-sky-300 font-bold">
                  <span>Lat: {dmsLat}</span>
                  <span>Lng: {dmsLng}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. STAKEOUT NAVIGATION */}
      {activeTool === 'stakeout' && <StakeoutCompass />}

      {/* 3. TRAVERSE CLOSURE ERROR & PRECISION */}
      {activeTool === 'closure' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-white">Traverse Loop Closure & Compass Rule (Bowditch)</h4>
              <p className="text-[10px] text-slate-400">Total Station / Theodolite closed traverse balance</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              {closureResult.relativePrecision}
            </span>
          </div>

          {/* Add Leg Input */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Bearing (deg 0-360)"
              value={newBearing}
              onChange={(e) => setNewBearing(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
            />
            <input
              type="number"
              placeholder="Distance (meters)"
              value={newDistance}
              onChange={(e) => setNewDistance(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
            />
            <button
              onClick={handleAddTraverseLeg}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Leg
            </button>
          </div>

          {/* Legs Table */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-[10px] text-slate-400 uppercase">
                <tr>
                  <th className="p-2.5">Leg</th>
                  <th className="p-2.5">Bearing (Azimuth)</th>
                  <th className="p-2.5">Distance</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {traverseLegs.map((leg, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50">
                    <td className="p-2.5 text-slate-300">P{idx + 1} → P{((idx + 1) % traverseLegs.length) + 1}</td>
                    <td className="p-2.5 text-amber-300">{leg.bearingDeg.toFixed(1)}°</td>
                    <td className="p-2.5 text-sky-300">{leg.distance.toFixed(2)} m</td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => handleRemoveTraverseLeg(idx)}
                        className="text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Results Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400">Total Perimeter</span>
              <span className="font-mono font-bold text-white text-sm block mt-0.5">
                {closureResult.totalDistance.toFixed(2)} m
              </span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400">Linear Error (e)</span>
              <span className="font-mono font-bold text-amber-400 text-sm block mt-0.5">
                {closureResult.linearClosureError} m
              </span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400">Precision Ratio</span>
              <span className="font-mono font-bold text-emerald-400 text-sm block mt-0.5">
                {closureResult.relativePrecision}
              </span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400">Closure Bearing</span>
              <span className="font-mono font-bold text-sky-400 text-sm block mt-0.5">
                {closureResult.bearingErrorDeg.toFixed(1)}°
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. EARTHWORK CUT / FILL */}
      {activeTool === 'cutfill' && <CutFillCalculator />}

      {/* 5. CONTOUR & SECTION PROFILE */}
      {activeTool === 'contour' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="text-xs font-bold text-white">Cross-Section Elevation Profile</h4>
                <p className="text-[10px] text-slate-400">Topographic slice across surveyed centerline</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Interval:</span>
              <input
                type="number"
                value={contourInterval}
                onChange={(e) => setContourInterval(parseFloat(e.target.value) || 1)}
                className="w-14 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-white font-mono text-center text-xs"
              />
              <span>m</span>
            </div>
          </div>

          {/* SVG Profile Chart */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="h-44 w-full flex items-end gap-2 pt-6">
              {profilePoints.map((elev, idx) => {
                const minElev = 1320;
                const maxElev = 1330;
                const pct = Math.max(10, ((elev - minElev) / (maxElev - minElev)) * 100);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-[9px] font-mono text-emerald-400 mb-1 opacity-80 group-hover:opacity-100">
                      {elev.toFixed(1)}m
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-emerald-900 to-emerald-500 rounded-t border-t border-emerald-400 transition-all duration-300"
                      style={{ height: `${pct}%` }}
                    />
                    <span className="text-[9px] text-slate-500 mt-1 font-mono">
                      St.{idx * 10}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
            <span>Centerline: Station 0+00 to Station 0+70 (70m Length)</span>
            <span className="font-mono text-emerald-400 font-bold">Slope: +1.1% Average</span>
          </div>
        </div>
      )}

      {/* 6. DOP & GNSS HEALTH METER */}
      {activeTool === 'dop' && <DOPMeter />}
    </div>
  );
};
