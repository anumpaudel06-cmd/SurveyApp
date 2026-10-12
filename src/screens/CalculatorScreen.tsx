import React, { useState } from 'react';
import {
  triangleAreaHeron,
  rightTriangleArea,
  rectangleArea,
  triangleAreaSAS,
  deductFootprint,
  getAllUnitsFromSqFt,
  getAllUnitsFromSqM,
  MultiUnitAreaResult,
  FT_TO_M,
  M_TO_FT,
} from '../units';
import { UnitResultsBadge } from '../components/UnitResultsBadge';
import { NepaliUnitsBreakdown } from '../components/NepaliUnitsBreakdown';
import {
  Calculator,
  Building2,
  Trash2,
  Plus,
  RotateCcw,
  Sparkles,
  Layers,
  HelpCircle,
  BookmarkPlus,
} from 'lucide-react';

export const CalculatorScreen: React.FC = () => {
  // Input unit mode: feet or meters
  const [unitMode, setUnitMode] = useState<'ft' | 'm'>('ft');
  // Calculation method
  const [method, setMethod] = useState<'triangleHeron' | 'triangleBaseHeight' | 'rectangle' | 'quadrilateral'>('triangleHeron');

  // Triangle Heron inputs (sides a, b, c)
  const [sideA, setSideA] = useState<string>('50');
  const [sideB, setSideB] = useState<string>('60');
  const [sideC, setSideC] = useState<string>('70');

  // Triangle Base-Height inputs
  const [base, setBase] = useState<string>('60');
  const [height, setHeight] = useState<string>('40');

  // Rectangle inputs
  const [rectLength, setRectLength] = useState<string>('80');
  const [rectWidth, setRectWidth] = useState<string>('45');

  // Quadrilateral inputs (Traditional Nepali 2-triangles with common diagonal)
  // Triangle 1: a, b, diag; Triangle 2: c, d, diag
  const [quadA, setQuadA] = useState<string>('50');
  const [quadB, setQuadB] = useState<string>('60');
  const [quadC, setQuadC] = useState<string>('55');
  const [quadD, setQuadD] = useState<string>('65');
  const [quadDiag, setQuadDiag] = useState<string>('75');

  // Building footprint deduction
  const [deductions, setDeductions] = useState<number[]>([250]); // initial 250 sq unit building
  const [newDeduction, setNewDeduction] = useState<string>('');

  // Calculate gross area in selected unit (sq ft or sq m)
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

  // Convert gross area to sq ft based on unitMode
  const grossAreaSqFt = unitMode === 'm' ? grossArea * (M_TO_FT * M_TO_FT) : grossArea;

  // Deduct building footprints
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
    <div className="space-y-5 pb-8 max-w-3xl mx-auto">
      {/* Top Banner & Unit Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
            Cadastral Method
          </span>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" /> Land Area Calculator
          </h2>
        </div>

        {/* Feet / Meter Toggle */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setUnitMode('ft')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              unitMode === 'ft'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Feet (ft)
          </button>
          <button
            onClick={() => setUnitMode('m')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              unitMode === 'm'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Meters (m)
          </button>
        </div>
      </div>

      {/* Method Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => setMethod('triangleHeron')}
          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
            method === 'triangleHeron'
              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="font-bold">Triangle (3 Sides)</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Heron's Formula</div>
        </button>

        <button
          onClick={() => setMethod('quadrilateral')}
          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
            method === 'quadrilateral'
              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="font-bold">Nepali 4-Corner</div>
          <div className="text-[10px] text-slate-500 mt-0.5">2 Triangles + Diag</div>
        </button>

        <button
          onClick={() => setMethod('rectangle')}
          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
            method === 'rectangle'
              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="font-bold">Rectangle / Square</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Length × Width</div>
        </button>

        <button
          onClick={() => setMethod('triangleBaseHeight')}
          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
            method === 'triangleBaseHeight'
              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="font-bold">Right Triangle</div>
          <div className="text-[10px] text-slate-500 mt-0.5">½ Base × Height</div>
        </button>
      </div>

      {/* Input Dimensions Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-bold text-slate-200">
            Enter Parcel Boundary Dimensions ({unitMode === 'ft' ? 'Feet' : 'Meters'})
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">Real-time Calculation</span>
        </div>

        {/* Inputs per method */}
        {method === 'triangleHeron' && (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Side A ({unitMode})</label>
              <input
                type="number"
                value={sideA}
                onChange={(e) => setSideA(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-white text-sm focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Side B ({unitMode})</label>
              <input
                type="number"
                value={sideB}
                onChange={(e) => setSideB(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-white text-sm focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Side C ({unitMode})</label>
              <input
                type="number"
                value={sideC}
                onChange={(e) => setSideC(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-white text-sm focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {method === 'quadrilateral' && (
          <div className="space-y-3">
            <div className="text-[11px] text-amber-400/90 bg-amber-950/30 p-2.5 rounded-xl border border-amber-900/40">
              Traditional Nepali field survey breaks 4 irregular boundary corners into 2 triangles separated by the main diagonal.
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Side A ({unitMode})</label>
                <input
                  type="number"
                  value={quadA}
                  onChange={(e) => setQuadA(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Side B ({unitMode})</label>
                <input
                  type="number"
                  value={quadB}
                  onChange={(e) => setQuadB(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Side C ({unitMode})</label>
                <input
                  type="number"
                  value={quadC}
                  onChange={(e) => setQuadC(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Side D ({unitMode})</label>
                <input
                  type="number"
                  value={quadD}
                  onChange={(e) => setQuadD(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                Common Diagonal ({unitMode})
              </label>
              <input
                type="number"
                value={quadDiag}
                onChange={(e) => setQuadDiag(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-emerald-400 text-sm focus:border-emerald-500 font-bold"
              />
            </div>
          </div>
        )}

        {method === 'rectangle' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Length ({unitMode})</label>
              <input
                type="number"
                value={rectLength}
                onChange={(e) => setRectLength(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-white text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Width ({unitMode})</label>
              <input
                type="number"
                value={rectWidth}
                onChange={(e) => setRectWidth(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-white text-sm"
              />
            </div>
          </div>
        )}

        {method === 'triangleBaseHeight' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Base ({unitMode})</label>
              <input
                type="number"
                value={base}
                onChange={(e) => setBase(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-white text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Perpendicular Height ({unitMode})</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-white text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Building Footprint Deduction Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold text-white">Building Footprint Deduction</span>
          </div>
          <span className="text-[11px] text-rose-300 font-mono font-bold">
            Total Deducted: {totalFootprintRaw.toFixed(1)} sq {unitMode}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={`Add building footprint (sq ${unitMode})`}
            value={newDeduction}
            onChange={(e) => setNewDeduction(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 font-mono"
          />
          <button
            onClick={handleAddDeduction}
            className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/60 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Deduct
          </button>
        </div>

        {deductions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {deductions.map((d, i) => (
              <span
                key={i}
                className="bg-slate-950 border border-rose-900/40 text-rose-300 px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5"
              >
                Structure {i + 1}: -{d} sq {unitMode}
                <button
                  onClick={() => handleRemoveDeduction(i)}
                  className="hover:text-white"
                >
                  <Trash2 className="w-3 h-3 text-rose-400" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Output Results Badge (Multi-Unit Output) */}
      <UnitResultsBadge results={multiUnitResults} title="Net Parcel Survey Results" />

      {/* Traditional Nepali Visual Breakdown */}
      <NepaliUnitsBreakdown results={multiUnitResults} />
    </div>
  );
};
