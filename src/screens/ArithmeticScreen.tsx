import React, { useState } from 'react';
import {
  ArithmeticOp,
  calculateAreaArithmetic,
  ropaniToSqFt,
  bighaToSqFt,
  getAllUnitsFromSqFt,
  convertArea,
  AreaUnit,
} from '../units';
import { UnitResultsBadge } from '../components/UnitResultsBadge';
import { NepaliUnitsBreakdown } from '../components/NepaliUnitsBreakdown';
import { Plus, Minus, X, Divide, Calculator, Split, ArrowDown, Users } from 'lucide-react';

export const ArithmeticScreen: React.FC = () => {
  const [operation, setOperation] = useState<ArithmeticOp>('add');

  // Input 1 Type & Values
  const [input1Type, setInput1Type] = useState<'sqft' | 'ropani' | 'bigha'>('ropani');
  const [sqft1, setSqft1] = useState<string>('5476');
  // R-A-P-D 1
  const [r1, setR1] = useState<string>('1');
  const [a1, setA1] = useState<string>('2');
  const [p1, setP1] = useState<string>('1');
  const [d1, setD1] = useState<string>('0');
  // B-K-D 1
  const [b1, setB1] = useState<string>('0');
  const [k1, setK1] = useState<string>('10');
  const [dh1, setDh1] = useState<string>('5');

  // Input 2 Type & Values
  const [input2Type, setInput2Type] = useState<'sqft' | 'ropani' | 'bigha' | 'scalar'>('ropani');
  const [sqft2, setSqft2] = useState<string>('342.25');
  // R-A-P-D 2
  const [r2, setR2] = useState<string>('0');
  const [a2, setA2] = useState<string>('8');
  const [p2, setP2] = useState<string>('2');
  const [d2, setD2] = useState<string>('1');
  // B-K-D 2
  const [b2, setB2] = useState<string>('0');
  const [k2, setK2] = useState<string>('5');
  const [dh2, setDh2] = useState<string>('0');
  // Scalar factor for multiply or divide
  const [scalar, setScalar] = useState<string>('3');

  // Determine Value 1 in Sq Ft
  let val1SqFt = 0;
  if (input1Type === 'sqft') {
    val1SqFt = parseFloat(sqft1) || 0;
  } else if (input1Type === 'ropani') {
    val1SqFt = ropaniToSqFt(parseFloat(r1) || 0, parseFloat(a1) || 0, parseFloat(p1) || 0, parseFloat(d1) || 0);
  } else if (input1Type === 'bigha') {
    val1SqFt = bighaToSqFt(parseFloat(b1) || 0, parseFloat(k1) || 0, parseFloat(dh1) || 0);
  }

  // Determine Value 2
  const isScalarOp = operation === 'multiply' || operation === 'divide';
  let val2 = 0;
  if (isScalarOp) {
    val2 = parseFloat(scalar) || 1;
  } else {
    if (input2Type === 'sqft') {
      val2 = parseFloat(sqft2) || 0;
    } else if (input2Type === 'ropani') {
      val2 = ropaniToSqFt(parseFloat(r2) || 0, parseFloat(a2) || 0, parseFloat(p2) || 0, parseFloat(d2) || 0);
    } else if (input2Type === 'bigha') {
      val2 = bighaToSqFt(parseFloat(b2) || 0, parseFloat(k2) || 0, parseFloat(dh2) || 0);
    }
  }

  const result = calculateAreaArithmetic(val1SqFt, val2, operation, isScalarOp);

  return (
    <div className="space-y-5 pb-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
            Parcel Operations & Partitioning
          </span>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" /> Area Arithmetic Engine
          </h2>
        </div>
      </div>

      {/* Operation Selection Bar */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => setOperation('add')}
          className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
            operation === 'add'
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add Areas (+)</span>
        </button>

        <button
          onClick={() => setOperation('subtract')}
          className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
            operation === 'subtract'
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Minus className="w-4 h-4" />
          <span>Subtract (-)</span>
        </button>

        <button
          onClick={() => setOperation('multiply')}
          className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
            operation === 'multiply'
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <X className="w-4 h-4" />
          <span>Multiply (×)</span>
        </button>

        <button
          onClick={() => setOperation('divide')}
          className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
            operation === 'divide'
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Divide className="w-4 h-4" />
          <span>Partition / Split (÷)</span>
        </button>
      </div>

      {/* Parcel 1 Input */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-bold text-slate-200">Parcel 1 (Primary Area)</span>
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
            <button
              onClick={() => setInput1Type('ropani')}
              className={`px-2 py-0.5 rounded font-medium ${
                input1Type === 'ropani' ? 'bg-amber-900/60 text-amber-300 font-bold' : 'text-slate-400'
              }`}
            >
              R-A-P-D
            </button>
            <button
              onClick={() => setInput1Type('bigha')}
              className={`px-2 py-0.5 rounded font-medium ${
                input1Type === 'bigha' ? 'bg-orange-900/60 text-orange-300 font-bold' : 'text-slate-400'
              }`}
            >
              B-K-D
            </button>
            <button
              onClick={() => setInput1Type('sqft')}
              className={`px-2 py-0.5 rounded font-medium ${
                input1Type === 'sqft' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
              }`}
            >
              Sq Ft
            </button>
          </div>
        </div>

        {input1Type === 'ropani' && (
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="text-[10px] text-amber-400 block mb-1">Ropani</label>
              <input
                type="number"
                value={r1}
                onChange={(e) => setR1(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-amber-400 block mb-1">Aana</label>
              <input
                type="number"
                value={a1}
                onChange={(e) => setA1(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-amber-400 block mb-1">Paisa</label>
              <input
                type="number"
                value={p1}
                onChange={(e) => setP1(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-amber-400 block mb-1">Daam</label>
              <input
                type="number"
                value={d1}
                onChange={(e) => setD1(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
              />
            </div>
          </div>
        )}

        {input1Type === 'bigha' && (
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-orange-400 block mb-1">Bigha</label>
              <input
                type="number"
                value={b1}
                onChange={(e) => setB1(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-orange-400 block mb-1">Kattha</label>
              <input
                type="number"
                value={k1}
                onChange={(e) => setK1(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-orange-400 block mb-1">Dhur</label>
              <input
                type="number"
                value={dh1}
                onChange={(e) => setDh1(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
              />
            </div>
          </div>
        )}

        {input1Type === 'sqft' && (
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Square Feet</label>
            <input
              type="number"
              value={sqft1}
              onChange={(e) => setSqft1(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-sm"
            />
          </div>
        )}

        <div className="text-[11px] text-slate-500 font-mono text-right">
          = {val1SqFt.toLocaleString('en-US', { maximumFractionDigits: 2 })} sq ft
        </div>
      </div>

      {/* Operator Visual Badge */}
      <div className="flex justify-center -my-2 relative z-10">
        <div className="bg-emerald-600 text-white rounded-full p-2 shadow-lg border-2 border-slate-900">
          {operation === 'add' && <Plus className="w-4 h-4" />}
          {operation === 'subtract' && <Minus className="w-4 h-4" />}
          {operation === 'multiply' && <X className="w-4 h-4" />}
          {operation === 'divide' && <Divide className="w-4 h-4" />}
        </div>
      </div>

      {/* Parcel 2 or Scalar Input */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-bold text-slate-200">
            {isScalarOp ? 'Multiplier / Partition Factor' : 'Parcel 2 (Secondary Area)'}
          </span>

          {!isScalarOp && (
            <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => setInput2Type('ropani')}
                className={`px-2 py-0.5 rounded font-medium ${
                  input2Type === 'ropani' ? 'bg-amber-900/60 text-amber-300 font-bold' : 'text-slate-400'
                }`}
              >
                R-A-P-D
              </button>
              <button
                onClick={() => setInput2Type('bigha')}
                className={`px-2 py-0.5 rounded font-medium ${
                  input2Type === 'bigha' ? 'bg-orange-900/60 text-orange-300 font-bold' : 'text-slate-400'
                }`}
              >
                B-K-D
              </button>
              <button
                onClick={() => setInput2Type('sqft')}
                className={`px-2 py-0.5 rounded font-medium ${
                  input2Type === 'sqft' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
                }`}
              >
                Sq Ft
              </button>
            </div>
          )}
        </div>

        {isScalarOp ? (
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              {operation === 'multiply'
                ? 'Multiply Factor (e.g. number of identical plots)'
                : 'Number of Partition Portions / Heirs (e.g. split into 3 parts)'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={scalar}
                onChange={(e) => setScalar(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-emerald-400 text-lg font-bold"
              />
              <span className="text-xs text-slate-400 whitespace-nowrap">
                {operation === 'divide' ? 'equal shares' : 'times'}
              </span>
            </div>
          </div>
        ) : (
          <>
            {input2Type === 'ropani' && (
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] text-amber-400 block mb-1">Ropani</label>
                  <input
                    type="number"
                    value={r2}
                    onChange={(e) => setR2(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-amber-400 block mb-1">Aana</label>
                  <input
                    type="number"
                    value={a2}
                    onChange={(e) => setA2(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-amber-400 block mb-1">Paisa</label>
                  <input
                    type="number"
                    value={p2}
                    onChange={(e) => setP2(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-amber-400 block mb-1">Daam</label>
                  <input
                    type="number"
                    value={d2}
                    onChange={(e) => setD2(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
                  />
                </div>
              </div>
            )}

            {input2Type === 'bigha' && (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-orange-400 block mb-1">Bigha</label>
                  <input
                    type="number"
                    value={b2}
                    onChange={(e) => setB2(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-orange-400 block mb-1">Kattha</label>
                  <input
                    type="number"
                    value={k2}
                    onChange={(e) => setK2(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-orange-400 block mb-1">Dhur</label>
                  <input
                    type="number"
                    value={dh2}
                    onChange={(e) => setDh2(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
                  />
                </div>
              </div>
            )}

            {input2Type === 'sqft' && (
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Square Feet</label>
                <input
                  type="number"
                  value={sqft2}
                  onChange={(e) => setSqft2(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-sm"
                />
              </div>
            )}

            <div className="text-[11px] text-slate-500 font-mono text-right">
              = {val2.toLocaleString('en-US', { maximumFractionDigits: 2 })} sq ft
            </div>
          </>
        )}
      </div>

      {/* Result Display across all systems */}
      <UnitResultsBadge
        results={result}
        title={
          operation === 'divide'
            ? `Each Partition Share (1/${scalar})`
            : `Operation Result (${operation.toUpperCase()})`
        }
      />

      {/* Nepali Subunits Breakdown */}
      <NepaliUnitsBreakdown results={result} />
    </div>
  );
};
