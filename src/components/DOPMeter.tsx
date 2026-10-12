import React, { useState } from 'react';
import { Radio, Signal, Satellite, ShieldCheck, CheckCircle } from 'lucide-react';

interface DOPMeterProps {
  pdop?: number;
  hdop?: number;
  vdop?: number;
  fixType?: 'RTK_FIXED' | 'RTK_FLOAT' | 'DGPS' | '3D_FIX';
}

export const DOPMeter: React.FC<DOPMeterProps> = ({
  pdop = 1.4,
  hdop = 0.8,
  vdop = 1.1,
  fixType = 'RTK_FIXED',
}) => {
  const [currentFix, setCurrentFix] = useState(fixType);

  const getDopQuality = (val: number) => {
    if (val < 1.0) return { label: 'Ideal', color: 'text-emerald-400', bg: 'bg-emerald-500' };
    if (val < 2.0) return { label: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500' };
    if (val < 3.0) return { label: 'Good', color: 'text-sky-400', bg: 'bg-sky-500' };
    if (val < 6.0) return { label: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-500' };
    return { label: 'Poor', color: 'text-red-400', bg: 'bg-red-500' };
  };

  const pdopQual = getDopQuality(pdop);
  const hdopQual = getDopQuality(hdop);
  const vdopQual = getDopQuality(vdop);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <Satellite className="w-5 h-5 text-emerald-400" />
          <div>
            <h4 className="text-sm font-bold text-white">GNSS Constellation & DOP Health</h4>
            <p className="text-[10px] text-slate-400">Dilution of Precision survey telemetry</p>
          </div>
        </div>
        <div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold flex items-center gap-1.5 border ${
              currentFix === 'RTK_FIXED'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600'
                : 'bg-amber-950/80 text-amber-300 border-amber-600'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {currentFix.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* DOP Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {/* PDOP */}
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">PDOP (3D)</span>
          <span className="text-lg font-mono font-extrabold text-white mt-0.5 block">{pdop.toFixed(2)}</span>
          <span className={`text-[10px] font-semibold ${pdopQual.color}`}>{pdopQual.label}</span>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
            <div className={`h-full ${pdopQual.bg}`} style={{ width: `${Math.min(100, (pdop / 5) * 100)}%` }} />
          </div>
        </div>

        {/* HDOP */}
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">HDOP (Horiz)</span>
          <span className="text-lg font-mono font-extrabold text-white mt-0.5 block">{hdop.toFixed(2)}</span>
          <span className={`text-[10px] font-semibold ${hdopQual.color}`}>{hdopQual.label}</span>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
            <div className={`h-full ${hdopQual.bg}`} style={{ width: `${Math.min(100, (hdop / 5) * 100)}%` }} />
          </div>
        </div>

        {/* VDOP */}
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">VDOP (Vert)</span>
          <span className="text-lg font-mono font-extrabold text-white mt-0.5 block">{vdop.toFixed(2)}</span>
          <span className={`text-[10px] font-semibold ${vdopQual.color}`}>{vdopQual.label}</span>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
            <div className={`h-full ${vdopQual.bg}`} style={{ width: `${Math.min(100, (vdop / 5) * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Satellites Tracked Breakdown */}
      <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-400">Multi-GNSS Constellations in View:</span>
          <span className="font-mono font-bold text-emerald-400">28 Satellites</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
          <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
            <div className="font-bold text-white font-mono">10</div>
            <div className="text-slate-400">GPS (USA)</div>
          </div>
          <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
            <div className="font-bold text-white font-mono">8</div>
            <div className="text-slate-400">GLONASS</div>
          </div>
          <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
            <div className="font-bold text-white font-mono">6</div>
            <div className="text-slate-400">Galileo (EU)</div>
          </div>
          <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
            <div className="font-bold text-white font-mono">4</div>
            <div className="text-slate-400">BeiDou (CN)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
