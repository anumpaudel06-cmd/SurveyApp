import React, { useState } from 'react';
import {
  triangleAreaHeron,
  rightTriangleArea,
  rectangleArea,
  circleArea,
  getAllUnitsFromSqFt,
  M_TO_FT,
} from '../units';
import { UnitResultsBadge } from '../components/UnitResultsBadge';
import { NepaliUnitsBreakdown } from '../components/NepaliUnitsBreakdown';
import {
  RotateCcw,
  Building,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const CalculatorScreen: React.FC = () => {
  // Unit mode: Feet, Meter, Hath (1 Hath = 1.5 ft)
  const [unitMode, setUnitMode] = useState<'ft' | 'm' | 'hath'>('ft');

  // Shape selection
  type Shape = 'quad' | 'rect' | 'triangle' | 'circle' | 'trapezoid';
  const [shape, setShape] = useState<Shape>('quad');

  // 1. Irregular 4-Corner (4-side + diagonal)
  const [sideA, setSideA] = useState<string>('60');
  const [sideB, setSideB] = useState<string>('45');
  const [sideC, setSideC] = useState<string>('65');
  const [sideD, setSideD] = useState<string>('50');
  const [diagonal, setDiagonal] = useState<string>('75');

  // 2. Rectangle / Square
  const [rectLength, setRectLength] = useState<string>('80');
  const [rectWidth, setRectWidth] = useState<string>('45');

  // 3. Triangle
  const [triMode, setTriMode] = useState<'3sides' | 'baseHeight'>('3sides');
  const [triA, setTriA] = useState<string>('50');
  const [triB, setTriB] = useState<string>('60');
  const [triC, setTriC] = useState<string>('70');
  const [triBase, setTriBase] = useState<string>('60');
  const [triHeight, setTriHeight] = useState<string>('40');

  // 4. Circle
  const [circleMode, setCircleMode] = useState<'radius' | 'diameter'>('radius');
  const [circleVal, setCircleVal] = useState<string>('30');

  // 5. Trapezoid
  const [trapA, setTrapA] = useState<string>('70');
  const [trapB, setTrapB] = useState<string>('50');
  const [trapH, setTrapH] = useState<string>('40');

  // Deduction (House, Road, Canal)
  const [hasDeduction, setHasDeduction] = useState<boolean>(false);
  const [deductMode, setDeductMode] = useState<'dims' | 'direct'>('dims');
  const [deductL, setDeductL] = useState<string>('20');
  const [deductW, setDeductW] = useState<string>('15');
  const [deductDirect, setDeductDirect] = useState<string>('300');

  // Detailed breakdown toggle
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // Unit conversion factor to square feet
  const unitLabel = unitMode === 'ft' ? 'ft (फिट)' : unitMode === 'm' ? 'm (मिटर)' : 'hath (हात)';

  // Calculate gross area in selected unit
  let grossAreaInSelectedUnit = 0;

  if (shape === 'quad') {
    const a = parseFloat(sideA) || 0;
    const b = parseFloat(sideB) || 0;
    const c = parseFloat(sideC) || 0;
    const d = parseFloat(sideD) || 0;
    const diag = parseFloat(diagonal) || 0;
    const t1 = triangleAreaHeron(a, b, diag);
    const t2 = triangleAreaHeron(c, d, diag);
    grossAreaInSelectedUnit = t1 + t2;
  } else if (shape === 'rect') {
    grossAreaInSelectedUnit = rectangleArea(parseFloat(rectLength) || 0, parseFloat(rectWidth) || 0);
  } else if (shape === 'triangle') {
    if (triMode === '3sides') {
      grossAreaInSelectedUnit = triangleAreaHeron(
        parseFloat(triA) || 0,
        parseFloat(triB) || 0,
        parseFloat(triC) || 0
      );
    } else {
      grossAreaInSelectedUnit = rightTriangleArea(parseFloat(triBase) || 0, parseFloat(triHeight) || 0);
    }
  } else if (shape === 'circle') {
    const val = parseFloat(circleVal) || 0;
    const r = circleMode === 'radius' ? val : val / 2;
    grossAreaInSelectedUnit = circleArea(r);
  } else if (shape === 'trapezoid') {
    const a = parseFloat(trapA) || 0;
    const b = parseFloat(trapB) || 0;
    const h = parseFloat(trapH) || 0;
    grossAreaInSelectedUnit = ((a + b) / 2) * h;
  }

  // Convert gross area to Square Feet
  let grossSqFt = grossAreaInSelectedUnit;
  if (unitMode === 'm') {
    grossSqFt = grossAreaInSelectedUnit * (M_TO_FT * M_TO_FT);
  } else if (unitMode === 'hath') {
    // 1 hath = 1.5 ft => 1 sq hath = 2.25 sq ft
    grossSqFt = grossAreaInSelectedUnit * 2.25;
  }

  // Calculate deduction in square feet
  let deductSqFt = 0;
  if (hasDeduction) {
    let rawDeduct = 0;
    if (deductMode === 'dims') {
      rawDeduct = (parseFloat(deductL) || 0) * (parseFloat(deductW) || 0);
    } else {
      rawDeduct = parseFloat(deductDirect) || 0;
    }

    if (unitMode === 'm') {
      deductSqFt = rawDeduct * (M_TO_FT * M_TO_FT);
    } else if (unitMode === 'hath') {
      deductSqFt = rawDeduct * 2.25;
    } else {
      deductSqFt = rawDeduct;
    }
  }

  const netSqFt = Math.max(0, grossSqFt - deductSqFt);
  const results = getAllUnitsFromSqFt(netSqFt);

  const handleReset = () => {
    setSideA('0');
    setSideB('0');
    setSideC('0');
    setSideD('0');
    setDiagonal('0');
    setRectLength('0');
    setRectWidth('0');
    setTriA('0');
    setTriB('0');
    setTriC('0');
    setCircleVal('0');
    setDeductDirect('0');
  };

  return (
    <div className="space-y-3 pb-8 max-w-xl mx-auto">
      {/* 1. Unit Selector Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-800">
            Measuring Unit (नाप्ने एकाइ)
          </span>
          <p className="text-[11px] text-slate-500">Choose measurement system</p>
        </div>
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setUnitMode('ft')}
            className={`px-3 py-1 rounded-md transition-colors ${
              unitMode === 'ft'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Feet (फिट)
          </button>
          <button
            onClick={() => setUnitMode('m')}
            className={`px-3 py-1 rounded-md transition-colors ${
              unitMode === 'm'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Meter (मिटर)
          </button>
          <button
            onClick={() => setUnitMode('hath')}
            className={`px-3 py-1 rounded-md transition-colors ${
              unitMode === 'hath'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hath (हात)
          </button>
        </div>
      </div>

      {/* 2. Shape Selector Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-xs">
        <div className="text-[11px] font-medium text-slate-500 px-1 mb-1.5">
          Land Shape / Method (जग्गाको आकार / विधि छान्नुहोस्)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs font-medium">
          {/* 4-corner with diagonal */}
          <button
            onClick={() => setShape('quad')}
            className={`p-2 rounded-lg border transition-colors flex flex-col items-center justify-center text-center ${
              shape === 'quad'
                ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span>4-Sided (४ कुने)</span>
            <span className="text-[10px] opacity-80">+ Diagonal (विकर्ण)</span>
          </button>

          {/* Rectangle */}
          <button
            onClick={() => setShape('rect')}
            className={`p-2 rounded-lg border transition-colors flex flex-col items-center justify-center text-center ${
              shape === 'rect'
                ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span>Rectangle (आयत)</span>
            <span className="text-[10px] opacity-80">L × B (लम्बाई × चौडाई)</span>
          </button>

          {/* Triangle */}
          <button
            onClick={() => setShape('triangle')}
            className={`p-2 rounded-lg border transition-colors flex flex-col items-center justify-center text-center ${
              shape === 'triangle'
                ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span>Triangle (त्रिभुज)</span>
            <span className="text-[10px] opacity-80">3 Sides (३ भुजा)</span>
          </button>

          {/* Circle */}
          <button
            onClick={() => setShape('circle')}
            className={`p-2 rounded-lg border transition-colors flex flex-col items-center justify-center text-center ${
              shape === 'circle'
                ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span>Circle (गोलाकार)</span>
            <span className="text-[10px] opacity-80">Radius (अर्धव्यास)</span>
          </button>

          {/* Trapezoid */}
          <button
            onClick={() => setShape('trapezoid')}
            className={`p-2 rounded-lg border transition-colors flex flex-col items-center justify-center text-center ${
              shape === 'trapezoid'
                ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span>Trapezoid (समलम्ब)</span>
            <span className="text-[10px] opacity-80">2 Parallel + H</span>
          </button>
        </div>
      </div>

      {/* 3. Inputs based on selected shape */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="text-xs font-semibold text-slate-800">
            {shape === 'quad' && '4-Corner Land with Diagonal (४ कुने जग्गा र विकर्ण)'}
            {shape === 'rect' && 'Rectangle / Square Land (आयताकार / वर्गाकार जग्गा)'}
            {shape === 'triangle' && 'Triangle Land (त्रिभुजाकार जग्गा)'}
            {shape === 'circle' && 'Circular Land (गोलाकार जग्गा)'}
            {shape === 'trapezoid' && 'Trapezoid Land (समलम्ब चतुर्भुज जग्गा)'}
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset (रिसेट)</span>
          </button>
        </div>

        {/* SHAPE 1: 4-Corner with Diagonal (Heron's Formula on 2 Triangles) */}
        {shape === 'quad' && (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/80">
              <b>Field Survey Tip (नापी सुझाव):</b> Irregular 4-corner parcels are divided into 2 triangles using a diagonal line. Enter all 4 boundary edges and the diagonal line.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  Side 1 / North (पहिलो भुजा - क) ({unitLabel})
                </label>
                <input
                  type="number"
                  step="any"
                  value={sideA}
                  onChange={(e) => setSideA(e.target.value)}
                  placeholder="e.g. 60"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  Side 2 / East (दोस्रो भुजा - ख) ({unitLabel})
                </label>
                <input
                  type="number"
                  step="any"
                  value={sideB}
                  onChange={(e) => setSideB(e.target.value)}
                  placeholder="e.g. 45"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  Side 3 / South (तेस्रो भुजा - ग) ({unitLabel})
                </label>
                <input
                  type="number"
                  step="any"
                  value={sideC}
                  onChange={(e) => setSideC(e.target.value)}
                  placeholder="e.g. 65"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  Side 4 / West (चौथो भुजा - घ) ({unitLabel})
                </label>
                <input
                  type="number"
                  step="any"
                  value={sideD}
                  onChange={(e) => setSideD(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-800 block mb-1">
                Diagonal (छड्के विकर्ण नाप) ({unitLabel})
              </label>
              <input
                type="number"
                step="any"
                value={diagonal}
                onChange={(e) => setDiagonal(e.target.value)}
                placeholder="e.g. 75"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:bg-white focus:border-slate-800 outline-none"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Connects Corner 1 to Corner 3 across the parcel (कुना १ देखि कुना ३ को सिधा नाप)
              </span>
            </div>
          </div>
        )}

        {/* SHAPE 2: Rectangle */}
        {shape === 'rect' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Length (लम्बाइ) ({unitLabel})
              </label>
              <input
                type="number"
                step="any"
                value={rectLength}
                onChange={(e) => setRectLength(e.target.value)}
                placeholder="e.g. 80"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:bg-white focus:border-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Breadth / Width (चौडाइ) ({unitLabel})
              </label>
              <input
                type="number"
                step="any"
                value={rectWidth}
                onChange={(e) => setRectWidth(e.target.value)}
                placeholder="e.g. 45"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:bg-white focus:border-slate-800 outline-none"
              />
            </div>
          </div>
        )}

        {/* SHAPE 3: Triangle */}
        {shape === 'triangle' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => setTriMode('3sides')}
                className={`flex-1 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                  triMode === '3sides'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                3 Boundary Sides (३ भुजा नाप - हेरोन्स)
              </button>
              <button
                onClick={() => setTriMode('baseHeight')}
                className={`flex-1 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                  triMode === 'baseHeight'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Base × Height (आधार × उचाइ)
              </button>
            </div>

            {triMode === '3sides' ? (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    Side A (भुजा क) ({unitLabel})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={triA}
                    onChange={(e) => setTriA(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-sm font-mono text-slate-900 focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    Side B (भुजा ख) ({unitLabel})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={triB}
                    onChange={(e) => setTriB(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-sm font-mono text-slate-900 focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    Side C (भुजा ग) ({unitLabel})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={triC}
                    onChange={(e) => setTriC(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-sm font-mono text-slate-900 focus:bg-white outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    Base (आधार) ({unitLabel})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={triBase}
                    onChange={(e) => setTriBase(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    Height (उचाइ) ({unitLabel})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={triHeight}
                    onChange={(e) => setTriHeight(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:bg-white outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* SHAPE 4: Circle */}
        {shape === 'circle' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => setCircleMode('radius')}
                className={`flex-1 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                  circleMode === 'radius'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Radius / r (अर्धव्यास)
              </button>
              <button
                onClick={() => setCircleMode('diameter')}
                className={`flex-1 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                  circleMode === 'diameter'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Diameter / d (व्यास)
              </button>
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                {circleMode === 'radius' ? 'Radius (अर्धव्यास)' : 'Diameter (व्यास)'} ({unitLabel})
              </label>
              <input
                type="number"
                step="any"
                value={circleVal}
                onChange={(e) => setCircleVal(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:bg-white outline-none"
              />
            </div>
          </div>
        )}

        {/* SHAPE 5: Trapezoid */}
        {shape === 'trapezoid' && (
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Parallel Side 1 (क) ({unitLabel})
              </label>
              <input
                type="number"
                step="any"
                value={trapA}
                onChange={(e) => setTrapA(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-sm font-mono text-slate-900 focus:bg-white outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Parallel Side 2 (ख) ({unitLabel})
              </label>
              <input
                type="number"
                step="any"
                value={trapB}
                onChange={(e) => setTrapB(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-sm font-mono text-slate-900 focus:bg-white outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Distance / Height (उचाइ) ({unitLabel})
              </label>
              <input
                type="number"
                step="any"
                value={trapH}
                onChange={(e) => setTrapH(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-sm font-mono text-slate-900 focus:bg-white outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Deduction Section (Building / Road / Canal) */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-600" />
            <div>
              <span className="text-xs font-semibold text-slate-800">
                Building & Road Deduction (घर, बाटो वा कुलो कटाउने)
              </span>
              <p className="text-[11px] text-slate-500">
                Deduct house footprint or road portion from total land
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={hasDeduction}
              onChange={(e) => setHasDeduction(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
          </label>
        </div>

        {hasDeduction && (
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <div className="flex gap-2">
              <button
                onClick={() => setDeductMode('dims')}
                className={`flex-1 py-1 text-xs rounded-md border font-medium ${
                  deductMode === 'dims'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                By Length × Breadth (लम्बाई × चौडाई)
              </button>
              <button
                onClick={() => setDeductMode('direct')}
                className={`flex-1 py-1 text-xs rounded-md border font-medium ${
                  deductMode === 'direct'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Direct Area (सिधै क्षेत्रफल)
              </button>
            </div>

            {deductMode === 'dims' ? (
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">
                    Deduction Length (कटाउने लम्बाइ) ({unitLabel})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={deductL}
                    onChange={(e) => setDeductL(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">
                    Deduction Width (कटाउने चौडाइ) ({unitLabel})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={deductW}
                    onChange={(e) => setDeductW(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-900 outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">
                  Area to Deduct (घटाउने क्षेत्रफल) ({unitMode === 'm' ? 'sq m' : 'sq ft'})
                </label>
                <input
                  type="number"
                  step="any"
                  value={deductDirect}
                  onChange={(e) => setDeductDirect(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-900 outline-none"
                />
              </div>
            )}

            {/* Deduction Summary Strip */}
            <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg border border-slate-200 text-slate-600 font-mono">
              <span>Gross: {grossSqFt.toFixed(1)} sq ft</span>
              <span>- Deduct: {deductSqFt.toFixed(1)} sq ft</span>
              <span className="font-bold text-slate-900">= Net: {netSqFt.toFixed(1)} sq ft</span>
            </div>
          </div>
        )}
      </div>

      {/* 5. Main Results Card */}
      <UnitResultsBadge
        results={results}
        title={hasDeduction ? 'Net Usable Area (खुद बाँकी जग्गा क्षेत्रफल)' : 'Total Land Area (जग्गाको कुल क्षेत्रफल)'}
      />

      {/* 6. Expandable Detailed Nepali Breakdown */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-800"
        >
          <span>Detailed Land System Breakdown (विस्तृत पहाडी तथा तराई विवरण)</span>
          {showDetails ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {showDetails && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <NepaliUnitsBreakdown results={results} />
          </div>
        )}
      </div>
    </div>
  );
};
