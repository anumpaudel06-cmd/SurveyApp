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
      {/* Ropani Breakdown Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold text-slate-800">
              Ropani Detailed Conversion (पहाडी रूपान्तरण)
            </h4>
            <p className="text-[11px] text-slate-500">
              1 Ropani = 16 Aana = 64 Paisa = 256 Daam = 5,476 sq ft
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            {results.ropani.formatted}
          </span>
        </div>

        {/* Progress bar to 1 Ropani */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Share of 1 Ropani (१ रोपनीको अनुपात)</span>
            <span className="font-mono font-medium text-slate-700">{ropaniPct.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-slate-700 h-full rounded-full transition-all duration-300"
              style={{ width: `${ropaniPct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
            <div className="text-[10px] text-slate-500">Total in Aana (कुल आना मात्र)</div>
            <div className="font-mono font-bold text-slate-900 mt-0.5">
              {(results.sqFt / 342.25).toFixed(3)} <span className="text-xs font-normal text-slate-500">Aana</span>
            </div>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
            <div className="text-[10px] text-slate-500">Total in Daam (कुल दाम मात्र)</div>
            <div className="font-mono font-bold text-slate-900 mt-0.5">
              {(results.sqFt / 21.39).toFixed(2)} <span className="text-xs font-normal text-slate-500">Daam</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bigha Breakdown Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold text-slate-800">
              Bigha Detailed Conversion (तराई रूपान्तरण)
            </h4>
            <p className="text-[11px] text-slate-500">
              1 Bigha = 20 Kattha = 400 Dhur = 72,900 sq ft
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            {results.bigha.formatted}
          </span>
        </div>

        {/* Progress bar to 1 Bigha */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Share of 1 Bigha (१ बिघाको अनुपात)</span>
            <span className="font-mono font-medium text-slate-700">{bighaPct.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-slate-700 h-full rounded-full transition-all duration-300"
              style={{ width: `${bighaPct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
            <div className="text-[10px] text-slate-500">Total in Kattha (कुल कट्ठा मात्र)</div>
            <div className="font-mono font-bold text-slate-900 mt-0.5">
              {(results.sqFt / 3645).toFixed(3)} <span className="text-xs font-normal text-slate-500">Kattha</span>
            </div>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
            <div className="text-[10px] text-slate-500">Total in Dhur (कुल धुर मात्र)</div>
            <div className="font-mono font-bold text-slate-900 mt-0.5">
              {(results.sqFt / 182.25).toFixed(2)} <span className="text-xs font-normal text-slate-500">Dhur</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
