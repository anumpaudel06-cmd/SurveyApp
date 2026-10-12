import React from 'react';
import { Satellite } from 'lucide-react';

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
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
        <div className="flex items-center gap-2">
          <Satellite className="w-4 h-4 text-zinc-300" />
          <div>
            <h4 className="text-xs font-semibold text-zinc-200">GNSS Constellation & DOP Quality</h4>
            <p className="text-[10px] text-zinc-500">Geometry dilution of precision</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded font-mono font-medium bg-zinc-800 text-zinc-200 border border-zinc-700">
          {fixType.replace('_', ' ')}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80 text-center">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wide block">PDOP (3D)</span>
          <span className="text-base font-mono font-bold text-zinc-100 mt-0.5 block">{pdop.toFixed(2)}</span>
          <span className="text-[10px] text-zinc-400">Normal</span>
        </div>

        <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80 text-center">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wide block">HDOP (Horiz)</span>
          <span className="text-base font-mono font-bold text-zinc-100 mt-0.5 block">{hdop.toFixed(2)}</span>
          <span className="text-[10px] text-zinc-400">Good</span>
        </div>

        <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80 text-center">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wide block">VDOP (Vert)</span>
          <span className="text-base font-mono font-bold text-zinc-100 mt-0.5 block">{vdop.toFixed(2)}</span>
          <span className="text-[10px] text-zinc-400">Normal</span>
        </div>
      </div>

      <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-zinc-400">Constellations Tracked:</span>
          <span className="font-mono text-zinc-200">28 Satellites</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
          <div className="bg-zinc-900 p-1.5 rounded border border-zinc-800">
            <div className="font-mono font-semibold text-zinc-200">10</div>
            <div className="text-zinc-500">GPS</div>
          </div>
          <div className="bg-zinc-900 p-1.5 rounded border border-zinc-800">
            <div className="font-mono font-semibold text-zinc-200">8</div>
            <div className="text-zinc-500">GLONASS</div>
          </div>
          <div className="bg-zinc-900 p-1.5 rounded border border-zinc-800">
            <div className="font-mono font-semibold text-zinc-200">6</div>
            <div className="text-zinc-500">Galileo</div>
          </div>
          <div className="bg-zinc-900 p-1.5 rounded border border-zinc-800">
            <div className="font-mono font-semibold text-zinc-200">4</div>
            <div className="text-zinc-500">BeiDou</div>
          </div>
        </div>
      </div>
    </div>
  );
};
