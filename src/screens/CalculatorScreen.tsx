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
import { Calculator, Copy, Check, Share2, Plus, Minus } from 'lucide-react';

export const CalculatorScreen: React.FC = () => {
  // Unit mode: feet or meters or hath (1 hath = 1.5 ft)
  const [unitMode, setUnitMode] = useState<'ft' | 'm' | 'hath'>('ft');
  // Shape mode
  const [shape, setShape] = useState<'quad' | 'rect' | 'triangle' | 'circle'>('quad');

  // 1. Irregular 4-Corner (4-side + diagonal) - The standard Nepali Cadastral method
  const [sideA, setSideA] = useState<string>('60');
  const [sideB, setSideB] = useState<string>('45');
  const [sideC, setSideC] = useState<string>('65');
  const [sideD, setSideD] = useState<string>('50');
  const [diagonal, setDiagonal] = useState<string>('75');

  // 2. Rectangle / Square
  const [rectLength, setRectLength] = useState<string>('80');
  const [rectWidth, setRectWidth] = useState<string>('45');

  // 3. Triangle (3 sides Heron or base-height)
  const [triMode, setTriMode] = useState<'3sides' | 'baseHeight'>('3sides');
  const [triA, setTriA] = useState<string>('50');
  const [triB, setTriB] = useState<string>('60');
  const [triC, setTriC] = useState<string>('70');
  const [triBase, setTriBase] = useState<string>('60');
  const [triHeight, setTriHeight] = useState<string>('40');

  // 4. Circle
  const [radius, setRadius] = useState<string>('25');

  // Deduct area (house, road, canal)
  const [hasDeduction, setHasDeduction] = useState<boolean>(false);
  const [deductValue, setDeductValue] = useState<string>('0');

  // Calculate gross area in selected unit
  let grossArea = 0;
  if (shape === 'quad') {
    const a = parseFloat(sideA) || 0;
    const b = parseFloat(sideB) || 0;
    const c = parseFloat(sideC) || 0;
    const d = parseFloat(sideD) || 0;
    const diag = parseFloat(diagonal) || 0;
    const t1 = triangleAreaHeron(a, b, diag);
    const t2 = triangleAreaHeron(c, d, diag);
    grossArea = t1 + t2;
  } else if (shape === 'rect') {
    grossArea = rectangleArea(parseFloat(rectLength) || 0, parseFloat(rectWidth) || 0);
  } else if (shape === 'triangle') {
    if (triMode === '3sides') {
      grossArea = triangleAreaHeron(parseFloat(triA) || 0, parseFloat(triB) || 0, parseFloat(triC) || 0);
    } else {
      grossArea = rightTriangleArea(parseFloat(triBase) || 0, parseFloat(triHeight) || 0);
    }
  } else if (shape === 'circle') {
    grossArea = circleArea(parseFloat(radius) || 0);
  }

  // Convert gross to Sq Ft
  let grossSqFt = grossArea;
  if (unitMode === 'm') {
    grossSqFt = grossArea * (M_TO_FT * M_TO_FT);
  } else if (unitMode === 'hath') {
    grossSqFt = grossArea * (1.5 * 1.5); // 1 hath = 1.5 ft, so 1 sq hath = 2.25 sq ft
  }

  // Deductions
  let deductSqFt = 0;
  if (hasDeduction) {
    const rawDeduct = parseFloat(deductValue) || 0;
    if (unitMode === 'm') deductSqFt = rawDeduct * (M_TO_FT * M_TO_FT);
    else if (unitMode === 'hath') deductSqFt = rawDeduct * 2.25;
    else deductSqFt = rawDeduct;
  }

  const netSqFt = Math.max(0, grossSqFt - deductSqFt);
  const results = getAllUnitsFromSqFt(netSqFt);

  return (
    <div className="space-y-3.5 pb-6 max-w-xl mx-auto">
      {/* Unit Selector Strip */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-300">नाप्ने एकाई (Unit):</span>
        <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-xs">
          <button
            onClick={() => setUnitMode('ft')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              unitMode === 'ft' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Feet (फिट)
          </button>
          <button
            onClick={() => setUnitMode('m')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              unitMode === 'm' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Meter (मिटर)
          </button>
          <button
            onClick={() => setUnitMode('hath')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              unitMode === 'hath' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Hath (हात)
          </button>
        </div>
      </div>

      {/* Visual Shape Selection Buttons */}
      <div className="grid grid-cols-4 gap-1.5 text-xs">
        <button
          onClick={() => setShape('quad')}
          className={`p-2 rounded-lg border text-center transition-colors ${
            shape === 'quad'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100 font-semibold'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          <div className="text-[13px] font-bold">४-कुने जग्गा</div>
          <div className="text-[10px] text-zinc-500">४ साइड + कर्ण</div>
        </button>

        <button
          onClick={() => setShape('rect')}
          className={`p-2 rounded-lg border text-center transition-colors ${
            shape === 'rect'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100 font-semibold'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          <div className="text-[13px] font-bold">आयताकार</div>
          <div className="text-[10px] text-zinc-500">लम्बाई × चौडाई</div>
        </button>

        <button
          onClick={() => setShape('triangle')}
          className={`p-2 rounded-lg border text-center transition-colors ${
            shape === 'triangle'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100 font-semibold'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          <div className="text-[13px] font-bold">त्रिभुज</div>
          <div className="text-[10px] text-zinc-500">३ साइड / बेस</div>
        </button>

        <button
          onClick={() => setShape('circle')}
          className={`p-2 rounded-lg border text-center transition-colors ${
            shape === 'circle'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100 font-semibold'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          <div className="text-[13px] font-bold">गोलाकार</div>
          <div className="text-[10px] text-zinc-500">Radius (त्रिज्या)</div>
        </button>
      </div>

      {/* Input Dimensions Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs">
          <span className="font-medium text-zinc-200">
            नाप प्रविष्ट गर्नुहोस् ({unitMode === 'ft' ? 'फिट' : unitMode === 'm' ? 'मिटर' : 'हात'})
          </span>
          <span className="text-[10px] text-zinc-500">तत्काल नतिजा</span>
        </div>

        {/* 1. Irregular 4-Corner */}
        {shape === 'quad' && (
          <div className="space-y-2.5">
            <div className="text-[11px] text-zinc-400 bg-zinc-950 p-2 rounded border border-zinc-800">
              💡 ४ कुने जग्गा नाप्दा चारैतिरको लम्बाई (A, B, C, D) र बीचको छड्के कर्ण (Diagonal) नाप्नुहोस्।
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-0.5">साइड A (Side 1)</label>
                <input
                  type="number"
                  value={sideA}
                  onChange={(e) => setSideA(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block mb-0.5">साइड B (Side 2)</label>
                <input
                  type="number"
                  value={sideB}
                  onChange={(e) => setSideB(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block mb-0.5">साइड C (Side 3)</label>
                <input
                  type="number"
                  value={sideC}
                  onChange={(e) => setSideC(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block mb-0.5">साइड D (Side 4)</label>
                <input
                  type="number"
                  value={sideD}
                  onChange={(e) => setSideD(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-zinc-300 font-medium block mb-0.5">
                बीचको कर्ण (Diagonal Line)
              </label>
              <input
                type="number"
                value={diagonal}
                onChange={(e) => setDiagonal(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs font-bold"
              />
            </div>
          </div>
        )}

        {/* 2. Rectangle */}
        {shape === 'rect' && (
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">लम्बाई (Length)</label>
              <input
                type="number"
                value={rectLength}
                onChange={(e) => setRectLength(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">चौडाई (Width)</label>
              <input
                type="number"
                value={rectWidth}
                onChange={(e) => setRectWidth(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
              />
            </div>
          </div>
        )}

        {/* 3. Triangle */}
        {shape === 'triangle' && (
          <div className="space-y-2.5">
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setTriMode('3sides')}
                className={`px-2.5 py-1 rounded text-xs ${
                  triMode === '3sides' ? 'bg-zinc-800 text-zinc-100 font-medium' : 'text-zinc-500'
                }`}
              >
                ३ वटै भुजा (Heron's Formula)
              </button>
              <button
                onClick={() => setTriMode('baseHeight')}
                className={`px-2.5 py-1 rounded text-xs ${
                  triMode === 'baseHeight' ? 'bg-zinc-800 text-zinc-100 font-medium' : 'text-zinc-500'
                }`}
              >
                आधार × उचाई (Base × Height)
              </button>
            </div>

            {triMode === '3sides' ? (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">भुजा A (Side 1)</label>
                  <input
                    type="number"
                    value={triA}
                    onChange={(e) => setTriA(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">भुजा B (Side 2)</label>
                  <input
                    type="number"
                    value={triB}
                    onChange={(e) => setTriB(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">भुजा C (Side 3)</label>
                  <input
                    type="number"
                    value={triC}
                    onChange={(e) => setTriC(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">आधार (Base)</label>
                  <input
                    type="number"
                    value={triBase}
                    onChange={(e) => setTriBase(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">उचाई (Height)</label>
                  <input
                    type="number"
                    value={triHeight}
                    onChange={(e) => setTriHeight(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. Circle */}
        {shape === 'circle' && (
          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">त्रिज्या (Radius / केन्द्रदेखि छेउसम्म)</label>
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
            />
          </div>
        )}

        {/* Deduct checkbox */}
        <div className="pt-2 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400">
              <input
                type="checkbox"
                checked={hasDeduction}
                onChange={(e) => setHasDeduction(e.target.checked)}
                className="accent-zinc-400 rounded"
              />
              <span>घर, बाटो वा कुलोको क्षेत्रफल घटाउने (Deduct Area)</span>
            </label>
          </div>

          {hasDeduction && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                placeholder={`घटाउने क्षेत्रफल (sq ${unitMode})`}
                value={deductValue}
                onChange={(e) => setDeductValue(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-805 rounded-lg p-2 font-mono text-xs text-zinc-100"
              />
              <span className="text-xs text-zinc-500 font-mono">sq {unitMode}</span>
            </div>
          )}
        </div>
      </div>

      {/* Prominent Results Banner (Simple, Clear, Multi-unit) */}
      <UnitResultsBadge results={results} title="जग्गाको कुल क्षेत्रफल (Total Area)" />
      <NepaliUnitsBreakdown results={results} />
    </div>
  );
};
