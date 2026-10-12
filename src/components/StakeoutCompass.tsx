import React, { useState } from 'react';
import { GeoPoint, calculateStakeout } from '../units';
import { Compass, Navigation2, Target, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface StakeoutCompassProps {
  currentLocation?: GeoPoint;
  targetPoint?: GeoPoint;
}

export const StakeoutCompass: React.FC<StakeoutCompassProps> = ({
  currentLocation = { lat: 27.71724, lng: 85.32402 },
  targetPoint = { lat: 27.71738, lng: 85.32418 },
}) => {
  const [curr, setCurr] = useState<GeoPoint>(currentLocation);
  const [target, setTarget] = useState<GeoPoint>(targetPoint);
  const [isSimulatingWalk, setIsSimulatingWalk] = useState(false);

  const stakeout = calculateStakeout(curr, target);
  const isClose = stakeout.distanceMeters < 0.2;

  const simulateStepCloser = () => {
    // Nudge current point towards target
    const dLat = (target.lat - curr.lat) * 0.4;
    const dLng = (target.lng - curr.lng) * 0.4;
    setCurr({
      lat: curr.lat + dLat,
      lng: curr.lng + dLng,
    });
  };

  const resetTarget = () => {
    setCurr({ lat: 27.71724, lng: 85.32402 });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Stakeout Navigation HUD</h3>
            <p className="text-[11px] text-slate-400">Guiding surveyor to corner peg</p>
          </div>
        </div>
        <div className="text-right">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
              isClose
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                : 'bg-amber-950 text-amber-400 border border-amber-700'
            }`}
          >
            {isClose ? 'ON TARGET (STAKE PEG)' : 'APPROACHING'}
          </span>
        </div>
      </div>

      {/* Circular Compass Dial */}
      <div className="relative w-56 h-56 rounded-full border-4 border-slate-800 bg-slate-950 flex items-center justify-center shadow-inner my-2">
        {/* Cardinal Markers */}
        <span className="absolute top-2 text-xs font-bold text-red-500 font-mono">N</span>
        <span className="absolute bottom-2 text-xs font-bold text-slate-400 font-mono">S</span>
        <span className="absolute right-2 text-xs font-bold text-slate-400 font-mono">E</span>
        <span className="absolute left-2 text-xs font-bold text-slate-400 font-mono">W</span>

        {/* Graduations */}
        <div className="absolute inset-2 rounded-full border border-dashed border-slate-800 pointer-events-none" />

        {/* Dynamic Navigation Needle */}
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform duration-500 ease-out"
          style={{ transform: `rotate(${stakeout.azimuthDeg}deg)` }}
        >
          {/* Arrow pointing to target */}
          <div className="flex flex-col items-center -translate-y-12">
            <Navigation2 className="w-10 h-10 text-emerald-400 fill-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
        </div>

        {/* Distance Display in Center Circle */}
        <div className="absolute w-28 h-28 rounded-full bg-slate-900 border border-slate-700/80 flex flex-col items-center justify-center text-center p-2 shadow-2xl">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Distance</span>
          <span
            className={`font-mono font-extrabold text-xl ${
              isClose ? 'text-emerald-400 animate-pulse' : 'text-white'
            }`}
          >
            {stakeout.distanceMeters.toFixed(2)}
            <span className="text-xs text-slate-400 font-normal ml-0.5">m</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {(stakeout.distanceMeters * 3.28084).toFixed(2)} ft
          </span>
        </div>
      </div>

      {/* Azimuth and Delta Coordinate Offsets */}
      <div className="w-full grid grid-cols-3 gap-2 mt-4 text-center text-xs">
        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400">Azimuth (Bearing)</div>
          <div className="font-mono font-bold text-amber-300 text-sm mt-0.5">
            {stakeout.azimuthDeg}° {stakeout.cardinalDirection}
          </div>
        </div>
        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400">ΔE (Easting)</div>
          <div className="font-mono font-bold text-sky-300 text-sm mt-0.5">
            {stakeout.deltaEastingMeters >= 0 ? `+${stakeout.deltaEastingMeters}` : stakeout.deltaEastingMeters} m
          </div>
        </div>
        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400">ΔN (Northing)</div>
          <div className="font-mono font-bold text-sky-300 text-sm mt-0.5">
            {stakeout.deltaNorthingMeters >= 0 ? `+${stakeout.deltaNorthingMeters}` : stakeout.deltaNorthingMeters} m
          </div>
        </div>
      </div>

      {/* Field Actions */}
      <div className="w-full flex items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800">
        <button
          onClick={simulateStepCloser}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
        >
          <ArrowUpRight className="w-4 h-4" /> Step Closer (Simulation)
        </button>
        <button
          onClick={resetTarget}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 px-3 rounded-xl border border-slate-700"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
