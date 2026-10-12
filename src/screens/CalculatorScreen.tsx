import React, { useState } from 'react';
import {
  triangleAreaHeron,
  getAllUnitsFromSqFt,
  KHETMURI_SQFT,
  SQYD_TO_SQFT,
  SQMI_TO_SQFT,
  SQKM_TO_SQFT,
  ARE_TO_SQFT,
  CENT_TO_SQFT,
  GUNTHA_TO_SQFT,
} from '../units';
import {
  Plus,
  Trash2,
  RotateCcw,
  Copy,
  Check,
  Calculator,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export type SideUnit = 'ft' | 'm' | 'in' | 'yd';

interface TriangleItem {
  id: string;
  name: string;
  sideA: string;
  unitA: SideUnit;
  sideB: string;
  unitB: SideUnit;
  sideC: string;
  unitC: SideUnit;
}

// Convert any input side length to feet
function toFeet(value: number, unit: SideUnit): number {
  if (isNaN(value) || value <= 0) return 0;
  switch (unit) {
    case 'ft':
      return value;
    case 'm':
      return value / 0.3048; // exact 1 ft = 0.3048 m
    case 'in':
      return value / 12;
    case 'yd':
      return value * 3;
    default:
      return value;
  }
}

export const CalculatorScreen: React.FC = () => {
  const [triangles, setTriangles] = useState<TriangleItem[]>([
    {
      id: '1',
      name: 'Triangle 1',
      sideA: '60',
      unitA: 'ft',
      sideB: '45',
      unitB: 'ft',
      sideC: '75',
      unitC: 'ft',
    },
    {
      id: '2',
      name: 'Triangle 2',
      sideA: '65',
      unitA: 'ft',
      sideB: '50',
      unitB: 'ft',
      sideC: '75',
      unitC: 'ft',
    },
  ]);

  const [copied, setCopied] = useState<boolean>(false);
  const [showRegionalUnits, setShowRegionalUnits] = useState<boolean>(true);

  // Add a new triangle
  const handleAddTriangle = () => {
    const nextNum = triangles.length + 1;
    setTriangles([
      ...triangles,
      {
        id: String(Date.now()),
        name: `Triangle ${nextNum}`,
        sideA: '',
        unitA: 'ft',
        sideB: '',
        unitB: 'ft',
        sideC: '',
        unitC: 'ft',
      },
    ]);
  };

  // Remove triangle
  const handleRemoveTriangle = (id: string) => {
    if (triangles.length > 1) {
      setTriangles(triangles.filter((t) => t.id !== id));
    }
  };

  // Update field
  const updateTriangle = (id: string, field: keyof TriangleItem, val: string) => {
    setTriangles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: val } : t))
    );
  };

  // Reset all
  const handleReset = () => {
    setTriangles([
      {
        id: '1',
        name: 'Triangle 1',
        sideA: '',
        unitA: 'ft',
        sideB: '',
        unitB: 'ft',
        sideC: '',
        unitC: 'ft',
      },
    ]);
  };

  // Calculate individual triangle area
  const computeTriangleAreaSqFt = (t: TriangleItem): { areaSqFt: number; isValid: boolean } => {
    const aFt = toFeet(parseFloat(t.sideA) || 0, t.unitA);
    const bFt = toFeet(parseFloat(t.sideB) || 0, t.unitB);
    const cFt = toFeet(parseFloat(t.sideC) || 0, t.unitC);

    if (aFt <= 0 || bFt <= 0 || cFt <= 0) {
      return { areaSqFt: 0, isValid: true };
    }

    // Triangle inequality theorem: sum of any 2 sides must be greater than the third
    if (aFt + bFt <= cFt || aFt + cFt <= bFt || bFt + cFt <= aFt) {
      return { areaSqFt: 0, isValid: false };
    }

    const area = triangleAreaHeron(aFt, bFt, cFt);
    return { areaSqFt: area, isValid: true };
  };

  // Sum of all triangle areas
  const triangleCalculations = triangles.map((t) => {
    const calc = computeTriangleAreaSqFt(t);
    return {
      ...t,
      areaSqFt: calc.areaSqFt,
      areaSqM: calc.areaSqFt * 0.092903,
      isValid: calc.isValid,
    };
  });

  const totalParcelSqFt = triangleCalculations.reduce((sum, t) => sum + t.areaSqFt, 0);
  const totalParcelSqM = totalParcelSqFt * 0.092903;
  const multiUnitResults = getAllUnitsFromSqFt(totalParcelSqFt);

  // Additional units
  const totalSqYd = totalParcelSqFt / SQYD_TO_SQFT;
  const totalSqMi = totalParcelSqFt / SQMI_TO_SQFT;
  const totalSqKm = totalParcelSqFt / SQKM_TO_SQFT;
  const totalKhetmuri = totalParcelSqFt / KHETMURI_SQFT;
  const totalAres = totalParcelSqFt / ARE_TO_SQFT;
  const totalCent = totalParcelSqFt / CENT_TO_SQFT;
  const totalGuntha = totalParcelSqFt / GUNTHA_TO_SQFT;

  const handleCopyReport = () => {
    let text = `Parcel Scalene Triangles Area Calculation Report:\n`;
    text += `--------------------------------------------------\n`;
    triangleCalculations.forEach((t, idx) => {
      text += `${t.name}: ${t.areaSqFt.toFixed(2)} sq ft (${t.areaSqM.toFixed(2)} m²)\n`;
      text += `  Sides: a=${t.sideA}${t.unitA}, b=${t.sideB}${t.unitB}, c=${t.sideC}${t.unitC}\n`;
    });
    text += `--------------------------------------------------\n`;
    text += `FINAL TOTAL PARCEL AREA: ${totalParcelSqFt.toFixed(2)} sq ft (${totalParcelSqM.toFixed(2)} m²)\n\n`;
    text += `NEPAL SYSTEM:\n`;
    text += `• Ropani System: ${multiUnitResults.ropani.formatted} (${multiUnitResults.ropani.ropani} Ropani, ${multiUnitResults.ropani.aana} Aana, ${multiUnitResults.ropani.paisa} Paisa, ${multiUnitResults.ropani.daam} Daam)\n`;
    text += `• Bigha System: ${multiUnitResults.bigha.formatted} (${multiUnitResults.bigha.bigha} Bigha, ${multiUnitResults.bigha.kattha} Kattha, ${multiUnitResults.bigha.dhur} Dhur)\n`;
    text += `• Khetmuri: ${totalKhetmuri.toFixed(4)}\n\n`;
    text += `INTERNATIONAL SYSTEM:\n`;
    text += `• Acres: ${multiUnitResults.acres.toFixed(4)} ac\n`;
    text += `• Hectares: ${multiUnitResults.hectares.toFixed(4)} ha\n`;
    text += `• Square Yards: ${totalSqYd.toFixed(2)} sq yd\n`;
    text += `• Square Miles: ${totalSqMi.toFixed(6)} sq mi\n`;
    text += `• Square Kilometers: ${totalSqKm.toFixed(6)} km²\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 pb-8 max-w-xl mx-auto">
      {/* Top Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
            <span>Scalene Triangle Parcel Calculator</span>
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Decompose any parcel into triangles (Heron's formula). Mix feet & meters per side.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleAddTriangle}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Triangle</span>
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            title="Reset Triangles"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Triangles List */}
      <div className="space-y-2.5">
        {triangles.map((t, idx) => {
          const calc = triangleCalculations[idx];
          return (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono font-bold text-[11px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={t.name}
                    onChange={(e) => updateTriangle(t.id, 'name', e.target.value)}
                    className="text-xs font-semibold text-slate-800 dark:text-slate-200 bg-transparent border-none outline-none focus:underline w-28"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
                      {calc.areaSqFt.toFixed(2)} sq ft
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      ({calc.areaSqM.toFixed(2)} m²)
                    </span>
                  </div>

                  {triangles.length > 1 && (
                    <button
                      onClick={() => handleRemoveTriangle(t.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove Triangle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 3 Sides Input: Independent values and units */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {/* Side A */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                    Side A (Length)
                  </span>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 60"
                      value={t.sideA}
                      onChange={(e) => updateTriangle(t.id, 'sideA', e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-mono text-xs font-bold text-slate-900 dark:text-slate-100 outline-none"
                    />
                    <select
                      value={t.unitA}
                      onChange={(e) => updateTriangle(t.id, 'unitA', e.target.value)}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 outline-none"
                    >
                      <option value="ft">ft</option>
                      <option value="m">m</option>
                      <option value="in">in</option>
                      <option value="yd">yd</option>
                    </select>
                  </div>
                </div>

                {/* Side B */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                    Side B (Length)
                  </span>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 45"
                      value={t.sideB}
                      onChange={(e) => updateTriangle(t.id, 'sideB', e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-mono text-xs font-bold text-slate-900 dark:text-slate-100 outline-none"
                    />
                    <select
                      value={t.unitB}
                      onChange={(e) => updateTriangle(t.id, 'unitB', e.target.value)}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 outline-none"
                    >
                      <option value="ft">ft</option>
                      <option value="m">m</option>
                      <option value="in">in</option>
                      <option value="yd">yd</option>
                    </select>
                  </div>
                </div>

                {/* Side C */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                    Side C (Diagonal / Base)
                  </span>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 75"
                      value={t.sideC}
                      onChange={(e) => updateTriangle(t.id, 'sideC', e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-mono text-xs font-bold text-slate-900 dark:text-slate-100 outline-none"
                    />
                    <select
                      value={t.unitC}
                      onChange={(e) => updateTriangle(t.id, 'unitC', e.target.value)}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 outline-none"
                    >
                      <option value="ft">ft</option>
                      <option value="m">m</option>
                      <option value="in">in</option>
                      <option value="yd">yd</option>
                    </select>
                  </div>
                </div>
              </div>

              {!calc.isValid && (
                <div className="text-[11px] text-rose-600 bg-rose-50 dark:bg-rose-950/40 p-1.5 rounded border border-rose-200 dark:border-rose-900 font-medium">
                  Invalid Triangle: The sum of any 2 sides must be greater than the 3rd side (Triangle Inequality Rule).
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sum of Triangles Breakdown Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Parcel Decomposition Summary ({triangles.length} Triangles)
            </span>
            <p className="text-[10px] text-slate-500">
              Sum of individual scalene triangles gives total parcel boundary area
            </p>
          </div>
          <button
            onClick={handleCopyReport}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Report'}</span>
          </button>
        </div>

        {/* Triangle items breakdown table */}
        <div className="space-y-1 text-xs">
          {triangleCalculations.map((t, idx) => (
            <div
              key={t.id}
              className="flex justify-between items-center py-1 px-2 rounded bg-slate-50 dark:bg-slate-800/50 font-mono text-[11px]"
            >
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {idx + 1}. {t.name} (a={t.sideA || 0}{t.unitA}, b={t.sideB || 0}{t.unitB}, c={t.sideC || 0}{t.unitC})
              </span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {t.areaSqFt.toFixed(2)} sq ft ({t.areaSqM.toFixed(2)} m²)
              </span>
            </div>
          ))}
        </div>

        {/* Grand Total Area Header */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 dark:bg-slate-800 text-white font-mono mt-2">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
              FINAL TOTAL PARCEL AREA (SUM)
            </span>
            <div className="text-base font-bold text-white">
              {totalParcelSqFt.toLocaleString('en-US', { maximumFractionDigits: 2 })} sq ft
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
              METRIC EQUIVALENT
            </span>
            <div className="text-sm font-bold text-slate-200">
              {totalParcelSqM.toLocaleString('en-US', { maximumFractionDigits: 2 })} m²
            </div>
          </div>
        </div>
      </div>

      {/* ALL UNITS OUTPUT CONVERSIONS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Parcel Area in All Global & Regional Units
          </span>
          <button
            onClick={() => setShowRegionalUnits(!showRegionalUnits)}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 p-0.5"
          >
            {showRegionalUnits ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* 1. Nepal Systems: Ropani & Bigha */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Ropani System */}
          <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Ropani System (R-A-P-D)
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {multiUnitResults.ropani.formatted}
              </span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 flex flex-wrap gap-x-2">
              <span><b>{multiUnitResults.ropani.ropani}</b> Ropani</span>
              <span><b>{multiUnitResults.ropani.aana}</b> Aana</span>
              <span><b>{multiUnitResults.ropani.paisa}</b> Paisa</span>
              <span><b>{multiUnitResults.ropani.daam}</b> Daam</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              Khetmuri: {totalKhetmuri.toFixed(4)} (25 Ropani)
            </div>
          </div>

          {/* Bigha System */}
          <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Bigha System (B-K-D)
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {multiUnitResults.bigha.formatted}
              </span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 flex flex-wrap gap-x-2">
              <span><b>{multiUnitResults.bigha.bigha}</b> Bigha</span>
              <span><b>{multiUnitResults.bigha.kattha}</b> Kattha</span>
              <span><b>{multiUnitResults.bigha.dhur}</b> Dhur</span>
            </div>
          </div>
        </div>

        {/* 2. Global Units Grid: Europe, America, Asia */}
        {showRegionalUnits && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[10px] text-slate-500 block">Acres</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {multiUnitResults.acres.toFixed(4)} ac
              </span>
            </div>

            <div className="p-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[10px] text-slate-500 block">Hectares</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {multiUnitResults.hectares.toFixed(4)} ha
              </span>
            </div>

            <div className="p-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[10px] text-slate-500 block">Square Yards</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {totalSqYd.toLocaleString('en-US', { maximumFractionDigits: 2 })} sq yd
              </span>
            </div>

            <div className="p-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[10px] text-slate-500 block">Ares</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {totalAres.toFixed(3)} a
              </span>
            </div>

            <div className="p-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[10px] text-slate-500 block">Square Miles</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {totalSqMi < 0.0001 && totalSqMi > 0 ? totalSqMi.toExponential(3) : totalSqMi.toFixed(6)} sq mi
              </span>
            </div>

            <div className="p-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[10px] text-slate-500 block">Square Kilometers</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {totalSqKm < 0.0001 && totalSqKm > 0 ? totalSqKm.toExponential(3) : totalSqKm.toFixed(6)} km²
              </span>
            </div>

            <div className="p-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[10px] text-slate-500 block">Cent (South India)</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {totalCent.toFixed(3)} cent
              </span>
            </div>

            <div className="p-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[10px] text-slate-500 block">Guntha (India)</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {totalGuntha.toFixed(3)} guntha
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
