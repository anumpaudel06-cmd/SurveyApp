import React, { useState } from 'react';
import {
  ArithmeticOp,
  calculateAreaArithmetic,
  ropaniToSqFt,
  bighaToSqFt,
} from '../units';
import { UnitResultsBadge } from '../components/UnitResultsBadge';
import { NepaliUnitsBreakdown } from '../components/NepaliUnitsBreakdown';
import { Plus, Minus, X, Divide, Calculator } from 'lucide-react';

export const ArithmeticScreen: React.FC = () => {
  const [operation, setOperation] = useState<ArithmeticOp>('add');

  const [input1Type, setInput1Type] = useState<'sqft' | 'ropani' | 'bigha'>('ropani');
  const [sqft1, setSqft1] = useState<string>('5476');
  const [r1, setR1] = useState<string>('1');
  const [a1, setA1] = useState<string>('2');
  const [p1, setP1] = useState<string>('1');
  const [d1, setD1] = useState<string>('0');
  const [b1, setB1] = useState<string>('0');
  const [k1, setK1] = useState<string>('10');
  const [dh1, setDh1] = useState<string>('5');

  const [input2Type, setInput2Type] = useState<'sqft' | 'ropani' | 'bigha' | 'scalar'>('ropani');
  const [sqft2, setSqft2] = useState<string>('342.25');
  const [r2, setR2] = useState<string>('0');
  const [a2, setA2] = useState<string>('8');
  const [p2, setP2] = useState<string>('2');
  const [d2, setD2] = useState<string>('1');
  const [b2, setB2] = useState<string>('0');
  const [k2, setK2] = useState<string>('5');
  const [dh2, setDh2] = useState<string>('0');
  const [scalar, setScalar] = useState<string>('3');

  let val1SqFt = 0;
  if (input1Type === 'sqft') {
    val1SqFt = parseFloat(sqft1) || 0;
  } else if (input1Type === 'ropani') {
    val1SqFt = ropaniToSqFt(parseFloat(r1) || 0, parseFloat(a1) || 0, parseFloat(p1) || 0, parseFloat(d1) || 0);
  } else if (input1Type === 'bigha') {
    val1SqFt = bighaToSqFt(parseFloat(b1) || 0, parseFloat(k1) || 0, parseFloat(dh1) || 0);
  }

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
    <div className="space-y-4 pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-zinc-300" />
          <h2 className="text-sm font-semibold text-zinc-100">Area Arithmetic</h2>
        </div>
      </div>

      {/* Operation Selection Bar */}
      <div className="grid grid-cols-4 gap-1.5">
        <button
          onClick={() => setOperation('add')}
          className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
            operation === 'add'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>

        <button
          onClick={() => setOperation('subtract')}
          className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
            operation === 'subtract'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          <Minus className="w-3.5 h-3.5" />
          <span>Subtract</span>
        </button>

        <button
          onClick={() => setOperation('multiply')}
          className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
            operation === 'multiply'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          <X className="w-3.5 h-3.5" />
          <span>Multiply</span>
        </button>

        <button
          onClick={() => setOperation('divide')}
          className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
            operation === 'divide'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          <Divide className="w-3.5 h-3.5" />
          <span>Divide</span>
        </button>
      </div>

      {/* Parcel 1 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <span className="text-xs font-medium text-zinc-300">Parcel 1</span>
          <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-[11px]">
            <button
              onClick={() => setInput1Type('ropani')}
              className={`px-2 py-0.5 rounded font-medium ${
                input1Type === 'ropani' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500'
              }`}
            >
              R-A-P-D
            </button>
            <button
              onClick={() => setInput1Type('bigha')}
              className={`px-2 py-0.5 rounded font-medium ${
                input1Type === 'bigha' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500'
              }`}
            >
              B-K-D
            </button>
            <button
              onClick={() => setInput1Type('sqft')}
              className={`px-2 py-0.5 rounded font-medium ${
                input1Type === 'sqft' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500'
              }`}
            >
              Sq Ft
            </button>
          </div>
        </div>

        {input1Type === 'ropani' && (
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="text-[10px] text-zinc-500 block mb-0.5">Ropani</label>
              <input
                type="number"
                value={r1}
                onChange={(e) => setR1(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 font-mono text-zinc-100 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 block mb-0.5">Aana</label>
              <input
                type="number"
                value={a1}
                onChange={(e) => setA1(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 font-mono text-zinc-100 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 block mb-0.5">Paisa</label>
              <input
                type="number"
                value={p1}
                onChange={(e) => setP1(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 font-mono text-zinc-100 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 block mb-0.5">Daam</label>
              <input
                type="number"
                value={d1}
                onChange={(e) => setD1(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 font-mono text-zinc-100 text-xs"
              />
            </div>
          </div>
        )}

        {input1Type === 'bigha' && (
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-zinc-500 block mb-0.5">Bigha</label>
              <input
                type="number"
                value={b1}
                onChange={(e) => setB1(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 font-mono text-zinc-100 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 block mb-0.5">Kattha</label>
              <input
                type="number"
                value={k1}
                onChange={(e) => setK1(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 font-mono text-zinc-100 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 block mb-0.5">Dhur</label>
              <input
                type="number"
                value={dh1}
                onChange={(e) => setDh1(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 font-mono text-zinc-100 text-xs"
              />
            </div>
          </div>
        )}

        {input1Type === 'sqft' && (
          <div>
            <label className="text-[10px] text-zinc-500 block mb-0.5">Square Feet</label>
            <input
              type="number"
              value={sqft1}
              onChange={(e) => setSqft1(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 font-mono text-zinc-100 text-xs"
            />
          </div>
        )}
      </div>

      {/* Parcel 2 or Scalar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <span className="text-xs font-medium text-zinc-300">
            {isScalarOp ? 'Factor / Shares' : 'Parcel 2'}
          </span>

          {!isScalarOp && (
            <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-[11px]">
              <button
                onClick={() => setInput2Type('ropani')}
                className={`px-2 py-0.5 rounded font-medium ${
                  input2Type === 'ropani' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500'
                }`}
              >
                R-A-P-D
              </button>
              <button
                onClick={() => setInput2Type('bigha')}
                className={`px-2 py-0.5 rounded font-medium ${
                  input2Type === 'bigha' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500'
                }`}
              >
                B-K-D
              </button>
              <button
                onClick={() => setInput2Type('sqft')}
                className={`px-2 py-0.5 rounded font-medium ${
                  input2Type === 'sqft' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500'
                }`}
              >
                Sq Ft
              </button>
            </div>
          )}
        </div>

        {isScalarOp ? (
          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">
              {operation === 'multiply' ? 'Multiplier Factor' : 'Number of Equal Shares'}
            </label>
            <input
              type="number"
              min="1"
              value={scalar}
              onChange={(e) => setScalar(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 font-mono text-zinc-100 text-sm font-bold"
            />
          </div>
        ) : (
          <>
            {input2Type === 'ropani' && (
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-0.5">Ropani</label>
                  <input
                    type="number"
                    value={r2}
                    onChange={(e) => setR2(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 font-mono text-zinc-100 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-0.5">Aana</label>
                  <input
                    type="number"
                    value={a2}
                    onChange={(e) => setA2(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 font-mono text-zinc-100 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-0.5">Paisa</label>
                  <input
                    type="number"
                    value={p2}
                    onChange={(e) => setP2(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 font-mono text-zinc-100 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-0.5">Daam</label>
                  <input
                    type="number"
                    value={d2}
                    onChange={(e) => setD2(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 font-mono text-zinc-100 text-xs"
                  />
                </div>
              </div>
            )}

            {input2Type === 'bigha' && (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-0.5">Bigha</label>
                  <input
                    type="number"
                    value={b2}
                    onChange={(e) => setB2(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 font-mono text-zinc-100 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-0.5">Kattha</label>
                  <input
                    type="number"
                    value={k2}
                    onChange={(e) => setK2(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 font-mono text-zinc-100 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-0.5">Dhur</label>
                  <input
                    type="number"
                    value={dh2}
                    onChange={(e) => setDh2(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 font-mono text-zinc-100 text-xs"
                  />
                </div>
              </div>
            )}

            {input2Type === 'sqft' && (
              <div>
                <label className="text-[10px] text-zinc-500 block mb-0.5">Square Feet</label>
                <input
                  type="number"
                  value={sqft2}
                  onChange={(e) => setSqft2(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 font-mono text-zinc-100 text-xs"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Result Display */}
      <UnitResultsBadge
        results={result}
        title={
          operation === 'divide'
            ? `Each Share (1/${scalar})`
            : `Result (${operation.toUpperCase()})`
        }
      />
      <NepaliUnitsBreakdown results={result} />
    </div>
  );
};
