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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Ropani System Details
            </h4>
            <p className="text-[11px] text-slate-500">
              1 Ropani = 16 Aana = 64 Paisa = 256 Daam = 5,476 sq ft
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
            {results.ropani.formatted}
          </span>
        </div>

        {/* Progress bar to 1 Ropani */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Share of 1 Ropani</span>
            <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{ropaniPct.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-slate-700 dark:bg-slate-300 h-full rounded-full transition-all duration-300"
              style={{ width: `${ropaniPct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200/80 dark:border-slate-700">
            <div className="text-[10px] text-slate-500">Total in Aana</div>
            <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
              {(results.sqFt / 342.25).toFixed(3)} <span className="text-xs font-normal text-slate-500">Aana</span>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200/80 dark:border-slate-700">
            <div className="text-[10px] text-slate-500">Total in Daam</div>
            <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
              {(results.sqFt / 21.39).toFixed(2)} <span className="text-xs font-normal text-slate-500">Daam</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bigha Breakdown Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Bigha System Details
            </h4>
            <p className="text-[11px] text-slate-500">
              1 Bigha = 20 Kattha = 400 Dhur = 72,900 sq ft
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
            {results.bigha.formatted}
          </span>
        </div>

        {/* Progress bar to 1 Bigha */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Share of 1 Bigha</span>
            <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{bighaPct.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-slate-700 dark:bg-slate-300 h-full rounded-full transition-all duration-300"
              style={{ width: `${bighaPct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200/80 dark:border-slate-700">
            <div className="text-[10px] text-slate-500">Total in Kattha</div>
            <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
              {(results.sqFt / 3645).toFixed(3)} <span className="text-xs font-normal text-slate-500">Kattha</span>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200/80 dark:border-slate-700">
            <div className="text-[10px] text-slate-500">Total in Dhur</div>
            <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
              {(results.sqFt / 182.25).toFixed(2)} <span className="text-xs font-normal text-slate-500">Dhur</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
