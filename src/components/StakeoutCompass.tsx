import React, { useState } from 'react';
import { GeoPoint, calculateStakeout } from '../units';
import { Navigation2, Target } from 'lucide-react';

interface StakeoutCompassProps {
  currentLocation?: GeoPoint;
  targetPoint?: GeoPoint;
}

export const StakeoutCompass: React.FC<StakeoutCompassProps> = ({
  currentLocation = { lat: 27.71724, lng: 85.32402 },
  targetPoint = { lat: 27.71738, lng: 85.32418 },
}) => {
  const [curr, setCurr] = useState<GeoPoint>(currentLocation);
  const [target] = useState<GeoPoint>(targetPoint);

  const stakeout = calculateStakeout(curr, target);
  const isClose = stakeout.distanceMeters < 0.2;

  const simulateStepCloser = () => {
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-zinc-300" />
          <div>
            <h3 className="text-xs font-semibold text-zinc-200">Stakeout Guidance</h3>
            <p className="text-[11px] text-zinc-500">Bearing to target peg</p>
          </div>
        </div>
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded uppercase tracking-wider ${
            isClose
              ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
              : 'bg-zinc-950 text-zinc-400 border border-zinc-800'
          }`}
        >
          {isClose ? 'At Target' : 'Approaching'}
        </span>
      </div>

      {/* Minimal Compass Dial */}
      <div className="relative w-48 h-48 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center my-3">
        {/* Cardinal Markers */}
        <span className="absolute top-2 text-[10px] font-bold text-zinc-300 font-mono">N</span>
        <span className="absolute bottom-2 text-[10px] font-medium text-zinc-600 font-mono">S</span>
        <span className="absolute right-2 text-[10px] font-medium text-zinc-600 font-mono">E</span>
        <span className="absolute left-2 text-[10px] font-medium text-zinc-600 font-mono">W</span>

        {/* Dynamic Navigation Needle */}
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ transform: `rotate(${stakeout.azimuthDeg}deg)` }}
        >
          <div className="flex flex-col items-center -translate-y-10">
            <Navigation2 className="w-7 h-7 text-zinc-100 fill-zinc-100" />
          </div>
        </div>

        {/* Center Distance Card */}
        <div className="absolute w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-center p-2">
          <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-medium">Distance</span>
          <span className="font-mono font-bold text-lg text-zinc-100">
            {stakeout.distanceMeters.toFixed(2)}
            <span className="text-[10px] text-zinc-500 ml-0.5">m</span>
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            {(stakeout.distanceMeters * 3.28084).toFixed(1)} ft
          </span>
        </div>
      </div>

      {/* Target stats */}
      <div className="w-full grid grid-cols-3 gap-2 mt-2 text-center text-xs">
        <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800/80">
          <div className="text-[10px] text-zinc-500">Azimuth</div>
          <div className="font-mono font-medium text-zinc-200 mt-0.5">
            {stakeout.azimuthDeg}° {stakeout.cardinalDirection}
          </div>
        </div>
        <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800/80">
          <div className="text-[10px] text-zinc-500">Δ Easting</div>
          <div className="font-mono font-medium text-zinc-200 mt-0.5">
            {stakeout.deltaEastingMeters >= 0 ? `+${stakeout.deltaEastingMeters}` : stakeout.deltaEastingMeters} m
          </div>
        </div>
        <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800/80">
          <div className="text-[10px] text-zinc-500">Δ Northing</div>
          <div className="font-mono font-medium text-zinc-200 mt-0.5">
            {stakeout.deltaNorthingMeters >= 0 ? `+${stakeout.deltaNorthingMeters}` : stakeout.deltaNorthingMeters} m
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-between gap-2 mt-3 pt-3 border-t border-zinc-800">
        <button
          onClick={simulateStepCloser}
          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium py-2 rounded-lg transition-colors"
        >
          Step Closer (Simulate)
        </button>
        <button
          onClick={resetTarget}
          className="bg-zinc-950 hover:bg-zinc-900 text-zinc-400 text-xs py-2 px-3 rounded-lg border border-zinc-800 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
