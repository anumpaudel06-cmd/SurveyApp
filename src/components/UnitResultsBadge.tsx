import React, { useState } from 'react';
import {
  MultiUnitAreaResult,
  KHETMURI_SQFT,
  SQYD_TO_SQFT,
  SQMI_TO_SQFT,
  SQKM_TO_SQFT,
} from '../units';
import { Copy, Check } from 'lucide-react';

interface UnitResultsBadgeProps {
  results: MultiUnitAreaResult;
  title?: string;
}

export const UnitResultsBadge: React.FC<UnitResultsBadgeProps> = ({
  results,
  title = 'Total Parcel Area',
}) => {
  const [copied, setCopied] = useState(false);

  const sqFt = results.sqFt;
  const sqYd = sqFt / SQYD_TO_SQFT;
  const sqMi = sqFt / SQMI_TO_SQFT;
  const sqKm = sqFt / SQKM_TO_SQFT;
  const khetmuri = sqFt / KHETMURI_SQFT;

  const handleCopy = () => {
    const text = `${title}:
• Square Feet: ${sqFt.toLocaleString('en-US', { maximumFractionDigits: 2 })} sq ft
• Square Meters: ${results.sqM.toLocaleString('en-US', { maximumFractionDigits: 2 })} m²
• Acres: ${results.acres.toFixed(4)} ac
• Hectares: ${results.hectares.toFixed(4)} ha
• Square Yards: ${sqYd.toLocaleString('en-US', { maximumFractionDigits: 2 })} sq yd
• Ropani-Aana-Paisa-Daam: ${results.ropani.formatted} (${results.ropani.ropani} Ropani, ${results.ropani.aana} Aana, ${results.ropani.paisa} Paisa, ${results.ropani.daam} Daam)
• Bigha-Kattha-Dhur: ${results.bigha.formatted} (${results.bigha.bigha} Bigha, ${results.bigha.kattha} Kattha, ${results.bigha.dhur} Dhur)
• Khetmuri: ${khetmuri.toFixed(4)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Area Summary</span>
          <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        </div>
        <button
          onClick={handleCopy}
          className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 flex items-center gap-1.5 text-xs font-medium transition-colors"
          title="Copy all units"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy All'}</span>
        </button>
      </div>

      {/* Primary Highlights: Ropani & Bigha Systems */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Ropani System */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-lg p-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Ropani System (R-A-P-D)
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {results.ropani.formatted}
            </span>
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 flex flex-wrap gap-x-2">
            <span><b>{results.ropani.ropani}</b> Ropani</span>
            <span><b>{results.ropani.aana}</b> Aana</span>
            <span><b>{results.ropani.paisa}</b> Paisa</span>
            <span><b>{results.ropani.daam}</b> Daam</span>
          </div>
        </div>

        {/* Bigha System */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-lg p-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Bigha System (B-K-D)
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {results.bigha.formatted}
            </span>
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 flex flex-wrap gap-x-2">
            <span><b>{results.bigha.bigha}</b> Bigha</span>
            <span><b>{results.bigha.kattha}</b> Kattha</span>
            <span><b>{results.bigha.dhur}</b> Dhur</span>
          </div>
        </div>
      </div>

      {/* Standard Units Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
        <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Square Feet</div>
          <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5">
            {sqFt.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </div>
          <div className="text-[9px] text-slate-400">sq ft</div>
        </div>

        <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Square Meters</div>
          <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5">
            {results.sqM.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </div>
          <div className="text-[9px] text-slate-400">m²</div>
        </div>

        <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Acres</div>
          <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5">
            {results.acres.toFixed(4)}
          </div>
          <div className="text-[9px] text-slate-400">ac</div>
        </div>

        <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Hectares</div>
          <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5">
            {results.hectares.toFixed(4)}
          </div>
          <div className="text-[9px] text-slate-400">ha</div>
        </div>

        <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Square Yards</div>
          <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5">
            {sqYd.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </div>
          <div className="text-[9px] text-slate-400">sq yd</div>
        </div>

        <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Khetmuri</div>
          <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5">
            {khetmuri.toFixed(4)}
          </div>
          <div className="text-[9px] text-slate-400">25 Ropani</div>
        </div>

        <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Square Miles</div>
          <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5">
            {sqMi < 0.0001 && sqMi > 0 ? sqMi.toExponential(3) : sqMi.toFixed(6)}
          </div>
          <div className="text-[9px] text-slate-400">sq mi</div>
        </div>

        <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Square Kilometers</div>
          <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5">
            {sqKm < 0.0001 && sqKm > 0 ? sqKm.toExponential(3) : sqKm.toFixed(6)}
          </div>
          <div className="text-[9px] text-slate-400">km²</div>
        </div>
      </div>
    </div>
  );
};
