import React, { useState } from 'react';
import {
  ropaniToSqFt,
  bighaToSqFt,
  getAllUnitsFromSqFt,
} from '../units';
import { UnitResultsBadge } from '../components/UnitResultsBadge';
import { NepaliUnitsBreakdown } from '../components/NepaliUnitsBreakdown';
import { Plus, Minus, Divide, Calculator, Users } from 'lucide-react';

export const ArithmeticScreen: React.FC = () => {
  // Mode: 1. Add (जोड्ने), 2. Subtract (घटाउने/बेच्ने), 3. Partition (अंशबण्डा/भाग लगाउने)
  const [opMode, setOpMode] = useState<'add' | 'sub' | 'split'>('add');
  const [system, setSystem] = useState<'ropani' | 'bigha'>('ropani');

  // Land 1 State (R-A-P-D)
  const [r1, setR1] = useState<string>('1');
  const [a1, setA1] = useState<string>('4');
  const [p1, setP1] = useState<string>('2');
  const [d1, setD1] = useState<string>('0');

  // Land 1 State (B-K-D)
  const [b1, setB1] = useState<string>('0');
  const [k1, setK1] = useState<string>('10');
  const [dh1, setDh1] = useState<string>('5');

  // Land 2 State (R-A-P-D) - For Add / Subtract
  const [r2, setR2] = useState<string>('0');
  const [a2, setA2] = useState<string>('8');
  const [p2, setP2] = useState<string>('1');
  const [d2, setD2] = useState<string>('2');

  // Land 2 State (B-K-D)
  const [b2, setB2] = useState<string>('0');
  const [k2, setK2] = useState<string>('5');
  const [dh2, setDh2] = useState<string>('0');

  // Partition Heirs / Shares Count
  const [shares, setShares] = useState<string>('3');

  // Calculate Land 1 Sq Ft
  const sqFt1 =
    system === 'ropani'
      ? ropaniToSqFt(parseFloat(r1) || 0, parseFloat(a1) || 0, parseFloat(p1) || 0, parseFloat(d1) || 0)
      : bighaToSqFt(parseFloat(b1) || 0, parseFloat(k1) || 0, parseFloat(dh1) || 0);

  // Calculate Land 2 Sq Ft
  const sqFt2 =
    system === 'ropani'
      ? ropaniToSqFt(parseFloat(r2) || 0, parseFloat(a2) || 0, parseFloat(p2) || 0, parseFloat(d2) || 0)
      : bighaToSqFt(parseFloat(b2) || 0, parseFloat(k2) || 0, parseFloat(dh2) || 0);

  // Compute Result
  let resultSqFt = 0;
  if (opMode === 'add') {
    resultSqFt = sqFt1 + sqFt2;
  } else if (opMode === 'sub') {
    resultSqFt = Math.max(0, sqFt1 - sqFt2);
  } else if (opMode === 'split') {
    const numShares = Math.max(1, parseFloat(shares) || 1);
    resultSqFt = sqFt1 / numShares;
  }

  const results = getAllUnitsFromSqFt(resultSqFt);

  return (
    <div className="space-y-3.5 pb-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Calculator className="w-4 h-4 text-zinc-300" />
          <h2 className="text-xs font-semibold text-zinc-100">जग्गाको हिसाब (Land Arithmetic)</h2>
        </div>

        {/* System Toggle */}
        <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-xs">
          <button
            onClick={() => setSystem('ropani')}
            className={`px-2.5 py-0.5 rounded font-medium transition-colors ${
              system === 'ropani' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            रोपनी प्रणाली
          </button>
          <button
            onClick={() => setSystem('bigha')}
            className={`px-2.5 py-0.5 rounded font-medium transition-colors ${
              system === 'bigha' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            बिघा प्रणाली
          </button>
        </div>
      </div>

      {/* 3 Real-World Operation Cards */}
      <div className="grid grid-cols-3 gap-1.5 text-xs">
        <button
          onClick={() => setOpMode('add')}
          className={`p-2 rounded-lg border text-center transition-colors ${
            opMode === 'add'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100 font-semibold'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          <Plus className="w-3.5 h-3.5 mx-auto mb-0.5" />
          <div>जग्गा जोड्ने</div>
          <div className="text-[10px] text-zinc-500">२ वटा जग्गा जोड्ने</div>
        </button>

        <button
          onClick={() => setOpMode('sub')}
          className={`p-2 rounded-lg border text-center transition-colors ${
            opMode === 'sub'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100 font-semibold'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          <Minus className="w-3.5 h-3.5 mx-auto mb-0.5" />
          <div>जग्गा घटाउने</div>
          <div className="text-[10px] text-zinc-500">बिक्री/काटिएको जग्गा</div>
        </button>

        <button
          onClick={() => setOpMode('split')}
          className={`p-2 rounded-lg border text-center transition-colors ${
            opMode === 'split'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100 font-semibold'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          <Divide className="w-3.5 h-3.5 mx-auto mb-0.5" />
          <div>अंशबण्डा (Partition)</div>
          <div className="text-[10px] text-zinc-500">बराबर भाग लगाउने</div>
        </button>
      </div>

      {/* Primary Land Input */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 space-y-2 shadow-sm">
        <div className="text-xs font-medium text-zinc-200">
          {opMode === 'split' ? 'कुल जग्गा (Total Land to Divide):' : 'पहिलो जग्गा (Land 1):'}
        </div>

        {system === 'ropani' ? (
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="text-[10px] text-zinc-400 block mb-0.5">रोपनी</label>
              <input
                type="number"
                value={r1}
                onChange={(e) => setR1(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs font-bold text-center"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 block mb-0.5">आना</label>
              <input
                type="number"
                value={a1}
                onChange={(e) => setA1(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs font-bold text-center"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 block mb-0.5">पैसा</label>
              <input
                type="number"
                value={p1}
                onChange={(e) => setP1(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs font-bold text-center"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 block mb-0.5">दाम</label>
              <input
                type="number"
                value={d1}
                onChange={(e) => setD1(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs font-bold text-center"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-zinc-400 block mb-0.5">बिघा</label>
              <input
                type="number"
                value={b1}
                onChange={(e) => setB1(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs font-bold text-center"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 block mb-0.5">कट्ठा</label>
              <input
                type="number"
                value={k1}
                onChange={(e) => setK1(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs font-bold text-center"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 block mb-0.5">धुर</label>
              <input
                type="number"
                value={dh1}
                onChange={(e) => setDh1(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs font-bold text-center"
              />
            </div>
          </div>
        )}
      </div>

      {/* Second Input (Either Land 2 or Heirs Count) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 space-y-2 shadow-sm">
        {opMode === 'split' ? (
          <div>
            <label className="text-xs font-medium text-zinc-200 block mb-1">
              कति जनामा बराबर भाग लगाउने? (Number of Equal Shares / दाजुभाइ):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                className="w-24 bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-base font-bold text-center"
              />
              <span className="text-xs text-zinc-400">जनालाई बराबर भाग (Equal shares)</span>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-xs font-medium text-zinc-200 mb-2">
              {opMode === 'add' ? 'दोस्रो जग्गा (Land 2 to Add):' : 'घटाउने/बेचिएको जग्गा (Land to Subtract):'}
            </div>

            {system === 'ropani' ? (
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">रोपनी</label>
                  <input
                    type="number"
                    value={r2}
                    onChange={(e) => setR2(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">आना</label>
                  <input
                    type="number"
                    value={a2}
                    onChange={(e) => setA2(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">पैसा</label>
                  <input
                    type="number"
                    value={p2}
                    onChange={(e) => setP2(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">दाम</label>
                  <input
                    type="number"
                    value={d2}
                    onChange={(e) => setD2(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs font-bold text-center"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">बिघा</label>
                  <input
                    type="number"
                    value={b2}
                    onChange={(e) => setB2(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">कट्ठा</label>
                  <input
                    type="number"
                    value={k2}
                    onChange={(e) => setK2(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">धुर</label>
                  <input
                    type="number"
                    value={dh2}
                    onChange={(e) => setDh2(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs font-bold text-center"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Result Display */}
      <UnitResultsBadge
        results={results}
        title={
          opMode === 'split'
            ? `प्रत्येक व्यक्तिको भाग (Share per Person - १/${shares})`
            : opMode === 'add'
            ? 'कुल जग्गा (Combined Total Land)'
            : 'बाँकी जग्गा (Remaining Land After Sale)'
        }
      />
      <NepaliUnitsBreakdown results={results} />
    </div>
  );
};
