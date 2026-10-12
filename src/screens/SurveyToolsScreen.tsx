import React, { useState } from 'react';
import {
  latLngToUTM,
  utmToMGRS,
  degToDms,
  calculateTraverseClosure,
  TraverseLeg,
} from '../units';
import { StakeoutCompass } from '../components/StakeoutCompass';
import { DOPMeter } from '../components/DOPMeter';
import { CutFillCalculator } from '../components/CutFillCalculator';
import { Wrench, Plus, Trash2, TrendingUp } from 'lucide-react';

export const SurveyToolsScreen: React.FC = () => {
  const [activeTool, setActiveTool] = useState<
    'coords' | 'closure' | 'stakeout' | 'cutfill' | 'dop' | 'contour'
  >('coords');

  const [latInput, setLatInput] = useState<string>('27.7172');
  const [lngInput, setLngInput] = useState<string>('85.3240');
  const [selectedEpsg, setSelectedEpsg] = useState<string>('EPSG:32645');

  const [traverseLegs, setTraverseLegs] = useState<TraverseLeg[]>([
    { bearingDeg: 45.0, distance: 100.0 },
    { bearingDeg: 135.0, distance: 100.0 },
    { bearingDeg: 225.0, distance: 100.0 },
    { bearingDeg: 315.0, distance: 99.85 },
  ]);
  const [newBearing, setNewBearing] = useState<string>('');
  const [newDistance, setNewDistance] = useState<string>('');

  const [contourInterval, setContourInterval] = useState<number>(1.0);
  const [profilePoints] = useState<number[]>([
    1320.5, 1321.8, 1324.2, 1326.0, 1328.4, 1327.1, 1325.3, 1323.0,
  ]);

  const latNum = parseFloat(latInput) || 0;
  const lngNum = parseFloat(lngInput) || 0;
  const utm = latLngToUTM(latNum, lngNum);
  const mgrs = utmToMGRS(utm);
  const dmsLat = degToDms(latNum, true);
  const dmsLng = degToDms(lngNum, false);

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
    <div className="space-y-4 pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-zinc-300" />
          <h2 className="text-sm font-semibold text-zinc-100">Survey Geomatics Suite</h2>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-xs">
        <button
          onClick={() => setActiveTool('coords')}
          className={`py-2 px-1 rounded-lg border text-center transition-colors ${
            activeTool === 'coords'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          UTM / MGRS
        </button>

        <button
          onClick={() => setActiveTool('stakeout')}
          className={`py-2 px-1 rounded-lg border text-center transition-colors ${
            activeTool === 'stakeout'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          Stakeout
        </button>

        <button
          onClick={() => setActiveTool('closure')}
          className={`py-2 px-1 rounded-lg border text-center transition-colors ${
            activeTool === 'closure'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          Closure Error
        </button>

        <button
          onClick={() => setActiveTool('cutfill')}
          className={`py-2 px-1 rounded-lg border text-center transition-colors ${
            activeTool === 'cutfill'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          Cut / Fill
        </button>

        <button
          onClick={() => setActiveTool('contour')}
          className={`py-2 px-1 rounded-lg border text-center transition-colors ${
            activeTool === 'contour'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          Profile
        </button>

        <button
          onClick={() => setActiveTool('dop')}
          className={`py-2 px-1 rounded-lg border text-center transition-colors ${
            activeTool === 'dop'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          DOP Meter
        </button>
      </div>

      {/* 1. COORDINATE CONVERSION & EPSG */}
      {activeTool === 'coords' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <span className="text-xs font-medium text-zinc-300">Geodetic Coordinates</span>
            <span className="text-[10px] text-zinc-500 font-mono">WGS84</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={latInput}
                onChange={(e) => setLatInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={lngInput}
                onChange={(e) => setLngInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">Coordinate Reference System</label>
            <select
              value={selectedEpsg}
              onChange={(e) => setSelectedEpsg(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100"
            >
              <option value="EPSG:4326">EPSG:4326 - WGS 84 (Geographic 2D)</option>
              <option value="EPSG:32644">EPSG:32644 - WGS 84 / UTM Zone 44N (West Nepal)</option>
              <option value="EPSG:32645">EPSG:32645 - WGS 84 / UTM Zone 45N (Central & East Nepal)</option>
              <option value="EPSG:6207">EPSG:6207 - Everest 1830 / Nepal Nagarkot TM</option>
              <option value="EPSG:3857">EPSG:3857 - Web Mercator</option>
            </select>
          </div>

          {/* Formatted Output */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block">UTM Coordinates</span>
              <span className="text-sm font-mono font-medium text-zinc-200 mt-0.5 block">
                {utm.formatted}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                E: {utm.easting}m | N: {utm.northing}m
              </span>
            </div>

            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block">MGRS Grid</span>
              <span className="text-sm font-mono font-medium text-zinc-200 mt-0.5 block">
                {mgrs}
              </span>
              <span className="text-[10px] text-zinc-500">10m resolution</span>
            </div>

            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 sm:col-span-2">
              <span className="text-[10px] text-zinc-500 uppercase block">DMS Format</span>
              <div className="flex flex-wrap gap-3 mt-0.5 font-mono text-xs text-zinc-300">
                <span>Lat: {dmsLat}</span>
                <span>Lng: {dmsLng}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. STAKEOUT */}
      {activeTool === 'stakeout' && <StakeoutCompass />}

      {/* 3. CLOSURE ERROR */}
      {activeTool === 'closure' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div>
              <h4 className="text-xs font-medium text-zinc-200">Traverse Loop Closure</h4>
              <p className="text-[10px] text-zinc-500">Compass rule / Bowditch balance</p>
            </div>
            <span className="text-xs font-mono text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded">
              {closureResult.relativePrecision}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Bearing (deg)"
              value={newBearing}
              onChange={(e) => setNewBearing(e.target.value)}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 font-mono"
            />
            <input
              type="number"
              placeholder="Distance (m)"
              value={newDistance}
              onChange={(e) => setNewDistance(e.target.value)}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 font-mono"
            />
            <button
              onClick={handleAddTraverseLeg}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium px-3 py-2 rounded-lg transition-colors border border-zinc-700"
            >
              <Plus className="w-3.5 h-3.5 inline mr-1" /> Add
            </button>
          </div>

          <div className="bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900 text-[10px] text-zinc-500 uppercase">
                <tr>
                  <th className="p-2">Leg</th>
                  <th className="p-2">Azimuth</th>
                  <th className="p-2">Distance</th>
                  <th className="p-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 font-mono">
                {traverseLegs.map((leg, idx) => (
                  <tr key={idx}>
                    <td className="p-2 text-zinc-400">P{idx + 1} → P{((idx + 1) % traverseLegs.length) + 1}</td>
                    <td className="p-2 text-zinc-200">{leg.bearingDeg.toFixed(1)}°</td>
                    <td className="p-2 text-zinc-200">{leg.distance.toFixed(2)} m</td>
                    <td className="p-2 text-right">
                      <button onClick={() => handleRemoveTraverseLeg(idx)} className="text-zinc-500 hover:text-zinc-300">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center text-xs">
            <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-500">Total Perimeter</span>
              <span className="font-mono text-zinc-200 font-medium block mt-0.5">
                {closureResult.totalDistance.toFixed(2)} m
              </span>
            </div>
            <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-500">Linear Error</span>
              <span className="font-mono text-zinc-200 font-medium block mt-0.5">
                {closureResult.linearClosureError} m
              </span>
            </div>
            <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-500">Precision</span>
              <span className="font-mono text-zinc-200 font-medium block mt-0.5">
                {closureResult.relativePrecision}
              </span>
            </div>
            <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-500">Error Bearing</span>
              <span className="font-mono text-zinc-200 font-medium block mt-0.5">
                {closureResult.bearingErrorDeg.toFixed(1)}°
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. CUT FILL */}
      {activeTool === 'cutfill' && <CutFillCalculator />}

      {/* 5. CONTOUR PROFILE */}
      {activeTool === 'contour' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-zinc-300" />
              <div>
                <h4 className="text-xs font-medium text-zinc-200">Cross-Section Profile</h4>
                <p className="text-[10px] text-zinc-500">Centerline elevation slice</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span>Interval:</span>
              <input
                type="number"
                value={contourInterval}
                onChange={(e) => setContourInterval(parseFloat(e.target.value) || 1)}
                className="w-12 bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-zinc-200 font-mono text-center text-xs"
              />
              <span>m</span>
            </div>
          </div>

          <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
            <div className="h-40 w-full flex items-end gap-1.5 pt-4">
              {profilePoints.map((elev, idx) => {
                const minElev = 1320;
                const maxElev = 1330;
                const pct = Math.max(10, ((elev - minElev) / (maxElev - minElev)) * 100);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                    <span className="text-[9px] font-mono text-zinc-400 mb-1">
                      {elev.toFixed(1)}
                    </span>
                    <div
                      className="w-full bg-zinc-700 hover:bg-zinc-600 rounded-t transition-all"
                      style={{ height: `${pct}%` }}
                    />
                    <span className="text-[9px] text-zinc-600 mt-1 font-mono">
                      St.{idx * 10}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 6. DOP METER */}
      {activeTool === 'dop' && <DOPMeter />}
    </div>
  );
};
