import React from 'react';
import { MultiUnitAreaResult, ROPANI_SQFT, BIGHA_SQFT } from '../units';

interface NepaliUnitsBreakdownProps {
  results: MultiUnitAreaResult;
}

export const NepaliUnitsBreakdown: React.FC<NepaliUnitsBreakdownProps> = ({ results }) => {
  const ropaniPct = Math.min(100, (results.sqFt / ROPANI_SQFT) * 100);
  const bighaPct = Math.min(100, (results.sqFt / BIGHA_SQFT) * 100);

  return (
    <div className="space-y-3">
      {/* Ropani Breakdown Detail */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-xs font-semibold text-zinc-200">Ropani Subdivision (Hill Districts)</h4>
            <p className="text-[11px] text-zinc-500">1 Ropani = 16 Aana = 64 Paisa = 256 Daam</p>
          </div>
          <span className="text-xs font-mono font-bold text-zinc-200 bg-zinc-800 px-2.5 py-1 rounded">
            {results.ropani.formatted}
          </span>
        </div>

        {/* Minimal Progress Bar */}
        <div className="space-y-1 mb-3">
          <div className="flex justify-between text-[11px] text-zinc-400">
            <span>Share of 1 Ropani (5,476 sq ft)</span>
            <span className="font-mono text-zinc-300">{ropaniPct.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden border border-zinc-800/60">
            <div
              className="bg-zinc-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${ropaniPct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80">
            <div className="text-zinc-500 text-[10px]">Aana Equivalent</div>
            <div className="font-semibold text-zinc-100 text-sm mt-0.5">
              {(results.sqFt / 342.25).toFixed(3)} <span className="text-xs font-normal text-zinc-500">Aana</span>
            </div>
            <div className="text-[10px] text-zinc-600 mt-0.5">342.25 sq ft/aana</div>
          </div>

          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80">
            <div className="text-zinc-500 text-[10px]">Daam Equivalent</div>
            <div className="font-semibold text-zinc-100 text-sm mt-0.5">
              {(results.sqFt / 21.39).toFixed(2)} <span className="text-xs font-normal text-zinc-500">Daam</span>
            </div>
            <div className="text-[10px] text-zinc-600 mt-0.5">21.39 sq ft/daam</div>
          </div>
        </div>
      </div>

      {/* Bigha Breakdown Detail */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-xs font-semibold text-zinc-200">Bigha Subdivision (Terai Districts)</h4>
            <p className="text-[11px] text-zinc-500">1 Bigha = 20 Kattha = 400 Dhur</p>
          </div>
          <span className="text-xs font-mono font-bold text-zinc-200 bg-zinc-800 px-2.5 py-1 rounded">
            {results.bigha.formatted}
          </span>
        </div>

        {/* Minimal Progress Bar */}
        <div className="space-y-1 mb-3">
          <div className="flex justify-between text-[11px] text-zinc-400">
            <span>Share of 1 Bigha (72,900 sq ft)</span>
            <span className="font-mono text-zinc-300">{bighaPct.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden border border-zinc-800/60">
            <div
              className="bg-zinc-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${bighaPct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80">
            <div className="text-zinc-500 text-[10px]">Kattha Equivalent</div>
            <div className="font-semibold text-zinc-100 text-sm mt-0.5">
              {(results.sqFt / 3645).toFixed(3)} <span className="text-xs font-normal text-zinc-500">Kattha</span>
            </div>
            <div className="text-[10px] text-zinc-600 mt-0.5">3,645 sq ft/kattha</div>
          </div>

          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80">
            <div className="text-zinc-500 text-[10px]">Dhur Equivalent</div>
            <div className="font-semibold text-zinc-100 text-sm mt-0.5">
              {(results.sqFt / 182.25).toFixed(2)} <span className="text-xs font-normal text-zinc-500">Dhur</span>
            </div>
            <div className="text-[10px] text-zinc-600 mt-0.5">182.25 sq ft/dhur</div>
          </div>
        </div>
      </div>
    </div>
  );
};
