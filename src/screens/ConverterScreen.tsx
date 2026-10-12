import React, { useState } from 'react';
import {
  AreaUnit,
  LengthUnit,
  convertArea,
  convertLength,
  getAllUnitsFromSqFt,
} from '../units';
import { UnitResultsBadge } from '../components/UnitResultsBadge';
import { NepaliUnitsBreakdown } from '../components/NepaliUnitsBreakdown';
import { ArrowLeftRight, Scale } from 'lucide-react';

export const ConverterScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'area' | 'length'>('area');

  const [areaValue, setAreaValue] = useState<string>('1');
  const [areaFrom, setAreaFrom] = useState<AreaUnit>('ropani');
  const [areaTo, setAreaTo] = useState<AreaUnit>('sqft');

  const [lengthValue, setLengthValue] = useState<string>('100');
  const [lengthFrom, setLengthFrom] = useState<LengthUnit>('feet');
  const [lengthTo, setLengthTo] = useState<LengthUnit>('meters');

  const numAreaVal = parseFloat(areaValue) || 0;
  const convertedAreaResult = convertArea(numAreaVal, areaFrom, areaTo);
  const totalSqFt = convertArea(numAreaVal, areaFrom, 'sqft');
  const multiUnitBreakdown = getAllUnitsFromSqFt(totalSqFt);

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
    chains: 'Chains (66 ft)',
    links: 'Links (0.66 ft)',
  };

  return (
    <div className="space-y-4 pb-6 max-w-2xl mx-auto">
      {/* Top Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-zinc-300" />
          <h2 className="text-sm font-semibold text-zinc-100">Unit Converter</h2>
        </div>

        <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveTab('area')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === 'area' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Area
          </button>
          <button
            onClick={() => setActiveTab('length')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === 'length' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Length
          </button>
        </div>
      </div>

      {activeTab === 'area' ? (
        <div className="space-y-3">
          {/* Quick Presets */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              onClick={() => { setAreaFrom('ropani'); setAreaValue('1'); }}
              className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg transition-colors"
            >
              1 Ropani
            </button>
            <button
              onClick={() => { setAreaFrom('bigha'); setAreaValue('1'); }}
              className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg transition-colors"
            >
              1 Bigha
            </button>
            <button
              onClick={() => { setAreaFrom('aana'); setAreaValue('1'); }}
              className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg transition-colors"
            >
              1 Aana
            </button>
            <button
              onClick={() => { setAreaFrom('kattha'); setAreaValue('1'); }}
              className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg transition-colors"
            >
              1 Kattha
            </button>
            <button
              onClick={() => { setAreaFrom('acre'); setAreaValue('1'); }}
              className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg transition-colors"
            >
              1 Acre
            </button>
          </div>

          {/* Converter Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* FROM */}
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">From</label>
                <select
                  value={areaFrom}
                  onChange={(e) => setAreaFrom(e.target.value as AreaUnit)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100"
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
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-base font-mono font-bold text-zinc-100"
                />
              </div>

              {/* TO */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-zinc-400">To</label>
                  <button
                    onClick={swapAreaUnits}
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <select
                  value={areaTo}
                  onChange={(e) => setAreaTo(e.target.value as AreaUnit)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100"
                >
                  {Object.entries(areaUnitLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>

                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 flex items-center justify-between">
                  <span className="text-base font-mono font-bold text-zinc-100">
                    {convertedAreaResult.toLocaleString('en-US', {
                      maximumFractionDigits: 4,
                    })}
                  </span>
                  <span className="text-xs text-zinc-500 uppercase">{areaTo}</span>
                </div>
              </div>
            </div>
          </div>

          <UnitResultsBadge results={multiUnitBreakdown} title="Multi-Unit Conversion Breakdown" />
          <NepaliUnitsBreakdown results={multiUnitBreakdown} />
        </div>
      ) : (
        /* Length Tab */
        <div className="space-y-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">From</label>
                <select
                  value={lengthFrom}
                  onChange={(e) => setLengthFrom(e.target.value as LengthUnit)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100"
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
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-base font-mono font-bold text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-zinc-400">To</label>
                  <button
                    onClick={swapLengthUnits}
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <select
                  value={lengthTo}
                  onChange={(e) => setLengthTo(e.target.value as LengthUnit)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100"
                >
                  {Object.entries(lengthUnitLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>

                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 flex items-center justify-between">
                  <span className="text-base font-mono font-bold text-zinc-100">
                    {convertedLengthResult.toLocaleString('en-US', {
                      maximumFractionDigits: 4,
                    })}
                  </span>
                  <span className="text-xs text-zinc-500 uppercase">{lengthTo}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs text-zinc-400 block mb-2 font-medium">Equivalents:</span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                {(['feet', 'meters', 'inches', 'yards', 'chains', 'links'] as LengthUnit[]).map((unit) => (
                  <div key={unit} className="bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                    <div className="text-[10px] text-zinc-500 capitalize">{unit}</div>
                    <div className="font-mono text-zinc-200 mt-0.5 truncate">
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
