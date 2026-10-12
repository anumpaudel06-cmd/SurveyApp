import React, { useState } from 'react';
import {
  ROPANI_SQFT,
  AANA_SQFT,
  PAISA_SQFT,
  DAAM_SQFT,
  BIGHA_SQFT,
  KATTHA_SQFT,
  DHUR_SQFT,
  ACRE_TO_SQFT,
  HECTARE_TO_SQFT,
  KHETMURI_SQFT,
  SQYD_TO_SQFT,
  SQMI_TO_SQFT,
  SQKM_TO_SQFT,
  LENGTH_TO_METERS,
  LengthUnit,
  ropaniToSqFt,
  bighaToSqFt,
  getAllUnitsFromSqFt,
} from '../units';
import { UnitResultsBadge } from '../components/UnitResultsBadge';
import {
  RotateCcw,
  Calculator,
  Scale,
  Ruler,
  Copy,
  Check,
  Plus,
  Minus,
  Divide,
  X,
  Users,
  Trash2,
} from 'lucide-react';

interface PlotItem {
  id: string;
  name: string;
  system: 'ropani' | 'bigha' | 'sqft';
  r: string;
  a: string;
  p: string;
  d: string;
  b: string;
  k: string;
  dh: string;
  sqftVal: string;
}

export const ConverterScreen: React.FC = () => {
  // Main Top Mode: 'converter' | 'arithmetic'
  const [screenMode, setScreenMode] = useState<'converter' | 'arithmetic'>('converter');

  // Category in Converter: 'area' | 'length'
  const [activeCategory, setActiveCategory] = useState<'area' | 'length'>('area');
  const [copied, setCopied] = useState<boolean>(false);

  // BASE VALUE IN SQUARE FEET
  const [baseSqFt, setBaseSqFt] = useState<number>(5476); // Default 1 Ropani

  // AREA INPUT FIELDS:
  // Typing in any one field updates baseSqFt, and all other fields instantly reflect the converted value
  const handleAreaChange = (field: string, valStr: string) => {
    const val = parseFloat(valStr);
    if (isNaN(val)) {
      setBaseSqFt(0);
      return;
    }

    switch (field) {
      case 'sqft':
        setBaseSqFt(val);
        break;
      case 'sqm':
        setBaseSqFt(val / 0.09290304);
        break;
      case 'hectare':
        setBaseSqFt(val * HECTARE_TO_SQFT);
        break;
      case 'sqmi':
        setBaseSqFt(val * SQMI_TO_SQFT);
        break;
      case 'sqyd':
        setBaseSqFt(val * SQYD_TO_SQFT);
        break;
      case 'sqkm':
        setBaseSqFt(val * SQKM_TO_SQFT);
        break;
      case 'acre':
        setBaseSqFt(val * ACRE_TO_SQFT);
        break;
      case 'bigha':
        setBaseSqFt(val * BIGHA_SQFT);
        break;
      case 'kattha':
        setBaseSqFt(val * KATTHA_SQFT);
        break;
      case 'dhur':
        setBaseSqFt(val * DHUR_SQFT);
        break;
      case 'ropani':
        setBaseSqFt(val * ROPANI_SQFT);
        break;
      case 'aana':
        setBaseSqFt(val * AANA_SQFT);
        break;
      case 'paisa':
        setBaseSqFt(val * PAISA_SQFT);
        break;
      case 'daam':
        setBaseSqFt(val * DAAM_SQFT);
        break;
      case 'khetmuri':
        setBaseSqFt(val * KHETMURI_SQFT);
        break;
      default:
        setBaseSqFt(val);
    }
  };

  const handleClearArea = () => {
    setBaseSqFt(0);
  };

  const handlePreset = (sqft: number) => {
    setBaseSqFt(sqft);
  };

  // Safe formatting helper
  const fmt = (val: number, decimals = 4): string => {
    if (!val || isNaN(val)) return '0';
    return val.toFixed(decimals).replace(/\.?0+$/, '');
  };

  // Calculated values from baseSqFt
  const valSqFt = baseSqFt;
  const valSqM = baseSqFt * 0.09290304;
  const valHectare = baseSqFt / HECTARE_TO_SQFT;
  const valSqMi = baseSqFt / SQMI_TO_SQFT;
  const valSqYd = baseSqFt / SQYD_TO_SQFT;
  const valSqKm = baseSqFt / SQKM_TO_SQFT;
  const valAcre = baseSqFt / ACRE_TO_SQFT;
  const valBigha = baseSqFt / BIGHA_SQFT;
  const valKattha = baseSqFt / KATTHA_SQFT;
  const valDhur = baseSqFt / DHUR_SQFT;
  const valRopani = baseSqFt / ROPANI_SQFT;
  const valAana = baseSqFt / AANA_SQFT;
  const valPaisa = baseSqFt / PAISA_SQFT;
  const valDaam = baseSqFt / DAAM_SQFT;
  const valKhetmuri = baseSqFt / KHETMURI_SQFT;

  // Breakdown R-A-P-D
  const ropaniInt = Math.floor(baseSqFt / ROPANI_SQFT);
  let remR = baseSqFt % ROPANI_SQFT;
  const aanaInt = Math.floor(remR / AANA_SQFT);
  remR = remR % AANA_SQFT;
  const paisaInt = Math.floor(remR / PAISA_SQFT);
  remR = remR % PAISA_SQFT;
  const daamInt = (remR / DAAM_SQFT).toFixed(2);
  const rapdFormatted = `${ropaniInt}-${aanaInt}-${paisaInt}-${daamInt}`;

  // Breakdown B-K-D
  const bighaInt = Math.floor(baseSqFt / BIGHA_SQFT);
  let remB = baseSqFt % BIGHA_SQFT;
  const katthaInt = Math.floor(remB / KATTHA_SQFT);
  remB = remB % KATTHA_SQFT;
  const dhurInt = (remB / DHUR_SQFT).toFixed(3);
  const bkdFormatted = `${bighaInt}-${katthaInt}-${dhurInt}`;

  // ----------------- LENGTH CONVERTER STATE -----------------
  const [baseMeters, setBaseMeters] = useState<number>(100);

  const handleLengthChange = (unit: LengthUnit, valStr: string) => {
    const val = parseFloat(valStr);
    if (isNaN(val)) {
      setBaseMeters(0);
      return;
    }
    const factor = LENGTH_TO_METERS[unit] || 1;
    setBaseMeters(val * factor);
  };

  const handleClearLength = () => {
    setBaseMeters(0);
  };

  // ----------------- LAND ARITHMETIC STATE -----------------
  const [opMode, setOpMode] = useState<'add' | 'sub' | 'split' | 'mul'>('add');

  // Add Plots Mode
  const [plots, setPlots] = useState<PlotItem[]>([
    {
      id: '1',
      name: 'Plot 1',
      system: 'ropani',
      r: '1',
      a: '2',
      p: '1',
      d: '0',
      b: '0',
      k: '0',
      dh: '0',
      sqftVal: '0',
    },
    {
      id: '2',
      name: 'Plot 2',
      system: 'ropani',
      r: '0',
      a: '14',
      p: '3',
      d: '2',
      b: '0',
      k: '0',
      dh: '0',
      sqftVal: '0',
    },
  ]);

  const getPlotSqFt = (plot: PlotItem): number => {
    if (plot.system === 'ropani') {
      return ropaniToSqFt(
        parseFloat(plot.r) || 0,
        parseFloat(plot.a) || 0,
        parseFloat(plot.p) || 0,
        parseFloat(plot.d) || 0
      );
    } else if (plot.system === 'bigha') {
      return bighaToSqFt(
        parseFloat(plot.b) || 0,
        parseFloat(plot.k) || 0,
        parseFloat(plot.dh) || 0
      );
    } else {
      return parseFloat(plot.sqftVal) || 0;
    }
  };

  const handleAddPlot = () => {
    const nextNum = plots.length + 1;
    setPlots([
      ...plots,
      {
        id: String(Date.now()),
        name: `Plot ${nextNum}`,
        system: 'ropani',
        r: '0',
        a: '4',
        p: '0',
        d: '0',
        b: '0',
        k: '0',
        dh: '0',
        sqftVal: '0',
      },
    ]);
  };

  const handleRemovePlot = (id: string) => {
    if (plots.length > 1) {
      setPlots(plots.filter((p) => p.id !== id));
    }
  };

  const handleUpdatePlot = (id: string, field: keyof PlotItem, value: any) => {
    setPlots(plots.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const sumAddedSqFt = plots.reduce((acc, p) => acc + getPlotSqFt(p), 0);
  const sumAddedResults = getAllUnitsFromSqFt(sumAddedSqFt);

  // Subtract Land Mode
  const [motherPlotSystem, setMotherPlotSystem] = useState<'ropani' | 'bigha'>('ropani');
  const [motherR, setMotherR] = useState<string>('2');
  const [motherA, setMotherA] = useState<string>('8');
  const [motherP, setMotherP] = useState<string>('0');
  const [motherD, setMotherD] = useState<string>('0');
  const [motherB, setMotherB] = useState<string>('0');
  const [motherK, setMotherK] = useState<string>('0');
  const [motherDh, setMotherDh] = useState<string>('0');

  const [subType, setSubType] = useState<'dimension' | 'plot'>('dimension');
  const [subLen, setSubLen] = useState<string>('150');
  const [subWid, setSubWid] = useState<string>('20');
  const [subUnit, setSubUnit] = useState<'ft' | 'm'>('ft');
  const [deductR, setDeductR] = useState<string>('0');
  const [deductA, setDeductA] = useState<string>('6');
  const [deductP, setDeductP] = useState<string>('2');
  const [deductD, setDeductD] = useState<string>('0');

  const motherSqFt =
    motherPlotSystem === 'ropani'
      ? ropaniToSqFt(parseFloat(motherR) || 0, parseFloat(motherA) || 0, parseFloat(motherP) || 0, parseFloat(motherD) || 0)
      : bighaToSqFt(parseFloat(motherB) || 0, parseFloat(motherK) || 0, parseFloat(motherDh) || 0);

  let deductionSqFt = 0;
  if (subType === 'dimension') {
    const l = parseFloat(subLen) || 0;
    const w = parseFloat(subWid) || 0;
    const area = l * w;
    deductionSqFt = subUnit === 'm' ? area * 10.7639 : area;
  } else {
    deductionSqFt = ropaniToSqFt(parseFloat(deductR) || 0, parseFloat(deductA) || 0, parseFloat(deductP) || 0, parseFloat(deductD) || 0);
  }

  const remainingSqFt = Math.max(0, motherSqFt - deductionSqFt);
  const remainingResults = getAllUnitsFromSqFt(remainingSqFt);

  // Division Among Heirs Mode
  const [heirCount, setHeirCount] = useState<number>(3);
  const heirEachSqFt = heirCount > 0 ? motherSqFt / heirCount : 0;
  const heirEachResults = getAllUnitsFromSqFt(heirEachSqFt);

  // Multiply Standard Plots Mode
  const [mulCount, setMulCount] = useState<number>(5);
  const [standardPlotAana, setStandardPlotAana] = useState<string>('4');
  const singlePlotSqFt = (parseFloat(standardPlotAana) || 0) * AANA_SQFT;
  const totalMultipliedSqFt = singlePlotSqFt * (mulCount || 1);
  const multipliedResults = getAllUnitsFromSqFt(totalMultipliedSqFt);

  const handleCopyArea = () => {
    const text = `Area Converter Summary:
• Square Feet: ${fmt(valSqFt, 2)} sq ft
• Square Meter: ${fmt(valSqM, 2)} m²
• Hectare: ${fmt(valHectare, 6)} ha
• Square Miles: ${fmt(valSqMi, 6)} sq mi
• Square Yards: ${fmt(valSqYd, 2)} sq yd
• Square Kilometers: ${fmt(valSqKm, 6)} sq km
• Acre: ${fmt(valAcre, 6)} ac
• R-A-P-D: ${rapdFormatted}
• B-K-D: ${bkdFormatted}
• Khetmuri: ${fmt(valKhetmuri, 4)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 pb-8 max-w-xl mx-auto">
      {/* 1. Main Navigation: Unit Converter vs Land Arithmetic */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-xs flex items-center justify-between">
        <div className="grid grid-cols-2 gap-1 w-full sm:w-auto">
          <button
            onClick={() => setScreenMode('converter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              screenMode === 'converter'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Unit Converter</span>
          </button>

          <button
            onClick={() => setScreenMode('arithmetic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              screenMode === 'arithmetic'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Land Arithmetic (Plots)</span>
          </button>
        </div>

        {screenMode === 'converter' && (
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={handleCopyArea}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-medium flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* SECTION A: UNIT CONVERTER (ALL REQUESTED UNITS) */}
      {/* ========================================================= */}
      {screenMode === 'converter' && (
        <div className="space-y-3">
          {/* Top Category Switcher & Action Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
              <button
                onClick={() => setActiveCategory('area')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeCategory === 'area'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Area Converter</span>
              </button>
              <button
                onClick={() => setActiveCategory('length')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeCategory === 'length'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Length Converter</span>
              </button>
            </div>

            {/* Clear & Calculate All Button Bar */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={activeCategory === 'area' ? handleClearArea : handleClearLength}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
              <button
                onClick={() => {
                  // Trigger re-calc / highlight
                  setBaseSqFt(baseSqFt || 5476);
                }}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1 shadow-xs"
              >
                <Calculator className="w-3 h-3" />
                <span>Calculate All</span>
              </button>
            </div>
          </div>

          {/* Quick Presets Bar */}
          {activeCategory === 'area' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-semibold shrink-0">Presets:</span>
              <button
                onClick={() => handlePreset(ROPANI_SQFT)}
                className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 font-mono text-[11px] shrink-0"
              >
                1 Ropani (5,476 sq ft)
              </button>
              <button
                onClick={() => handlePreset(BIGHA_SQFT)}
                className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 font-mono text-[11px] shrink-0"
              >
                1 Bigha (72,900 sq ft)
              </button>
              <button
                onClick={() => handlePreset(ACRE_TO_SQFT)}
                className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 font-mono text-[11px] shrink-0"
              >
                1 Acre (43,560 sq ft)
              </button>
              <button
                onClick={() => handlePreset(HECTARE_TO_SQFT)}
                className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 font-mono text-[11px] shrink-0"
              >
                1 Hectare (10,000 m²)
              </button>
            </div>
          )}

          {/* AREA CONVERTER FIELDS */}
          {activeCategory === 'area' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-3">
              <div className="text-[11px] text-slate-500 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <span>Typing in any field instantly recalculates and fills all other fields.</span>
                <span className="font-mono font-semibold text-blue-600">Bidirectional Sync</span>
              </div>

              {/* 1. International Standard Units (Hectare, Acre, Sq Km, Sq Miles, Sq Yards, Sq Ft, Sq M) */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  International & Standard Units
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Square Feet */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>Square Feet (sq ft)</span>
                      <span className="font-mono text-[10px] text-slate-400">1 sq ft</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={valSqFt ? fmt(valSqFt, 3) : ''}
                      onChange={(e) => handleAreaChange('sqft', e.target.value)}
                      placeholder="0"
                      className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Square Meter */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>Square Meter (m²)</span>
                      <span className="font-mono text-[10px] text-slate-400">1 m² = 10.7639 sq ft</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={valSqM ? fmt(valSqM, 3) : ''}
                      onChange={(e) => handleAreaChange('sqm', e.target.value)}
                      placeholder="0"
                      className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Hectare */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-between">
                      <span>Hectare (ha)</span>
                      <span className="font-mono text-[10px] text-slate-400">1 ha = 10,000 m²</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={valHectare ? fmt(valHectare, 6) : ''}
                      onChange={(e) => handleAreaChange('hectare', e.target.value)}
                      placeholder="0"
                      className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Acre */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-between">
                      <span>Acre (ac)</span>
                      <span className="font-mono text-[10px] text-slate-400">1 ac = 43,560 sq ft</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={valAcre ? fmt(valAcre, 6) : ''}
                      onChange={(e) => handleAreaChange('acre', e.target.value)}
                      placeholder="0"
                      className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Square Yards */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>Square Yards (sq yd)</span>
                      <span className="font-mono text-[10px] text-slate-400">1 sq yd = 9 sq ft</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={valSqYd ? fmt(valSqYd, 3) : ''}
                      onChange={(e) => handleAreaChange('sqyd', e.target.value)}
                      placeholder="0"
                      className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Square Miles */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>Square Miles (sq mi)</span>
                      <span className="font-mono text-[10px] text-slate-400">640 acres</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={valSqMi ? fmt(valSqMi, 7) : ''}
                      onChange={(e) => handleAreaChange('sqmi', e.target.value)}
                      placeholder="0"
                      className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Square Kilometers */}
                  <div className="space-y-1 col-span-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>Square Kilometers (sq km)</span>
                      <span className="font-mono text-[10px] text-slate-400">100 hectares</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={valSqKm ? fmt(valSqKm, 7) : ''}
                      onChange={(e) => handleAreaChange('sqkm', e.target.value)}
                      placeholder="0"
                      className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Nepali Cadastral Units (Ropani, Aana, Paisa, Daam, Khetmuri) */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Nepali Hilly System (Ropani System)
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-600">
                    Combined: {rapdFormatted}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {/* Ropani */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Ropani</label>
                    <input
                      type="number"
                      step="any"
                      value={valRopani ? fmt(valRopani, 4) : ''}
                      onChange={(e) => handleAreaChange('ropani', e.target.value)}
                      placeholder="0"
                      className="w-full px-2 py-1 rounded-md text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                    <span className="text-[9px] text-slate-400 font-mono block">5,476 sq ft</span>
                  </div>

                  {/* Aana */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Aana</label>
                    <input
                      type="number"
                      step="any"
                      value={valAana ? fmt(valAana, 4) : ''}
                      onChange={(e) => handleAreaChange('aana', e.target.value)}
                      placeholder="0"
                      className="w-full px-2 py-1 rounded-md text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                    <span className="text-[9px] text-slate-400 font-mono block">342.25 sq ft</span>
                  </div>

                  {/* Paisa */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Paisa</label>
                    <input
                      type="number"
                      step="any"
                      value={valPaisa ? fmt(valPaisa, 4) : ''}
                      onChange={(e) => handleAreaChange('paisa', e.target.value)}
                      placeholder="0"
                      className="w-full px-2 py-1 rounded-md text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                    <span className="text-[9px] text-slate-400 font-mono block">85.56 sq ft</span>
                  </div>

                  {/* Daam */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Daam</label>
                    <input
                      type="number"
                      step="any"
                      value={valDaam ? fmt(valDaam, 4) : ''}
                      onChange={(e) => handleAreaChange('daam', e.target.value)}
                      placeholder="0"
                      className="w-full px-2 py-1 rounded-md text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                    <span className="text-[9px] text-slate-400 font-mono block">21.39 sq ft</span>
                  </div>

                  {/* Khetmuri */}
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Khetmuri</label>
                    <input
                      type="number"
                      step="any"
                      value={valKhetmuri ? fmt(valKhetmuri, 4) : ''}
                      onChange={(e) => handleAreaChange('khetmuri', e.target.value)}
                      placeholder="0"
                      className="w-full px-2 py-1 rounded-md text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                    <span className="text-[9px] text-slate-400 font-mono block">25 Ropani</span>
                  </div>
                </div>
              </div>

              {/* 3. Nepali Terai System (Bigha, Kattha, Dhur) */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Nepali Terai System (Bigha System)
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-600">
                    Combined: {bkdFormatted}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Bigha */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Bigha</label>
                    <input
                      type="number"
                      step="any"
                      value={valBigha ? fmt(valBigha, 4) : ''}
                      onChange={(e) => handleAreaChange('bigha', e.target.value)}
                      placeholder="0"
                      className="w-full px-2 py-1.5 rounded-md text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                    <span className="text-[9px] text-slate-400 font-mono block">72,900 sq ft</span>
                  </div>

                  {/* Kattha */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Kattha</label>
                    <input
                      type="number"
                      step="any"
                      value={valKattha ? fmt(valKattha, 4) : ''}
                      onChange={(e) => handleAreaChange('kattha', e.target.value)}
                      placeholder="0"
                      className="w-full px-2 py-1.5 rounded-md text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                    <span className="text-[9px] text-slate-400 font-mono block">3,645 sq ft</span>
                  </div>

                  {/* Dhur */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Dhur</label>
                    <input
                      type="number"
                      step="any"
                      value={valDhur ? fmt(valDhur, 4) : ''}
                      onChange={(e) => handleAreaChange('dhur', e.target.value)}
                      placeholder="0"
                      className="w-full px-2 py-1.5 rounded-md text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                    <span className="text-[9px] text-slate-400 font-mono block">182.25 sq ft</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LENGTH CONVERTER FIELDS */}
          {activeCategory === 'length' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-3">
              <div className="text-[11px] text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                Instant length converter with surveying and metric/imperial units.
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* Meter */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Meters (m)</label>
                  <input
                    type="number"
                    step="any"
                    value={baseMeters ? fmt(baseMeters, 3) : ''}
                    onChange={(e) => handleLengthChange('meters', e.target.value)}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>

                {/* Feet */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Feet (ft)</label>
                  <input
                    type="number"
                    step="any"
                    value={baseMeters ? fmt(baseMeters / 0.3048, 3) : ''}
                    onChange={(e) => handleLengthChange('feet', e.target.value)}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>

                {/* Hath */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-blue-600 dark:text-blue-400">Hath (हात)</label>
                  <input
                    type="number"
                    step="any"
                    value={baseMeters ? fmt(baseMeters / 0.4572, 3) : ''}
                    onChange={(e) => handleLengthChange('hath', e.target.value)}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                  <span className="text-[9px] text-slate-400 block font-mono">1 hath = 1.5 ft</span>
                </div>

                {/* Inches */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Inches (in)</label>
                  <input
                    type="number"
                    step="any"
                    value={baseMeters ? fmt(baseMeters / 0.0254, 2) : ''}
                    onChange={(e) => handleLengthChange('inches', e.target.value)}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>

                {/* Yards */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Yards (yd)</label>
                  <input
                    type="number"
                    step="any"
                    value={baseMeters ? fmt(baseMeters / 0.9144, 3) : ''}
                    onChange={(e) => handleLengthChange('yards', e.target.value)}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>

                {/* Gaj */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-blue-600 dark:text-blue-400">Gaj (गज)</label>
                  <input
                    type="number"
                    step="any"
                    value={baseMeters ? fmt(baseMeters / 0.9144, 3) : ''}
                    onChange={(e) => handleLengthChange('gaj', e.target.value)}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                  <span className="text-[9px] text-slate-400 block font-mono">1 gaj = 3 ft</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION B: LAND ARITHMETIC (ADD, SUBTRACT, DIVIDE PLOTS) */}
      {/* ========================================================= */}
      {screenMode === 'arithmetic' && (
        <div className="space-y-3">
          {/* Arithmetic Sub-Mode Bar */}
          <div className="grid grid-cols-4 gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setOpMode('add')}
              className={`py-1.5 rounded-lg text-xs font-medium flex flex-col items-center justify-center transition-colors ${
                opMode === 'add'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5 mb-0.5" />
              <span>Add Plots</span>
            </button>

            <button
              onClick={() => setOpMode('sub')}
              className={`py-1.5 rounded-lg text-xs font-medium flex flex-col items-center justify-center transition-colors ${
                opMode === 'sub'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Minus className="w-3.5 h-3.5 mb-0.5" />
              <span>Deduct Land</span>
            </button>

            <button
              onClick={() => setOpMode('split')}
              className={`py-1.5 rounded-lg text-xs font-medium flex flex-col items-center justify-center transition-colors ${
                opMode === 'split'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 mb-0.5" />
              <span>Split (Heirs)</span>
            </button>

            <button
              onClick={() => setOpMode('mul')}
              className={`py-1.5 rounded-lg text-xs font-medium flex flex-col items-center justify-center transition-colors ${
                opMode === 'mul'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <X className="w-3.5 h-3.5 mb-0.5" />
              <span>Multiply</span>
            </button>
          </div>

          {/* MODE 1: ADD MULTIPLE PLOTS */}
          {opMode === 'add' && (
            <div className="space-y-3">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Add Multiple Plots (Sum of Plots)
                  </span>
                  <button
                    onClick={handleAddPlot}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Plot</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {plots.map((plot, idx) => (
                    <div
                      key={plot.id}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Plot {idx + 1}
                          </span>
                          <select
                            value={plot.system}
                            onChange={(e) => handleUpdatePlot(plot.id, 'system', e.target.value)}
                            className="text-[11px] px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                          >
                            <option value="ropani">Ropani System</option>
                            <option value="bigha">Bigha System</option>
                            <option value="sqft">Direct Sq Ft</option>
                          </select>
                        </div>

                        {plots.length > 1 && (
                          <button
                            onClick={() => handleRemovePlot(plot.id)}
                            className="p-1 text-slate-400 hover:text-red-500 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {plot.system === 'ropani' && (
                        <div className="grid grid-cols-4 gap-1.5">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Ropani</span>
                            <input
                              type="number"
                              value={plot.r}
                              onChange={(e) => handleUpdatePlot(plot.id, 'r', e.target.value)}
                              className="w-full px-2 py-1 rounded text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Aana</span>
                            <input
                              type="number"
                              value={plot.a}
                              onChange={(e) => handleUpdatePlot(plot.id, 'a', e.target.value)}
                              className="w-full px-2 py-1 rounded text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Paisa</span>
                            <input
                              type="number"
                              value={plot.p}
                              onChange={(e) => handleUpdatePlot(plot.id, 'p', e.target.value)}
                              className="w-full px-2 py-1 rounded text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Daam</span>
                            <input
                              type="number"
                              value={plot.d}
                              onChange={(e) => handleUpdatePlot(plot.id, 'd', e.target.value)}
                              className="w-full px-2 py-1 rounded text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            />
                          </div>
                        </div>
                      )}

                      {plot.system === 'bigha' && (
                        <div className="grid grid-cols-3 gap-1.5">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Bigha</span>
                            <input
                              type="number"
                              value={plot.b}
                              onChange={(e) => handleUpdatePlot(plot.id, 'b', e.target.value)}
                              className="w-full px-2 py-1 rounded text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Kattha</span>
                            <input
                              type="number"
                              value={plot.k}
                              onChange={(e) => handleUpdatePlot(plot.id, 'k', e.target.value)}
                              className="w-full px-2 py-1 rounded text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Dhur</span>
                            <input
                              type="number"
                              value={plot.dh}
                              onChange={(e) => handleUpdatePlot(plot.id, 'dh', e.target.value)}
                              className="w-full px-2 py-1 rounded text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            />
                          </div>
                        </div>
                      )}

                      {plot.system === 'sqft' && (
                        <div>
                          <span className="text-[10px] text-slate-400 block">Area in Square Feet</span>
                          <input
                            type="number"
                            value={plot.sqftVal}
                            onChange={(e) => handleUpdatePlot(plot.id, 'sqftVal', e.target.value)}
                            className="w-full px-2 py-1 rounded text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Combined Grand Total Output */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Total Combined Area ({plots.length} Plots)
                </span>
                <UnitResultsBadge results={sumAddedResults} />
              </div>
            </div>
          )}

          {/* MODE 2: DEDUCT LAND (ROAD / CANAL / SOLD PORTION) */}
          {opMode === 'sub' && (
            <div className="space-y-3">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-3">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                  Mother Plot Total Area
                </span>

                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => setMotherPlotSystem('ropani')}
                    className={`px-2.5 py-1 rounded ${
                      motherPlotSystem === 'ropani'
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold'
                        : 'border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    Ropani System
                  </button>
                  <button
                    onClick={() => setMotherPlotSystem('bigha')}
                    className={`px-2.5 py-1 rounded ${
                      motherPlotSystem === 'bigha'
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold'
                        : 'border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    Bigha System
                  </button>
                </div>

                {motherPlotSystem === 'ropani' ? (
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Ropani</span>
                      <input
                        type="number"
                        value={motherR}
                        onChange={(e) => setMotherR(e.target.value)}
                        className="w-full px-2 py-1 rounded text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Aana</span>
                      <input
                        type="number"
                        value={motherA}
                        onChange={(e) => setMotherA(e.target.value)}
                        className="w-full px-2 py-1 rounded text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Paisa</span>
                      <input
                        type="number"
                        value={motherP}
                        onChange={(e) => setMotherP(e.target.value)}
                        className="w-full px-2 py-1 rounded text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Daam</span>
                      <input
                        type="number"
                        value={motherD}
                        onChange={(e) => setMotherD(e.target.value)}
                        className="w-full px-2 py-1 rounded text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Bigha</span>
                      <input
                        type="number"
                        value={motherB}
                        onChange={(e) => setMotherB(e.target.value)}
                        className="w-full px-2 py-1 rounded text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Kattha</span>
                      <input
                        type="number"
                        value={motherK}
                        onChange={(e) => setMotherK(e.target.value)}
                        className="w-full px-2 py-1 rounded text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Dhur</span>
                      <input
                        type="number"
                        value={motherDh}
                        onChange={(e) => setMotherDh(e.target.value)}
                        className="w-full px-2 py-1 rounded text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Deduction Input */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-2">
                <span className="text-xs font-semibold text-red-600 block">
                  Deduction Portion (Road / Canal / Sold Out)
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Length ({subUnit})</span>
                    <input
                      type="number"
                      value={subLen}
                      onChange={(e) => setSubLen(e.target.value)}
                      className="w-full px-2 py-1 rounded text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Width ({subUnit})</span>
                    <input
                      type="number"
                      value={subWid}
                      onChange={(e) => setSubWid(e.target.value)}
                      className="w-full px-2 py-1 rounded text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Remaining Net Area Result */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Remaining Net Parcel Area
                </span>
                <UnitResultsBadge results={remainingResults} />
              </div>
            </div>
          )}

          {/* MODE 3: DIVISION AMONG HEIRS */}
          {opMode === 'split' && (
            <div className="space-y-3">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-3">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                  Equal Partition (Division Among Heirs / अंशबण्डा)
                </span>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Number of Heirs / Shares:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setHeirCount(Math.max(2, heirCount - 1))}
                      className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-0.5 font-mono font-bold text-sm bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                      {heirCount}
                    </span>
                    <button
                      onClick={() => setHeirCount(heirCount + 1)}
                      className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Each Heir's Equal Share (1/{heirCount} of Mother Plot)
                </span>
                <UnitResultsBadge results={heirEachResults} />
              </div>
            </div>
          )}

          {/* MODE 4: MULTIPLY STANDARD PLOTS */}
          {opMode === 'mul' && (
            <div className="space-y-3">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-3">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                  Multiply Standard Plots (Town Planning / Plotted Land)
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Single Plot Size (Aana)</span>
                    <input
                      type="number"
                      value={standardPlotAana}
                      onChange={(e) => setStandardPlotAana(e.target.value)}
                      className="w-full px-2 py-1 rounded text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Number of Plots</span>
                    <input
                      type="number"
                      value={mulCount}
                      onChange={(e) => setMulCount(parseInt(e.target.value) || 1)}
                      className="w-full px-2 py-1 rounded text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Total Land Required ({mulCount} Plots of {standardPlotAana} Aana)
                </span>
                <UnitResultsBadge results={multipliedResults} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
