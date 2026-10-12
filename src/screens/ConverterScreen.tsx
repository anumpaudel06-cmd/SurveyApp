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
} from '../units';
import {
  RotateCcw,
  Calculator,
  Scale,
  Ruler,
  Copy,
  Check,
} from 'lucide-react';

export const ConverterScreen: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'area' | 'length'>('area');
  const [copied, setCopied] = useState<boolean>(false);

  // BASE VALUE IN SQUARE FEET
  const [baseSqFt, setBaseSqFt] = useState<number>(5476); // Default 1 Ropani

  // AREA INPUT FIELDS:
  // Typing in any one field updates baseSqFt, and all other fields instantly reflect the converted value!
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
        setBaseSqFt(val / 0.092903);
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
      case 'acre':
        setBaseSqFt(val * ACRE_TO_SQFT);
        break;
      case 'hectare':
        setBaseSqFt(val * HECTARE_TO_SQFT);
        break;
      case 'sqyd':
        setBaseSqFt(val * SQYD_TO_SQFT);
        break;
      case 'sqmi':
        setBaseSqFt(val * SQMI_TO_SQFT);
        break;
      case 'sqkm':
        setBaseSqFt(val * SQKM_TO_SQFT);
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

  // BASE VALUE IN METERS FOR LENGTH CONVERTER
  const [baseMeters, setBaseMeters] = useState<number>(100);

  const handleLengthChange = (unit: LengthUnit, valStr: string) => {
    const val = parseFloat(valStr);
    if (isNaN(val)) {
      setBaseMeters(0);
      return;
    }
    const inMeters = val * LENGTH_TO_METERS[unit];
    setBaseMeters(inMeters);
  };

  const handleClearLength = () => {
    setBaseMeters(0);
  };

  // Formatting helper
  const fmt = (num: number, maxDec = 4): string => {
    if (num === 0) return '0';
    if (num < 0.00001 && num > 0) return num.toExponential(3);
    const fixed = num.toFixed(maxDec);
    // remove trailing zeros if not needed
    return parseFloat(fixed).toString();
  };

  const handleCopyArea = () => {
    const text = `Area Conversion Table:
• Square Feet: ${fmt(baseSqFt, 2)}
• Square Meter: ${fmt(baseSqFt * 0.092903, 3)}
• Bigha: ${fmt(baseSqFt / BIGHA_SQFT, 5)}
• Kattha: ${fmt(baseSqFt / KATTHA_SQFT, 4)}
• Dhur: ${fmt(baseSqFt / DHUR_SQFT, 4)}
• Ropani: ${fmt(baseSqFt / ROPANI_SQFT, 5)}
• Aana: ${fmt(baseSqFt / AANA_SQFT, 4)}
• Paisa: ${fmt(baseSqFt / PAISA_SQFT, 4)}
• Daam: ${fmt(baseSqFt / DAAM_SQFT, 3)}
• Khetmuri: ${fmt(baseSqFt / KHETMURI_SQFT, 5)}
• Acre: ${fmt(baseSqFt / ACRE_TO_SQFT, 5)}
• Hectare: ${fmt(baseSqFt / HECTARE_TO_SQFT, 5)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 pb-8 max-w-xl mx-auto">
      {/* Category Tabs: Area vs Length */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-xs grid grid-cols-2 gap-1 text-xs font-medium">
        <button
          onClick={() => setActiveCategory('area')}
          className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeCategory === 'area'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Area Converter</span>
        </button>

        <button
          onClick={() => setActiveCategory('length')}
          className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeCategory === 'length'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>Length Converter</span>
        </button>
      </div>

      {/* 1. AREA CONVERTER SCREEN */}
      {activeCategory === 'area' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs space-y-3">
          {/* Top Button Bar: Clear & Calculate All / Presets */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Bidirectional Area Converter
              </span>
              <p className="text-[10px] text-slate-500">
                Type in any field to instantly calculate & fill all others
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleClearArea}
                className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
                title="Clear all fields"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>

              <button
                onClick={handleCopyArea}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-medium flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Calculate All</span>
              </button>
            </div>
          </div>

          {/* Preset Buttons Strip */}
          <div className="flex items-center gap-1.5 flex-wrap text-[11px] pb-1">
            <span className="text-slate-500 font-medium">Quick Fill:</span>
            <button
              onClick={() => handlePreset(ROPANI_SQFT)}
              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono"
            >
              1 Ropani
            </button>
            <button
              onClick={() => handlePreset(AANA_SQFT)}
              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono"
            >
              1 Aana
            </button>
            <button
              onClick={() => handlePreset(BIGHA_SQFT)}
              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono"
            >
              1 Bigha
            </button>
            <button
              onClick={() => handlePreset(KATTHA_SQFT)}
              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono"
            >
              1 Kattha
            </button>
            <button
              onClick={() => handlePreset(1000)}
              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono"
            >
              1000 sq ft
            </button>
          </div>

          {/* SCROLLABLE LIST OF LABELED INPUT FIELDS */}
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {/* 1. Square Feet */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-36">
                Square Feet (sq ft)
              </label>
              <input
                type="number"
                step="any"
                value={fmt(baseSqFt, 2)}
                onChange={(e) => handleAreaChange('sqft', e.target.value)}
                className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-slate-800 dark:focus:border-slate-200"
              />
            </div>

            {/* 2. Square Meter */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-36">
                Square Meter (m²)
              </label>
              <input
                type="number"
                step="any"
                value={fmt(baseSqFt * 0.092903, 3)}
                onChange={(e) => handleAreaChange('sqm', e.target.value)}
                className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-slate-800 dark:focus:border-slate-200"
              />
            </div>

            {/* 3. Bigha */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-36">
                Bigha (72,900 sq ft)
              </label>
              <input
                type="number"
                step="any"
                value={fmt(baseSqFt / BIGHA_SQFT, 5)}
                onChange={(e) => handleAreaChange('bigha', e.target.value)}
                className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-slate-800 dark:focus:border-slate-200"
              />
            </div>

            {/* 4. Kattha */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-36">
                Kattha (3,645 sq ft)
              </label>
              <input
                type="number"
                step="any"
                value={fmt(baseSqFt / KATTHA_SQFT, 4)}
                onChange={(e) => handleAreaChange('kattha', e.target.value)}
                className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-slate-800 dark:focus:border-slate-200"
              />
            </div>

            {/* 5. Dhur */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-36">
                Dhur (182.25 sq ft)
              </label>
              <input
                type="number"
                step="any"
                value={fmt(baseSqFt / DHUR_SQFT, 4)}
                onChange={(e) => handleAreaChange('dhur', e.target.value)}
                className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-slate-800 dark:focus:border-slate-200"
              />
            </div>

            {/* 6. Ropani */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-36">
                Ropani (5,476 sq ft)
              </label>
              <input
                type="number"
                step="any"
                value={fmt(baseSqFt / ROPANI_SQFT, 5)}
                onChange={(e) => handleAreaChange('ropani', e.target.value)}
                className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-slate-800 dark:focus:border-slate-200"
              />
            </div>

            {/* 7. Aana */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-36">
                Aana (342.25 sq ft)
              </label>
              <input
                type="number"
                step="any"
                value={fmt(baseSqFt / AANA_SQFT, 4)}
                onChange={(e) => handleAreaChange('aana', e.target.value)}
                className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-slate-800 dark:focus:border-slate-200"
              />
            </div>

            {/* 8. Paisa */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-36">
                Paisa (85.56 sq ft)
              </label>
              <input
                type="number"
                step="any"
                value={fmt(baseSqFt / PAISA_SQFT, 4)}
                onChange={(e) => handleAreaChange('paisa', e.target.value)}
                className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-slate-800 dark:focus:border-slate-200"
              />
            </div>

            {/* 9. Daam */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-36">
                Daam (21.39 sq ft)
              </label>
              <input
                type="number"
                step="any"
                value={fmt(baseSqFt / DAAM_SQFT, 3)}
                onChange={(e) => handleAreaChange('daam', e.target.value)}
                className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-slate-800 dark:focus:border-slate-200"
              />
            </div>

            {/* 10. Khetmuri */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-36">
                Khetmuri (25 Ropani)
              </label>
              <input
                type="number"
                step="any"
                value={fmt(baseSqFt / KHETMURI_SQFT, 5)}
                onChange={(e) => handleAreaChange('khetmuri', e.target.value)}
                className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-slate-800 dark:focus:border-slate-200"
              />
            </div>

            {/* 11. Acres */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-36">
                Acre (43,560 sq ft)
              </label>
              <input
                type="number"
                step="any"
                value={fmt(baseSqFt / ACRE_TO_SQFT, 5)}
                onChange={(e) => handleAreaChange('acre', e.target.value)}
                className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-slate-800 dark:focus:border-slate-200"
              />
            </div>

            {/* 12. Hectares */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-36">
                Hectare (107,639 sq ft)
              </label>
              <input
                type="number"
                step="any"
                value={fmt(baseSqFt / HECTARE_TO_SQFT, 5)}
                onChange={(e) => handleAreaChange('hectare', e.target.value)}
                className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-slate-800 dark:focus:border-slate-200"
              />
            </div>

            {/* 13. Square Yards */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-36">
                Square Yards (sq yd)
              </label>
              <input
                type="number"
                step="any"
                value={fmt(baseSqFt / SQYD_TO_SQFT, 3)}
                onChange={(e) => handleAreaChange('sqyd', e.target.value)}
                className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-slate-800 dark:focus:border-slate-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. LENGTH CONVERTER SCREEN */}
      {activeCategory === 'length' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Bidirectional Length Converter
              </span>
              <p className="text-[10px] text-slate-500">
                Type in any field to instantly calculate & fill all others
              </p>
            </div>
            <button
              onClick={handleClearLength}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {/* Feet */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-36">
                Feet (ft)
              </label>
              <input
                type="number"
                step="any"
                value={fmt(baseMeters / 0.3048, 3)}
                onChange={(e) => handleLengthChange('feet', e.target.value)}
                className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100 outline-none"
              />
            </div>

            {/* Meters */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-36">
                Meters (m)
              </label>
              <input
                type="number"
                step="any"
                value={fmt(baseMeters, 3)}
                onChange={(e) => handleLengthChange('meters', e.target.value)}
                className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100 outline-none"
              />
            </div>

            {/* Inches */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-36">
                Inches (in)
              </label>
              <input
                type="number"
                step="any"
                value={fmt(baseMeters / 0.0254, 2)}
                onChange={(e) => handleLengthChange('inches', e.target.value)}
                className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100 outline-none"
              />
            </div>

            {/* Yards */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-36">
                Yards (yd)
              </label>
              <input
                type="number"
                step="any"
                value={fmt(baseMeters / 0.9144, 3)}
                onChange={(e) => handleLengthChange('yards', e.target.value)}
                className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100 outline-none"
              />
            </div>

            {/* Hath */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-36">
                Hath / Hand (1.5 ft)
              </label>
              <input
                type="number"
                step="any"
                value={fmt(baseMeters / 0.4572, 3)}
                onChange={(e) => handleLengthChange('hath', e.target.value)}
                className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100 outline-none"
              />
            </div>

            {/* Gaj */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-36">
                Gaj (3 ft)
              </label>
              <input
                type="number"
                step="any"
                value={fmt(baseMeters / 0.9144, 3)}
                onChange={(e) => handleLengthChange('gaj', e.target.value)}
                className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100 outline-none"
              />
            </div>

            {/* Chains */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-36">
                Chain / Jarib (66 ft)
              </label>
              <input
                type="number"
                step="any"
                value={fmt(baseMeters / 20.1168, 4)}
                onChange={(e) => handleLengthChange('chains', e.target.value)}
                className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100 outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
