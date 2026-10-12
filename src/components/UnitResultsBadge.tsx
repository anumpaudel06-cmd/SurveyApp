import React from 'react';
import { MultiUnitAreaResult } from '../units';
import { Copy, Check, Info } from 'lucide-react';

interface UnitResultsBadgeProps {
  results: MultiUnitAreaResult;
  isMetric?: boolean;
  onToggleUnit?: () => void;
  title?: string;
}

export const UnitResultsBadge: React.FC<UnitResultsBadgeProps> = ({
  results,
  isMetric = false,
  onToggleUnit,
  title = 'Calculated Area Breakdown',
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = `Land Survey Pro Results:
• Square Feet: ${results.sqFt.toLocaleString('en-US', { maximumFractionDigits: 2 })} sq ft
• Square Meters: ${results.sqM.toLocaleString('en-US', { maximumFractionDigits: 2 })} sq m
• Acres: ${results.acres.toFixed(4)} acres
• Hectares: ${results.hectares.toFixed(4)} ha
• Ropani System: ${results.ropani.formatted} (R-A-P-D)
  (${results.ropani.ropani} Ropani, ${results.ropani.aana} Aana, ${results.ropani.paisa} Paisa, ${results.ropani.daam} Daam)
• Bigha System: ${results.bigha.formatted} (B-K-D)
  (${results.bigha.bigha} Bigha, ${results.bigha.kattha} Kattha, ${results.bigha.dhur} Dhur)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">Official Survey Metric</span>
          <h3 className="text-base font-bold text-white">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {onToggleUnit && (
            <button
              onClick={onToggleUnit}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-colors"
            >
              Mode: {isMetric ? 'Metric (m)' : 'Imperial (ft)'}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Copy all units"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Primary Hero Unit */}
      <div className="grid grid-cols-2 gap-2 my-3">
        <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-800/40 rounded-xl p-3">
          <div className="text-[11px] font-medium text-emerald-400/90 uppercase">Square Feet</div>
          <div className="text-xl font-extrabold text-emerald-100 font-mono mt-0.5">
            {results.sqFt.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            <span className="text-xs font-normal text-emerald-400/70 ml-1">sq ft</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-800/40 rounded-xl p-3">
          <div className="text-[11px] font-medium text-blue-400/90 uppercase">Square Meters</div>
          <div className="text-xl font-extrabold text-blue-100 font-mono mt-0.5">
            {results.sqM.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            <span className="text-xs font-normal text-blue-400/70 ml-1">m²</span>
          </div>
        </div>
      </div>

      {/* Western Acres & Hectares */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5">
          <div className="text-[10px] text-slate-400 uppercase font-medium">Acres</div>
          <div className="text-base font-bold text-amber-300 font-mono">
            {results.acres.toFixed(4)} <span className="text-xs font-normal text-slate-400">ac</span>
          </div>
        </div>
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5">
          <div className="text-[10px] text-slate-400 uppercase font-medium">Hectares</div>
          <div className="text-base font-bold text-purple-300 font-mono">
            {results.hectares.toFixed(4)} <span className="text-xs font-normal text-slate-400">ha</span>
          </div>
        </div>
      </div>

      {/* Traditional Nepali Systems */}
      <div className="space-y-2.5 pt-1">
        {/* Ropani System */}
        <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <span>🇳🇵 Ropani System (Pahadi)</span>
            </span>
            <span className="text-xs font-mono font-bold text-amber-200 bg-amber-900/60 px-2 py-0.5 rounded border border-amber-700/50">
              {results.ropani.formatted}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1 text-center text-xs">
            <div className="bg-slate-900/80 rounded py-1 border border-amber-900/30">
              <div className="text-amber-200 font-bold font-mono">{results.ropani.ropani}</div>
              <div className="text-[10px] text-amber-400/80">Ropani</div>
            </div>
            <div className="bg-slate-900/80 rounded py-1 border border-amber-900/30">
              <div className="text-amber-200 font-bold font-mono">{results.ropani.aana}</div>
              <div className="text-[10px] text-amber-400/80">Aana</div>
            </div>
            <div className="bg-slate-900/80 rounded py-1 border border-amber-900/30">
              <div className="text-amber-200 font-bold font-mono">{results.ropani.paisa}</div>
              <div className="text-[10px] text-amber-400/80">Paisa</div>
            </div>
            <div className="bg-slate-900/80 rounded py-1 border border-amber-900/30">
              <div className="text-amber-200 font-bold font-mono">{results.ropani.daam}</div>
              <div className="text-[10px] text-amber-400/80">Daam</div>
            </div>
          </div>
        </div>

        {/* Bigha System */}
        <div className="bg-orange-950/30 border border-orange-800/40 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-orange-300 flex items-center gap-1.5">
              <span>🌾 Bigha System (Terai)</span>
            </span>
            <span className="text-xs font-mono font-bold text-orange-200 bg-orange-900/60 px-2 py-0.5 rounded border border-orange-700/50">
              {results.bigha.formatted}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
            <div className="bg-slate-900/80 rounded py-1 border border-orange-900/30">
              <div className="text-orange-200 font-bold font-mono">{results.bigha.bigha}</div>
              <div className="text-[10px] text-orange-400/80">Bigha</div>
            </div>
            <div className="bg-slate-900/80 rounded py-1 border border-orange-900/30">
              <div className="text-orange-200 font-bold font-mono">{results.bigha.kattha}</div>
              <div className="text-[10px] text-orange-400/80">Kattha</div>
            </div>
            <div className="bg-slate-900/80 rounded py-1 border border-orange-900/30">
              <div className="text-orange-200 font-bold font-mono">{results.bigha.dhur}</div>
              <div className="text-[10px] text-orange-400/80">Dhur</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3 text-slate-400" /> Exact Nepal Survey Department standards applied
        </span>
        <span>1 R = 5,476 sq ft | 1 B = 72,900 sq ft</span>
      </div>
    </div>
  );
};
