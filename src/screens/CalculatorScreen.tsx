import React, { useState } from 'react';
import {
  triangleAreaHeron,
  rightTriangleArea,
  rectangleArea,
  getAllUnitsFromSqFt,
  M_TO_FT,
} from '../units';
import { UnitResultsBadge } from '../components/UnitResultsBadge';
import { NepaliUnitsBreakdown } from '../components/NepaliUnitsBreakdown';
import { Calculator, Building2, Trash2, Plus } from 'lucide-react';

export const CalculatorScreen: React.FC = () => {
  const [unitMode, setUnitMode] = useState<'ft' | 'm'>('ft');
  const [method, setMethod] = useState<'triangleHeron' | 'triangleBaseHeight' | 'rectangle' | 'quadrilateral'>('triangleHeron');

  const [sideA, setSideA] = useState<string>('50');
  const [sideB, setSideB] = useState<string>('60');
  const [sideC, setSideC] = useState<string>('70');

  const [base, setBase] = useState<string>('60');
  const [height, setHeight] = useState<string>('40');

  const [rectLength, setRectLength] = useState<string>('80');
  const [rectWidth, setRectWidth] = useState<string>('45');

  const [quadA, setQuadA] = useState<string>('50');
  const [quadB, setQuadB] = useState<string>('60');
  const [quadC, setQuadC] = useState<string>('55');
  const [quadD, setQuadD] = useState<string>('65');
  const [quadDiag, setQuadDiag] = useState<string>('75');

  const [deductions, setDeductions] = useState<number[]>([250]);
  const [newDeduction, setNewDeduction] = useState<string>('');

  let grossArea = 0;
  if (method === 'triangleHeron') {
    grossArea = triangleAreaHeron(parseFloat(sideA) || 0, parseFloat(sideB) || 0, parseFloat(sideC) || 0);
  } else if (method === 'triangleBaseHeight') {
    grossArea = rightTriangleArea(parseFloat(base) || 0, parseFloat(height) || 0);
  } else if (method === 'rectangle') {
    grossArea = rectangleArea(parseFloat(rectLength) || 0, parseFloat(rectWidth) || 0);
  } else if (method === 'quadrilateral') {
    const diag = parseFloat(quadDiag) || 0;
    const t1 = triangleAreaHeron(parseFloat(quadA) || 0, parseFloat(quadB) || 0, diag);
    const t2 = triangleAreaHeron(parseFloat(quadC) || 0, parseFloat(quadD) || 0, diag);
    grossArea = t1 + t2;
  }

  const grossAreaSqFt = unitMode === 'm' ? grossArea * (M_TO_FT * M_TO_FT) : grossArea;
  const totalFootprintRaw = deductions.reduce((a, b) => a + b, 0);
  const totalFootprintSqFt = unitMode === 'm' ? totalFootprintRaw * (M_TO_FT * M_TO_FT) : totalFootprintRaw;

  const netAreaSqFt = Math.max(0, grossAreaSqFt - totalFootprintSqFt);
  const multiUnitResults = getAllUnitsFromSqFt(netAreaSqFt);

  const handleAddDeduction = () => {
    const val = parseFloat(newDeduction);
    if (!isNaN(val) && val > 0) {
      setDeductions([...deductions, val]);
      setNewDeduction('');
    }
  };

  const handleRemoveDeduction = (idx: number) => {
    setDeductions(deductions.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4 pb-6 max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-zinc-300" />
          <h2 className="text-sm font-semibold text-zinc-100">Land Area Calculator</h2>
        </div>

        {/* Feet / Meter Toggle */}
        <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-xs">
          <button
            onClick={() => setUnitMode('ft')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              unitMode === 'ft' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Feet
          </button>
          <button
            onClick={() => setUnitMode('m')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              unitMode === 'm' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Meters
          </button>
        </div>
      </div>

      {/* Method Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        <button
          onClick={() => setMethod('triangleHeron')}
          className={`p-2.5 rounded-lg border text-xs text-left transition-colors ${
            method === 'triangleHeron'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          <div className="font-medium">Triangle (3 Sides)</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Heron's Formula</div>
        </button>

        <button
          onClick={() => setMethod('quadrilateral')}
          className={`p-2.5 rounded-lg border text-xs text-left transition-colors ${
            method === 'quadrilateral'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          <div className="font-medium">4 Corners</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">2 Triangles + Diag</div>
        </button>

        <button
          onClick={() => setMethod('rectangle')}
          className={`p-2.5 rounded-lg border text-xs text-left transition-colors ${
            method === 'rectangle'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          <div className="font-medium">Rectangle</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Length × Width</div>
        </button>

        <button
          onClick={() => setMethod('triangleBaseHeight')}
          className={`p-2.5 rounded-lg border text-xs text-left transition-colors ${
            method === 'triangleBaseHeight'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          <div className="font-medium">Right Triangle</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">½ Base × Height</div>
        </button>
      </div>

      {/* Input Dimensions */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <span className="text-xs font-medium text-zinc-300">
            Dimensions ({unitMode === 'ft' ? 'Feet' : 'Meters'})
          </span>
        </div>

        {method === 'triangleHeron' && (
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Side A</label>
              <input
                type="number"
                value={sideA}
                onChange={(e) => setSideA(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs focus:border-zinc-700"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Side B</label>
              <input
                type="number"
                value={sideB}
                onChange={(e) => setSideB(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs focus:border-zinc-700"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Side C</label>
              <input
                type="number"
                value={sideC}
                onChange={(e) => setSideC(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs focus:border-zinc-700"
              />
            </div>
          </div>
        )}

        {method === 'quadrilateral' && (
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] text-zinc-500 block mb-0.5">Side A</label>
                <input
                  type="number"
                  value={quadA}
                  onChange={(e) => setQuadA(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 block mb-0.5">Side B</label>
                <input
                  type="number"
                  value={quadB}
                  onChange={(e) => setQuadB(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 block mb-0.5">Side C</label>
                <input
                  type="number"
                  value={quadC}
                  onChange={(e) => setQuadC(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 block mb-0.5">Side D</label>
                <input
                  type="number"
                  value={quadD}
                  onChange={(e) => setQuadD(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Common Diagonal</label>
              <input
                type="number"
                value={quadDiag}
                onChange={(e) => setQuadDiag(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
              />
            </div>
          </div>
        )}

        {method === 'rectangle' && (
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Length</label>
              <input
                type="number"
                value={rectLength}
                onChange={(e) => setRectLength(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Width</label>
              <input
                type="number"
                value={rectWidth}
                onChange={(e) => setRectWidth(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
              />
            </div>
          </div>
        )}

        {method === 'triangleBaseHeight' && (
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Base</label>
              <input
                type="number"
                value={base}
                onChange={(e) => setBase(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Height</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* Building Footprint Deduction */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-medium text-zinc-200">Building Footprint Deduction</span>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            -{totalFootprintRaw.toFixed(1)} sq {unitMode}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={`Enter area to deduct (sq ${unitMode})`}
            value={newDeduction}
            onChange={(e) => setNewDeduction(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 font-mono"
          />
          <button
            onClick={handleAddDeduction}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5 inline mr-1" /> Add
          </button>
        </div>

        {deductions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {deductions.map((d, i) => (
              <span
                key={i}
                className="bg-zinc-950 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-xs font-mono flex items-center gap-1.5"
              >
                Structure {i + 1}: -{d} sq {unitMode}
                <button onClick={() => handleRemoveDeduction(i)} className="hover:text-zinc-100">
                  <Trash2 className="w-3 h-3 text-zinc-500 hover:text-zinc-300" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Output Cards */}
      <UnitResultsBadge results={multiUnitResults} title="Calculated Parcel Area" />
      <NepaliUnitsBreakdown results={multiUnitResults} />
    </div>
  );
};
