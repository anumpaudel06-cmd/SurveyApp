import React from 'react';
import { MultiUnitAreaResult, ROPANI_SQFT, BIGHA_SQFT } from '../units';

interface NepaliUnitsBreakdownProps {
  results: MultiUnitAreaResult;
}

export const NepaliUnitsBreakdown: React.FC<NepaliUnitsBreakdownProps> = ({ results }) => {
  const ropaniPct = Math.min(100, (results.sqFt / ROPANI_SQFT) * 100);
  const bighaPct = Math.min(100, (results.sqFt / BIGHA_SQFT) * 100);

  return (
    <div className="space-y-4">
      {/* Ropani Breakdown Detail */}
      <div className="bg-slate-900 border border-amber-900/40 rounded-2xl p-4 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-bold text-amber-200">Ropani Subdivision (Hill Regions)</h4>
            <p className="text-xs text-slate-400">1 Ropani = 16 Aana = 64 Paisa = 256 Daam</p>
          </div>
          <span className="text-sm font-extrabold text-amber-400 font-mono bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-800/40">
            {results.ropani.formatted}
          </span>
        </div>

        {/* Visual Progress relative to 1 Ropani */}
        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Progress to 1 Ropani (5,476 sq ft)</span>
            <span className="font-mono text-amber-300">{ropaniPct.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-amber-600 to-yellow-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${ropaniPct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
            <div className="text-slate-400 text-[10px]">Aana Value</div>
            <div className="font-bold text-white text-sm">
              {(results.sqFt / 342.25).toFixed(3)} <span className="text-xs font-normal text-amber-400">Aana</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">342.25 sq ft / aana</div>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
            <div className="text-slate-400 text-[10px]">Daam Value</div>
            <div className="font-bold text-white text-sm">
              {(results.sqFt / 21.39).toFixed(2)} <span className="text-xs font-normal text-amber-400">Daam</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">21.39 sq ft / daam</div>
          </div>
        </div>
      </div>

      {/* Bigha Breakdown Detail */}
      <div className="bg-slate-900 border border-orange-900/40 rounded-2xl p-4 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-bold text-orange-200">Bigha Subdivision (Terai Plains)</h4>
            <p className="text-xs text-slate-400">1 Bigha = 20 Kattha = 400 Dhur</p>
          </div>
          <span className="text-sm font-extrabold text-orange-400 font-mono bg-orange-950/60 px-3 py-1 rounded-xl border border-orange-800/40">
            {results.bigha.formatted}
          </span>
        </div>

        {/* Visual Progress relative to 1 Bigha */}
        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Progress to 1 Bigha (72,900 sq ft)</span>
            <span className="font-mono text-orange-300">{bighaPct.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-orange-600 to-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${bighaPct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
            <div className="text-slate-400 text-[10px]">Kattha Value</div>
            <div className="font-bold text-white text-sm">
              {(results.sqFt / 3645).toFixed(3)} <span className="text-xs font-normal text-orange-400">Kattha</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">3,645 sq ft / kattha</div>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
            <div className="text-slate-400 text-[10px]">Dhur Value</div>
            <div className="font-bold text-white text-sm">
              {(results.sqFt / 182.25).toFixed(2)} <span className="text-xs font-normal text-orange-400">Dhur</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">182.25 sq ft / dhur</div>
          </div>
        </div>
      </div>
    </div>
  );
};
