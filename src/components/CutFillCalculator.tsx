import React, { useState } from 'react';
import { calculateGridEarthwork, calculateEndAreaVolume, EarthworkResult } from '../units';
import { Shovel, Layers, ArrowDownUp, RefreshCw } from 'lucide-react';

export const CutFillCalculator: React.FC = () => {
  const [calcMode, setCalcMode] = useState<'grid' | 'endArea'>('grid');

  // Grid method state
  const [cellSize, setCellSize] = useState<number>(5); // 5 meter grid cells
  const [existingElev, setExistingElev] = useState<string>('120.4, 121.0, 122.2\n120.8, 121.5, 122.8\n121.1, 122.0, 123.4');
  const [designElev, setDesignElev] = useState<string>('121.0, 121.0, 121.0\n121.0, 121.0, 121.0\n121.0, 121.0, 121.0');

  // End area method state
  const [stationDistance, setStationDistance] = useState<number>(20);
  const [station1Area, setStation1Area] = useState<number>(45);
  const [station2Area, setStation2Area] = useState<number>(62);

  // Parse grid matrices
  const parseMatrix = (str: string): number[][] => {
    return str
      .trim()
      .split('\n')
      .map((row) =>
        row
          .split(',')
          .map((v) => parseFloat(v.trim()))
          .filter((v) => !isNaN(v))
      )
      .filter((row) => row.length > 0);
  };

  const existGrid = parseMatrix(existingElev);
  const designGrid = parseMatrix(designElev);
  const gridResult = calculateGridEarthwork(existGrid, designGrid, cellSize);

  const endAreaVol = calculateEndAreaVolume(station1Area, station2Area, stationDistance);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <Shovel className="w-5 h-5 text-amber-400" />
          <div>
            <h4 className="text-sm font-bold text-white">Earthwork Cut & Fill Volumetrics</h4>
            <p className="text-[10px] text-slate-400">Site grading, cut excavation, fill compaction</p>
          </div>
        </div>

        <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
          <button
            onClick={() => setCalcMode('grid')}
            className={`px-2.5 py-1 rounded font-medium ${
              calcMode === 'grid' ? 'bg-slate-800 text-amber-400' : 'text-slate-400'
            }`}
          >
            Grid Cell Method
          </button>
          <button
            onClick={() => setCalcMode('endArea')}
            className={`px-2.5 py-1 rounded font-medium ${
              calcMode === 'endArea' ? 'bg-slate-800 text-amber-400' : 'text-slate-400'
            }`}
          >
            End-Area Method
          </button>
        </div>
      </div>

      {calcMode === 'grid' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Grid Cell Dimension:</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={cellSize}
                onChange={(e) => setCellSize(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-right text-white font-mono text-xs"
              />
              <span className="text-slate-400">meters</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 text-[11px] block mb-1">
                Existing Ground Elevation Grid (m)
              </label>
              <textarea
                rows={3}
                value={existingElev}
                onChange={(e) => setExistingElev(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-400 text-[11px] block mb-1">
                Proposed Grade Elevation Grid (m)
              </label>
              <textarea
                rows={3}
                value={designElev}
                onChange={(e) => setDesignElev(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Results Summary Cards */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="bg-red-950/40 border border-red-800/40 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-red-400 uppercase font-semibold block">Cut Volume</span>
              <span className="text-base font-extrabold text-red-200 font-mono mt-0.5 block">
                {gridResult.cutVolumeCuM} m³
              </span>
              <span className="text-[9px] text-red-400/80 font-mono">({gridResult.cutVolumeCuYd} yd³)</span>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Fill Volume</span>
              <span className="text-base font-extrabold text-emerald-200 font-mono mt-0.5 block">
                {gridResult.fillVolumeCuM} m³
              </span>
              <span className="text-[9px] text-emerald-400/80 font-mono">({gridResult.fillVolumeCuYd} yd³)</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Net Balance</span>
              <span
                className={`text-base font-extrabold font-mono mt-0.5 block ${
                  gridResult.netVolumeCuM >= 0 ? 'text-emerald-300' : 'text-red-300'
                }`}
              >
                {gridResult.netVolumeCuM >= 0 ? `+${gridResult.netVolumeCuM}` : gridResult.netVolumeCuM} m³
              </span>
              <span className="text-[9px] text-slate-500 font-mono">
                {gridResult.netVolumeCuM >= 0 ? 'Borrow Needed' : 'Waste Surplus'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="text-slate-400 text-[10px] block mb-1">Station 1 Area (m²)</label>
              <input
                type="number"
                value={station1Area}
                onChange={(e) => setStation1Area(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
              />
            </div>
            <div>
              <label className="text-slate-400 text-[10px] block mb-1">Station 2 Area (m²)</label>
              <input
                type="number"
                value={station2Area}
                onChange={(e) => setStation2Area(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
              />
            </div>
            <div>
              <label className="text-slate-400 text-[10px] block mb-1">Distance (L in m)</label>
              <input
                type="number"
                value={stationDistance}
                onChange={(e) => setStationDistance(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
              />
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center mt-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">
              Prismoidal Average End Area Volume
            </span>
            <div className="text-2xl font-mono font-extrabold text-amber-400 my-1">
              {endAreaVol.toFixed(2)} m³
            </div>
            <div className="text-xs text-slate-500 font-mono">
              = {(endAreaVol * 1.30795).toFixed(2)} cubic yards
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
