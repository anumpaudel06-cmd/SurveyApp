import React, { useState } from 'react';
import {
  AreaUnit,
  LengthUnit,
  convertArea,
  convertLength,
  getAllUnitsFromSqFt,
  ROPANI_SQFT,
  BIGHA_SQFT,
  AANA_SQFT,
  KATTHA_SQFT,
  ACRE_TO_SQFT,
  HECTARE_TO_SQFT,
} from '../units';
import { UnitResultsBadge } from '../components/UnitResultsBadge';
import { NepaliUnitsBreakdown } from '../components/NepaliUnitsBreakdown';
import { ArrowLeftRight, Ruler, Scale, Zap, Info } from 'lucide-react';

export const ConverterScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'area' | 'length'>('area');

  // Area converter state
  const [areaValue, setAreaValue] = useState<string>('1');
  const [areaFrom, setAreaFrom] = useState<AreaUnit>('ropani');
  const [areaTo, setAreaTo] = useState<AreaUnit>('sqft');

  // Length converter state
  const [lengthValue, setLengthValue] = useState<string>('100');
  const [lengthFrom, setLengthFrom] = useState<LengthUnit>('feet');
  const [lengthTo, setLengthTo] = useState<LengthUnit>('meters');

  // Area calculations
  const numAreaVal = parseFloat(areaValue) || 0;
  const convertedAreaResult = convertArea(numAreaVal, areaFrom, areaTo);
  const totalSqFt = convertArea(numAreaVal, areaFrom, 'sqft');
  const multiUnitBreakdown = getAllUnitsFromSqFt(totalSqFt);

  // Length calculations
  const numLengthVal = parseFloat(lengthValue) || 0;
  const convertedLengthResult = convertLength(numLengthVal, lengthFrom, lengthTo);

  const swapAreaUnits = () => {
    setAreaFrom(areaTo);
    setAreaTo(areaFrom);
  };

  const swapLengthUnits = () => {
    setLengthFrom(lengthTo);
    setLengthTo(lengthFrom);
  };

  const setAreaPreset = (from: AreaUnit, val = '1') => {
    setAreaFrom(from);
    setAreaValue(val);
  };

  const areaUnitLabels: Record<AreaUnit, string> = {
    sqft: 'Square Feet (sq ft)',
    sqm: 'Square Meters (m²)',
    acre: 'Acres (ac)',
    hectare: 'Hectares (ha)',
    ropani: 'Ropani (रोपनी)',
    aana: 'Aana (आना)',
    paisa: 'Paisa (पैसा)',
    daam: 'Daam (दाम)',
    bigha: 'Bigha (बिघा)',
    kattha: 'Kattha (कट्ठा)',
    dhur: 'Dhur (धुर)',
  };

  const lengthUnitLabels: Record<LengthUnit, string> = {
    feet: 'Feet (ft)',
    meters: 'Meters (m)',
    inches: 'Inches (in)',
    yards: 'Yards (yd)',
    chains: 'Chains (Gunter\'s chain = 66 ft)',
    links: 'Links (1 link = 0.66 ft)',
  };

  return (
    <div className="space-y-5 pb-8 max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
            Precision Converter
          </span>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" /> Land & Length Units
          </h2>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('area')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'area'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Area Units
          </button>
          <button
            onClick={() => setActiveTab('length')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'length'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Length Units
          </button>
        </div>
      </div>

      {activeTab === 'area' ? (
        <div className="space-y-5">
          {/* Quick Presets Strip */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setAreaPreset('ropani', '1')}
              className="bg-amber-950/40 border border-amber-800/40 hover:bg-amber-900/60 text-amber-300 text-xs px-2.5 py-1 rounded-lg font-medium transition-colors"
            >
              1 Ropani (5,476 sq ft)
            </button>
            <button
              onClick={() => setAreaPreset('bigha', '1')}
              className="bg-orange-950/40 border border-orange-800/40 hover:bg-orange-900/60 text-orange-300 text-xs px-2.5 py-1 rounded-lg font-medium transition-colors"
            >
              1 Bigha (72,900 sq ft)
            </button>
            <button
              onClick={() => setAreaPreset('aana', '1')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-lg font-medium"
            >
              1 Aana (342.25 sq ft)
            </button>
            <button
              onClick={() => setAreaPreset('kattha', '1')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-lg font-medium"
            >
              1 Kattha (3,645 sq ft)
            </button>
            <button
              onClick={() => setAreaPreset('acre', '1')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-lg font-medium"
            >
              1 Acre (43,560 sq ft)
            </button>
          </div>

          {/* Converter Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* FROM */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">Convert From</label>
                <select
                  value={areaFrom}
                  onChange={(e) => setAreaFrom(e.target.value as AreaUnit)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 font-medium"
                >
                  {Object.entries(areaUnitLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={areaValue}
                  onChange={(e) => setAreaValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-lg font-mono font-bold text-white focus:border-amber-500"
                  placeholder="Enter value"
                />
              </div>

              {/* TO */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-400">Convert To</label>
                  <button
                    onClick={swapAreaUnits}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Swap units"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <select
                  value={areaTo}
                  onChange={(e) => setAreaTo(e.target.value as AreaUnit)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 font-medium"
                >
                  {Object.entries(areaUnitLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>

                <div className="bg-slate-950 border border-amber-500/40 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-xl font-mono font-extrabold text-amber-300">
                    {convertedAreaResult.toLocaleString('en-US', {
                      maximumFractionDigits: 4,
                    })}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{areaTo.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Quick Math Note */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {numAreaVal} {areaFrom} = {totalSqFt.toLocaleString('en-US', { maximumFractionDigits: 2 })} sq ft
              </span>
            </div>
          </div>

          {/* Full multi-unit breakdown of current value */}
          <UnitResultsBadge results={multiUnitBreakdown} title="Global Unit Distribution" />

          {/* Nepali Subunits Breakdown */}
          <NepaliUnitsBreakdown results={multiUnitBreakdown} />
        </div>
      ) : (
        /* Length Converter Tab */
        <div className="space-y-5">
          {/* Quick presets for length */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => {
                setLengthFrom('chains');
                setLengthTo('feet');
                setLengthValue('1');
              }}
              className="bg-sky-950/40 border border-sky-800/40 text-sky-300 text-xs px-2.5 py-1 rounded-lg font-medium"
            >
              1 Gunter's Chain = 66 ft (100 links)
            </button>
            <button
              onClick={() => {
                setLengthFrom('meters');
                setLengthTo('feet');
                setLengthValue('1');
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-lg font-medium"
            >
              1 Meter = 3.28084 ft
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* FROM */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">Convert From</label>
                <select
                  value={lengthFrom}
                  onChange={(e) => setLengthFrom(e.target.value as LengthUnit)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 font-medium"
                >
                  {Object.entries(lengthUnitLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={lengthValue}
                  onChange={(e) => setLengthValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-lg font-mono font-bold text-white focus:border-amber-500"
                  placeholder="Enter length"
                />
              </div>

              {/* TO */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-400">Convert To</label>
                  <button
                    onClick={swapLengthUnits}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <select
                  value={lengthTo}
                  onChange={(e) => setLengthTo(e.target.value as LengthUnit)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 font-medium"
                >
                  {Object.entries(lengthUnitLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>

                <div className="bg-slate-950 border border-sky-500/40 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-xl font-mono font-extrabold text-sky-300">
                    {convertedLengthResult.toLocaleString('en-US', {
                      maximumFractionDigits: 4,
                    })}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{lengthTo.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Length Equivalent Table */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Equivalent Lengths Across Units:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                {(['feet', 'meters', 'inches', 'yards', 'chains', 'links'] as LengthUnit[]).map((unit) => (
                  <div key={unit} className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 capitalize">{unit}</div>
                    <div className="font-mono font-bold text-white mt-0.5 truncate">
                      {convertLength(numLengthVal, lengthFrom, unit).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
