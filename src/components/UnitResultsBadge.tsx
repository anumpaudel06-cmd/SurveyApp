import React, { useState } from 'react';
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
  title = 'Calculated Area (गणना गरिएको क्षेत्रफल)',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `Land Survey Pro (जग्गा नापी प्रो):
• Square Feet (वर्ग फिट): ${results.sqFt.toLocaleString('en-US', { maximumFractionDigits: 2 })} sq ft
• Square Meters (वर्ग मिटर): ${results.sqM.toLocaleString('en-US', { maximumFractionDigits: 2 })} sq m
• Ropani System (रोपनी-आना-पैसा-दाम): ${results.ropani.formatted}
  (${results.ropani.ropani} Ropani, ${results.ropani.aana} Aana, ${results.ropani.paisa} Paisa, ${results.ropani.daam} Daam)
• Bigha System (बिघा-कट्ठा-धुर): ${results.bigha.formatted}
  (${results.bigha.bigha} Bigha, ${results.bigha.kattha} Kattha, ${results.bigha.dhur} Dhur)
• Acres (एकर): ${results.acres.toFixed(4)} ac
• Hectares (हेक्टर): ${results.hectares.toFixed(4)} ha`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-medium text-slate-500">Output Summary (नतिजा सारांश)</span>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {onToggleUnit && (
            <button
              onClick={onToggleUnit}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
            >
              {isMetric ? 'Metric (मिटर)' : 'Feet (फिट)'}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 text-xs font-medium transition-colors"
            title="Copy all units"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied (कपी भयो)' : 'Copy (कपी)'}</span>
          </button>
        </div>
      </div>

      {/* Primary Highlights: 2 main Nepali Systems */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Ropani System */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">
              Ropani System (पहाडी प्रणाली)
            </span>
            <span className="text-[11px] text-slate-500">R-A-P-D (रो-आ-पै-दा)</span>
          </div>
          <div className="text-lg font-bold font-mono text-slate-950 mt-1">
            {results.ropani.formatted}
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex flex-wrap gap-x-2">
            <span><b>{results.ropani.ropani}</b> Ropani (रोपनी)</span>
            <span><b>{results.ropani.aana}</b> Aana (आना)</span>
            <span><b>{results.ropani.paisa}</b> Paisa (पैसा)</span>
            <span><b>{results.ropani.daam}</b> Daam (दाम)</span>
          </div>
        </div>

        {/* Bigha System */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">
              Bigha System (तराई प्रणाली)
            </span>
            <span className="text-[11px] text-slate-500">B-K-D (बि-क-धु)</span>
          </div>
          <div className="text-lg font-bold font-mono text-slate-950 mt-1">
            {results.bigha.formatted}
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex flex-wrap gap-x-2">
            <span><b>{results.bigha.bigha}</b> Bigha (बिघा)</span>
            <span><b>{results.bigha.kattha}</b> Kattha (कट्ठा)</span>
            <span><b>{results.bigha.dhur}</b> Dhur (धुर)</span>
          </div>
        </div>
      </div>

      {/* Standard Units Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
        {/* Square Feet */}
        <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
          <div className="text-[11px] text-slate-500">Square Feet (वर्ग फिट)</div>
          <div className="font-mono font-bold text-slate-900 mt-0.5 text-sm">
            {results.sqFt.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">sq ft</div>
        </div>

        {/* Square Meters */}
        <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
          <div className="text-[11px] text-slate-500">Square Meters (वर्ग मिटर)</div>
          <div className="font-mono font-bold text-slate-900 mt-0.5 text-sm">
            {results.sqM.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">sq m</div>
        </div>

        {/* Acres */}
        <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
          <div className="text-[11px] text-slate-500">Acres (एकर)</div>
          <div className="font-mono font-bold text-slate-900 mt-0.5 text-sm">
            {results.acres.toFixed(4)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">ac</div>
        </div>

        {/* Hectares */}
        <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
          <div className="text-[11px] text-slate-500">Hectares (हेक्टर)</div>
          <div className="font-mono font-bold text-slate-900 mt-0.5 text-sm">
            {results.hectares.toFixed(4)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">ha</div>
        </div>
      </div>
    </div>
  );
};
