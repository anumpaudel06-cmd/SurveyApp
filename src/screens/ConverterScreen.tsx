import React, { useState } from 'react';
import {
  ropaniToSqFt,
  bighaToSqFt,
  getAllUnitsFromSqFt,
  convertArea,
  convertLength,
  AreaUnit,
  LengthUnit,
} from '../units';
import { Scale, ArrowLeftRight } from 'lucide-react';

export const ConverterScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'nepali' | 'general' | 'length'>('nepali');

  // 1. Nepali Direct Input State
  const [nepaliMode, setNepaliMode] = useState<'ropani' | 'bigha'>('ropani');

  // Ropani System Inputs
  const [ropani, setRopani] = useState<string>('1');
  const [aana, setAana] = useState<string>('4');
  const [paisa, setPaisa] = useState<string>('2');
  const [daam, setDaam] = useState<string>('1');

  // Bigha System Inputs
  const [bigha, setBigha] = useState<string>('0');
  const [kattha, setKattha] = useState<string>('10');
  const [dhur, setDhur] = useState<string>('5');

  // Compute Nepali Output
  let nepaliSqFt = 0;
  if (nepaliMode === 'ropani') {
    nepaliSqFt = ropaniToSqFt(
      parseFloat(ropani) || 0,
      parseFloat(aana) || 0,
      parseFloat(paisa) || 0,
      parseFloat(daam) || 0
    );
  } else {
    nepaliSqFt = bighaToSqFt(
      parseFloat(bigha) || 0,
      parseFloat(kattha) || 0,
      parseFloat(dhur) || 0
    );
  }
  const nepaliResults = getAllUnitsFromSqFt(nepaliSqFt);

  // 2. General Area Converter
  const [genVal, setGenVal] = useState<string>('1');
  const [genFrom, setGenFrom] = useState<AreaUnit>('ropani');
  const [genTo, setGenTo] = useState<AreaUnit>('sqft');
  const genResult = convertArea(parseFloat(genVal) || 0, genFrom, genTo);

  // 3. Length Converter
  const [lenVal, setLenVal] = useState<string>('100');
  const [lenFrom, setLenFrom] = useState<LengthUnit>('feet');
  const [lenTo, setLenTo] = useState<LengthUnit>('meters');
  const lenResult = convertLength(parseFloat(lenVal) || 0, lenFrom, lenTo);

  const areaUnitLabels: Record<AreaUnit, string> = {
    sqft: 'Square Feet (वर्ग फिट)',
    sqm: 'Square Meter (वर्ग मिटर)',
    ropani: 'Ropani (रोपनी)',
    aana: 'Aana (आना)',
    paisa: 'Paisa (पैसा)',
    daam: 'Daam (दाम)',
    bigha: 'Bigha (बिघा)',
    kattha: 'Kattha (कट्ठा)',
    dhur: 'Dhur (धुर)',
    acre: 'Acre (एकड)',
    hectare: 'Hectare (हेक्टर)',
  };

  const lengthLabels: Record<LengthUnit, string> = {
    feet: 'Feet (फिट)',
    meters: 'Meter (मिटर)',
    hath: 'Hath (हात = १.५ फिट)',
    gaj: 'Gaj (गज = ३ फिट)',
    yards: 'Yards (यार्ड = ३ फिट)',
    inches: 'Inches (इन्च)',
    chains: 'Chain (चेन = ६६ फिट)',
    links: 'Link (लिंक = ०.६६ फिट)',
  };

  return (
    <div className="space-y-3.5 pb-6 max-w-xl mx-auto">
      {/* Tab Switcher */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-zinc-300" />
          <h2 className="text-xs font-semibold text-zinc-100">एकाइ रूपान्तरण (Converter)</h2>
        </div>

        <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveTab('nepali')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeTab === 'nepali' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            नेपाली एकाइ
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeTab === 'general' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            क्षेत्रफल (Area)
          </button>
          <button
            onClick={() => setActiveTab('length')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeTab === 'length' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            लम्बाई (Length)
          </button>
        </div>
      </div>

      {/* 1. DIRECT NEPALI CONVERTER (Like akk.lc) */}
      {activeTab === 'nepali' && (
        <div className="space-y-3">
          {/* Mode switch */}
          <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => setNepaliMode('ropani')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
                nepaliMode === 'ropani'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              रोपनी-आना-पैसा-दाम बाट
            </button>
            <button
              onClick={() => setNepaliMode('bigha')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
                nepaliMode === 'bigha'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              बिघा-कट्ठा-धुर बाट
            </button>
          </div>

          {/* Direct Inputs */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm space-y-2">
            <div className="text-xs font-medium text-zinc-200 mb-2">
              {nepaliMode === 'ropani'
                ? 'रोपनी, आना, पैसा र दाम प्रविष्ट गर्नुहोस्:'
                : 'बिघा, कट्ठा र धुर प्रविष्ट गर्नुहोस्:'}
            </div>

            {nepaliMode === 'ropani' ? (
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">रोपनी (Ropani)</label>
                  <input
                    type="number"
                    value={ropani}
                    onChange={(e) => setRopani(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-sm font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">आना (Aana)</label>
                  <input
                    type="number"
                    value={aana}
                    onChange={(e) => setAana(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-sm font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">पैसा (Paisa)</label>
                  <input
                    type="number"
                    value={paisa}
                    onChange={(e) => setPaisa(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-sm font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">दाम (Daam)</label>
                  <input
                    type="number"
                    value={daam}
                    onChange={(e) => setDaam(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-sm font-bold text-center"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">बिघा (Bigha)</label>
                  <input
                    type="number"
                    value={bigha}
                    onChange={(e) => setBigha(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-sm font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">कट्ठा (Kattha)</label>
                  <input
                    type="number"
                    value={kattha}
                    onChange={(e) => setKattha(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-sm font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">धुर (Dhur)</label>
                  <input
                    type="number"
                    value={dhur}
                    onChange={(e) => setDhur(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-sm font-bold text-center"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Instant Result Cards */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm space-y-3">
            <div className="text-xs font-semibold text-zinc-200 border-b border-zinc-800 pb-2">
              रूपान्तरण नतिजा (Conversion Output):
            </div>

            {/* If Ropani mode, highlight Bigha output; if Bigha mode, highlight Ropani output */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block">पहाडी एकाइ (R-A-P-D)</span>
                <span className="text-base font-bold font-mono text-zinc-100 block mt-1">
                  {nepaliResults.ropani.formatted}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {nepaliResults.ropani.ropani} रो. {nepaliResults.ropani.aana} आ. {nepaliResults.ropani.paisa} पै. {nepaliResults.ropani.daam} दा.
                </span>
              </div>

              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block">तराई एकाइ (B-K-D)</span>
                <span className="text-base font-bold font-mono text-zinc-100 block mt-1">
                  {nepaliResults.bigha.formatted}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {nepaliResults.bigha.bigha} बि. {nepaliResults.bigha.kattha} क. {nepaliResults.bigha.dhur} धु.
                </span>
              </div>
            </div>

            {/* Standard units */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-500 block">वर्ग फिट</span>
                <span className="font-mono font-bold text-zinc-200 mt-0.5 block">
                  {nepaliResults.sqFt.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-500 block">वर्ग मिटर</span>
                <span className="font-mono font-bold text-zinc-200 mt-0.5 block">
                  {nepaliResults.sqM.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-500 block">कुल आना</span>
                <span className="font-mono font-bold text-zinc-200 mt-0.5 block">
                  {(nepaliResults.sqFt / 342.25).toFixed(3)}
                </span>
              </div>

              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-500 block">कुल कट्ठा</span>
                <span className="font-mono font-bold text-zinc-200 mt-0.5 block">
                  {(nepaliResults.sqFt / 3645).toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. GENERAL AREA CONVERTER */}
      {activeTab === 'general' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">कुन एकाइबाट (Convert From)</label>
              <select
                value={genFrom}
                onChange={(e) => setGenFrom(e.target.value as AreaUnit)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-100"
              >
                {Object.entries(areaUnitLabels).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={genVal}
                onChange={(e) => setGenVal(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-base font-bold"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-zinc-400">कुन एकाइमा (Convert To)</label>
                <button
                  onClick={() => {
                    const temp = genFrom;
                    setGenFrom(genTo);
                    setGenTo(temp);
                  }}
                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400"
                  title="Swap"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <select
                value={genTo}
                onChange={(e) => setGenTo(e.target.value as AreaUnit)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-100"
              >
                {Object.entries(areaUnitLabels).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>

              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 flex items-center justify-between">
                <span className="text-base font-mono font-bold text-zinc-100">
                  {genResult.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                </span>
                <span className="text-xs text-zinc-500 uppercase">{genTo}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. LENGTH CONVERTER */}
      {activeTab === 'length' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">कुन एकाइबाट (From)</label>
              <select
                value={lenFrom}
                onChange={(e) => setLenFrom(e.target.value as LengthUnit)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-100"
              >
                {Object.entries(lengthLabels).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={lenVal}
                onChange={(e) => setLenVal(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-base font-bold"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-zinc-400">कुन एकाइमा (To)</label>
                <button
                  onClick={() => {
                    const temp = lenFrom;
                    setLenFrom(lenTo);
                    setLenTo(temp);
                  }}
                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400"
                  title="Swap"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <select
                value={lenTo}
                onChange={(e) => setLenTo(e.target.value as LengthUnit)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-100"
              >
                {Object.entries(lengthLabels).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>

              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 flex items-center justify-between">
                <span className="text-base font-mono font-bold text-zinc-100">
                  {lenResult.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                </span>
                <span className="text-xs text-zinc-500 uppercase">{lenTo}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
