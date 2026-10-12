import React from 'react';
import { MultiUnitAreaResult } from '../units';
import { Copy, Check } from 'lucide-react';

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
  title = 'Area Calculation Results',
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = `Land Survey Pro Results:
• Square Feet: ${results.sqFt.toLocaleString('en-US', { maximumFractionDigits: 2 })} sq ft
• Square Meters: ${results.sqM.toLocaleString('en-US', { maximumFractionDigits: 2 })} sq m
• Acres: ${results.acres.toFixed(4)} acres
• Hectares: ${results.hectares.toFixed(4)} ha
• Ropani System: ${results.ropani.formatted} (R-A-P-D)
• Bigha System: ${results.bigha.formatted} (B-K-D)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
        <div>
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">Survey Measurement</span>
          <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {onToggleUnit && (
            <button
              onClick={onToggleUnit}
              className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
            >
              {isMetric ? 'Metric' : 'Imperial'}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Copy Results"
          >
            {copied ? <Check className="w-4 h-4 text-zinc-200" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Primary Figures */}
      <div className="grid grid-cols-2 gap-3 my-3">
        <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/80">
          <div className="text-[11px] text-zinc-400 font-medium">Square Feet</div>
          <div className="text-xl font-bold font-mono text-zinc-100 mt-1">
            {results.sqFt.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            <span className="text-xs text-zinc-500 font-normal ml-1">sq ft</span>
          </div>
        </div>

        <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/80">
          <div className="text-[11px] text-zinc-400 font-medium">Square Meters</div>
          <div className="text-xl font-bold font-mono text-zinc-100 mt-1">
            {results.sqM.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            <span className="text-xs text-zinc-500 font-normal ml-1">m²</span>
          </div>
        </div>
      </div>

      {/* Acres & Hectares */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-800/60 flex items-center justify-between">
          <span className="text-xs text-zinc-400">Acres</span>
          <span className="font-mono font-semibold text-zinc-200 text-sm">{results.acres.toFixed(4)} ac</span>
        </div>
        <div className="bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-800/60 flex items-center justify-between">
          <span className="text-xs text-zinc-400">Hectares</span>
          <span className="font-mono font-semibold text-zinc-200 text-sm">{results.hectares.toFixed(4)} ha</span>
        </div>
      </div>

      {/* Traditional Nepali Breakdown */}
      <div className="space-y-2 pt-1 border-t border-zinc-800/60">
        {/* Ropani */}
        <div className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-300">Ropani System (Hills)</span>
            <span className="text-xs font-mono font-semibold text-zinc-100 bg-zinc-800 px-2 py-0.5 rounded">
              {results.ropani.formatted}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
            <div className="bg-zinc-900 py-1.5 rounded border border-zinc-800/60">
              <div className="font-mono font-bold text-zinc-100">{results.ropani.ropani}</div>
              <div className="text-[10px] text-zinc-500">Ropani</div>
            </div>
            <div className="bg-zinc-900 py-1.5 rounded border border-zinc-800/60">
              <div className="font-mono font-bold text-zinc-100">{results.ropani.aana}</div>
              <div className="text-[10px] text-zinc-500">Aana</div>
            </div>
            <div className="bg-zinc-900 py-1.5 rounded border border-zinc-800/60">
              <div className="font-mono font-bold text-zinc-100">{results.ropani.paisa}</div>
              <div className="text-[10px] text-zinc-500">Paisa</div>
            </div>
            <div className="bg-zinc-900 py-1.5 rounded border border-zinc-800/60">
              <div className="font-mono font-bold text-zinc-100">{results.ropani.daam}</div>
              <div className="text-[10px] text-zinc-500">Daam</div>
            </div>
          </div>
        </div>

        {/* Bigha */}
        <div className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-300">Bigha System (Terai)</span>
            <span className="text-xs font-mono font-semibold text-zinc-100 bg-zinc-800 px-2 py-0.5 rounded">
              {results.bigha.formatted}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
            <div className="bg-zinc-900 py-1.5 rounded border border-zinc-800/60">
              <div className="font-mono font-bold text-zinc-100">{results.bigha.bigha}</div>
              <div className="text-[10px] text-zinc-500">Bigha</div>
            </div>
            <div className="bg-zinc-900 py-1.5 rounded border border-zinc-800/60">
              <div className="font-mono font-bold text-zinc-100">{results.bigha.kattha}</div>
              <div className="text-[10px] text-zinc-500">Kattha</div>
            </div>
            <div className="bg-zinc-900 py-1.5 rounded border border-zinc-800/60">
              <div className="font-mono font-bold text-zinc-100">{results.bigha.dhur}</div>
              <div className="text-[10px] text-zinc-500">Dhur</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-zinc-800/40 flex items-center justify-between text-[11px] text-zinc-500">
        <span>1 R = 5,476 sq ft</span>
        <span>1 B = 72,900 sq ft</span>
      </div>
    </div>
  );
};
