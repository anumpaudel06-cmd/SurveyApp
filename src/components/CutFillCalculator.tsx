import React, { useState } from 'react';
import { calculateGridEarthwork, calculateEndAreaVolume } from '../units';
import { Shovel } from 'lucide-react';

export const CutFillCalculator: React.FC = () => {
  const [calcMode, setCalcMode] = useState<'grid' | 'endArea'>('grid');

  const [cellSize, setCellSize] = useState<number>(5);
  const [existingElev, setExistingElev] = useState<string>('120.4, 121.0, 122.2\n120.8, 121.5, 122.8\n121.1, 122.0, 123.4');
  const [designElev, setDesignElev] = useState<string>('121.0, 121.0, 121.0\n121.0, 121.0, 121.0\n121.0, 121.0, 121.0');

  const [stationDistance, setStationDistance] = useState<number>(20);
  const [station1Area, setStation1Area] = useState<number>(45);
  const [station2Area, setStation2Area] = useState<number>(62);

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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
        <div className="flex items-center gap-2">
          <Shovel className="w-4 h-4 text-zinc-300" />
          <div>
            <h4 className="text-xs font-semibold text-zinc-200">Earthwork Cut & Fill Calculation</h4>
            <p className="text-[10px] text-zinc-500">Grading volume calculations</p>
          </div>
        </div>

        <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-[11px]">
          <button
            onClick={() => setCalcMode('grid')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              calcMode === 'grid' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500'
            }`}
          >
            Grid Cell
          </button>
          <button
            onClick={() => setCalcMode('endArea')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              calcMode === 'endArea' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500'
            }`}
          >
            End-Area
          </button>
        </div>
      </div>

      {calcMode === 'grid' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">Grid Cell Dimension:</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={cellSize}
                onChange={(e) => setCellSize(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-16 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-right text-zinc-200 font-mono text-xs"
              />
              <span className="text-zinc-500">meters</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-zinc-400 text-[11px] block mb-1">
                Existing Ground Elevation Grid (m)
              </label>
              <textarea
                rows={3}
                value={existingElev}
                onChange={(e) => setExistingElev(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
              />
            </div>
            <div>
              <label className="text-zinc-400 text-[11px] block mb-1">
                Proposed Grade Elevation Grid (m)
              </label>
              <textarea
                rows={3}
                value={designElev}
                onChange={(e) => setDesignElev(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>

          {/* Volume Summary */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-center">
              <span className="text-[10px] text-zinc-500 uppercase font-medium block">Cut Volume</span>
              <span className="text-sm font-bold text-zinc-100 font-mono mt-0.5 block">
                {gridResult.cutVolumeCuM} m³
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">({gridResult.cutVolumeCuYd} yd³)</span>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-center">
              <span className="text-[10px] text-zinc-500 uppercase font-medium block">Fill Volume</span>
              <span className="text-sm font-bold text-zinc-100 font-mono mt-0.5 block">
                {gridResult.fillVolumeCuM} m³
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">({gridResult.fillVolumeCuYd} yd³)</span>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-center">
              <span className="text-[10px] text-zinc-500 uppercase font-medium block">Net Balance</span>
              <span className="text-sm font-bold font-mono mt-0.5 block text-zinc-100">
                {gridResult.netVolumeCuM >= 0 ? `+${gridResult.netVolumeCuM}` : gridResult.netVolumeCuM} m³
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">
                {gridResult.netVolumeCuM >= 0 ? 'Borrow Needed' : 'Waste Surplus'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="text-zinc-400 text-[10px] block mb-1">Station 1 Area (m²)</label>
              <input
                type="number"
                value={station1Area}
                onChange={(e) => setStation1Area(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
              />
            </div>
            <div>
              <label className="text-zinc-400 text-[10px] block mb-1">Station 2 Area (m²)</label>
              <input
                type="number"
                value={station2Area}
                onChange={(e) => setStation2Area(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
              />
            </div>
            <div>
              <label className="text-zinc-400 text-[10px] block mb-1">Distance (m)</label>
              <input
                type="number"
                value={stationDistance}
                onChange={(e) => setStationDistance(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
              />
            </div>
          </div>

          <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-center mt-2">
            <span className="text-xs text-zinc-500 uppercase tracking-wide block">
              Average End Area Volume
            </span>
            <div className="text-xl font-mono font-bold text-zinc-100 my-1">
              {endAreaVol.toFixed(2)} m³
            </div>
            <div className="text-xs text-zinc-500 font-mono">
              = {(endAreaVol * 1.30795).toFixed(2)} cu yd
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
