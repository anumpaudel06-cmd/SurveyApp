import React, { useState } from 'react';
import {
  ropaniToSqFt,
  bighaToSqFt,
  getAllUnitsFromSqFt,
  convertArea,
  convertLength,
  AreaUnit,
  LengthUnit,
  ROPANI_SQFT,
  BIGHA_SQFT,
  AANA_SQFT,
  PAISA_SQFT,
  DAAM_SQFT,
  KATTHA_SQFT,
  DHUR_SQFT,
  ACRE_TO_SQFT,
  HECTARE_TO_SQFT,
} from '../units';
import {
  Scale,
  Ruler,
  RotateCcw,
  Copy,
  Check,
  BookOpen,
} from 'lucide-react';

export const ConverterScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'nepali' | 'general' | 'length' | 'table'>('nepali');
  const [nepaliMode, setNepaliMode] = useState<'ropani' | 'bigha'>('ropani');

  // 1. Ropani System Inputs
  const [ropani, setRopani] = useState<string>('1');
  const [aana, setAana] = useState<string>('4');
  const [paisa, setPaisa] = useState<string>('2');
  const [daam, setDaam] = useState<string>('1');

  // 2. Bigha System Inputs
  const [bigha, setBigha] = useState<string>('0');
  const [kattha, setKattha] = useState<string>('10');
  const [dhur, setDhur] = useState<string>('5');

  // Calculate current Nepali square feet
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

  // 3. General Area Converter
  const [genVal, setGenVal] = useState<string>('1');
  const [genFrom, setGenFrom] = useState<AreaUnit>('ropani');
  const [genTo, setGenTo] = useState<AreaUnit>('sqft');
  const genResult = convertArea(parseFloat(genVal) || 0, genFrom, genTo);

  // 4. Length Converter
  const [lenVal, setLenVal] = useState<string>('100');
  const [lenFrom, setLenFrom] = useState<LengthUnit>('feet');
  const [lenTo, setLenTo] = useState<LengthUnit>('meters');
  const lenResult = convertLength(parseFloat(lenVal) || 0, lenFrom, lenTo);

  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyResults = () => {
    const text = `Land Survey Pro Conversion (नापी रूपान्तरण नतिजा):
• Ropani (रोपनी-आना-पैसा-दाम): ${nepaliResults.ropani.formatted}
• Bigha (बिघा-कट्ठा-धुर): ${nepaliResults.bigha.formatted}
• Square Feet (वर्ग फिट): ${nepaliResults.sqFt.toLocaleString('en-US', { maximumFractionDigits: 2 })}
• Square Meters (वर्ग मिटर): ${nepaliResults.sqM.toLocaleString('en-US', { maximumFractionDigits: 2 })}
• Acres (एकर): ${nepaliResults.acres.toFixed(4)}
• Hectares (हेक्टर): ${nepaliResults.hectares.toFixed(4)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const areaUnitNames: Record<AreaUnit, string> = {
    sqft: 'Square Feet (वर्ग फिट)',
    sqm: 'Square Meter (वर्ग मिटर)',
    ropani: 'Ropani (रोपनी)',
    aana: 'Aana (आना)',
    paisa: 'Paisa (पैसा)',
    daam: 'Daam (दाम)',
    bigha: 'Bigha (बिघा)',
    kattha: 'Kattha (कट्ठा)',
    dhur: 'Dhur (धुर)',
    acre: 'Acres (एकर)',
    hectare: 'Hectares (हेक्टर)',
  };

  const lengthUnitNames: Record<LengthUnit, string> = {
    feet: 'Feet (फिट)',
    meters: 'Meter (मिटर)',
    inches: 'Inch (इन्च)',
    yards: 'Yard (गज)',
    hath: 'Hath / Hand (हात)',
    gaj: 'Gaj (गज)',
    chains: 'Chain / Jarib (कडी/जरिब)',
    links: 'Link (कडी)',
  };

  return (
    <div className="space-y-3 pb-8 max-w-xl mx-auto">
      {/* Tab Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-1.5 shadow-xs grid grid-cols-4 gap-1 text-xs font-medium">
        <button
          onClick={() => setActiveTab('nepali')}
          className={`py-2 px-1 rounded-lg text-center transition-colors ${
            activeTab === 'nepali'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          Nepali (नेपाली)
        </button>

        <button
          onClick={() => setActiveTab('general')}
          className={`py-2 px-1 rounded-lg text-center transition-colors ${
            activeTab === 'general'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          Area (क्षेत्रफल)
        </button>

        <button
          onClick={() => setActiveTab('length')}
          className={`py-2 px-1 rounded-lg text-center transition-colors ${
            activeTab === 'length'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          Length (लम्बाइ)
        </button>

        <button
          onClick={() => setActiveTab('table')}
          className={`py-2 px-1 rounded-lg text-center transition-colors ${
            activeTab === 'table'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          Standards (दररेट)
        </button>
      </div>

      {/* TAB 1: NEPALI SYSTEMS (ROPANI & BIGHA) */}
      {activeTab === 'nepali' && (
        <div className="space-y-3">
          {/* System Toggle */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-800">
                Land System (जग्गा मापन प्रणाली छान्नुहोस्)
              </span>
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
                <button
                  onClick={() => setNepaliMode('ropani')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    nepaliMode === 'ropani'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Ropani (रोपनी)
                </button>
                <button
                  onClick={() => setNepaliMode('bigha')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    nepaliMode === 'bigha'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Bigha (बिघा)
                </button>
              </div>
            </div>

            {/* Ropani Inputs */}
            {nepaliMode === 'ropani' ? (
              <div className="pt-3 space-y-3">
                <div className="text-[11px] text-slate-500">
                  Enter Ropani, Aana, Paisa, Daam (रोपनी, आना, पैसा र दाम प्रविष्टि गर्नुहोस्):
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Ropani (रोपनी)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={ropani}
                      onChange={(e) => setRopani(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-center text-sm font-mono font-bold text-slate-900 focus:bg-white focus:border-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Aana (आना)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={aana}
                      onChange={(e) => setAana(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-center text-sm font-mono font-bold text-slate-900 focus:bg-white focus:border-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Paisa (पैसा)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="3"
                      value={paisa}
                      onChange={(e) => setPaisa(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-center text-sm font-mono font-bold text-slate-900 focus:bg-white focus:border-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Daam (दाम)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="3.99"
                      step="any"
                      value={daam}
                      onChange={(e) => setDaam(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-center text-sm font-mono font-bold text-slate-900 focus:bg-white focus:border-slate-800 outline-none"
                    />
                  </div>
                </div>

                {/* Quick Add Buttons */}
                <div className="flex gap-1.5 flex-wrap pt-1 text-[11px]">
                  <span className="text-slate-500 self-center mr-1">Quick Add (+):</span>
                  <button
                    onClick={() => setRopani(String((parseFloat(ropani) || 0) + 1))}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                  >
                    +1 Ropani
                  </button>
                  <button
                    onClick={() => setAana(String((parseFloat(aana) || 0) + 1))}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                  >
                    +1 Aana
                  </button>
                  <button
                    onClick={() => setPaisa(String((parseFloat(paisa) || 0) + 1))}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                  >
                    +1 Paisa
                  </button>
                  <button
                    onClick={() => {
                      setRopani('0');
                      setAana('0');
                      setPaisa('0');
                      setDaam('0');
                    }}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-rose-600 font-medium ml-auto flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear (खाली)
                  </button>
                </div>
              </div>
            ) : (
              /* Bigha Inputs */
              <div className="pt-3 space-y-3">
                <div className="text-[11px] text-slate-500">
                  Enter Bigha, Kattha, Dhur (बिघा, कट्ठा र धुर प्रविष्टि गर्नुहोस्):
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Bigha (बिघा)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={bigha}
                      onChange={(e) => setBigha(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-center text-sm font-mono font-bold text-slate-900 focus:bg-white focus:border-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Kattha (कट्ठा)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="19"
                      value={kattha}
                      onChange={(e) => setKattha(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-center text-sm font-mono font-bold text-slate-900 focus:bg-white focus:border-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Dhur (धुर)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="19.99"
                      step="any"
                      value={dhur}
                      onChange={(e) => setDhur(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-center text-sm font-mono font-bold text-slate-900 focus:bg-white focus:border-slate-800 outline-none"
                    />
                  </div>
                </div>

                {/* Quick Add Buttons */}
                <div className="flex gap-1.5 flex-wrap pt-1 text-[11px]">
                  <span className="text-slate-500 self-center mr-1">Quick Add (+):</span>
                  <button
                    onClick={() => setBigha(String((parseFloat(bigha) || 0) + 1))}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                  >
                    +1 Bigha
                  </button>
                  <button
                    onClick={() => setKattha(String((parseFloat(kattha) || 0) + 1))}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                  >
                    +1 Kattha
                  </button>
                  <button
                    onClick={() => setDhur(String((parseFloat(dhur) || 0) + 1))}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                  >
                    +1 Dhur
                  </button>
                  <button
                    onClick={() => {
                      setBigha('0');
                      setKattha('0');
                      setDhur('0');
                    }}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-rose-600 font-medium ml-auto flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear (खाली)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Instant Multi-Unit Converted Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-800">
                Instant Converted Output (रूपान्तरण नतिजा)
              </span>
              <button
                onClick={handleCopyResults}
                className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1 text-xs font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy All'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                <div className="text-[11px] text-slate-500">Ropani System (रोपनी-आना-पैसा-दाम)</div>
                <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                  {nepaliResults.ropani.formatted}
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                <div className="text-[11px] text-slate-500">Bigha System (बिघा-कट्ठा-धुर)</div>
                <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                  {nepaliResults.bigha.formatted}
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <div className="text-[11px] text-slate-500">Square Feet (वर्ग फिट)</div>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  {nepaliResults.sqFt.toLocaleString('en-US', { maximumFractionDigits: 2 })} sq ft
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <div className="text-[11px] text-slate-500">Square Meters (वर्ग मिटर)</div>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  {nepaliResults.sqM.toLocaleString('en-US', { maximumFractionDigits: 2 })} sq m
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <div className="text-[11px] text-slate-500">Acres (एकर)</div>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  {nepaliResults.acres.toFixed(4)} ac
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <div className="text-[11px] text-slate-500">Hectares (हेक्टर)</div>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  {nepaliResults.hectares.toFixed(4)} ha
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GENERAL AREA CONVERTER */}
      {activeTab === 'general' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
          <div>
            <span className="text-xs font-semibold text-slate-800">
              Direct Area Converter (क्षेत्रफल एकाइ रूपान्तरण)
            </span>
            <p className="text-[11px] text-slate-500">
              Convert from any land unit to any target unit
            </p>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-700 block mb-1">
              Input Value (मान राख्नुहोस्)
            </label>
            <input
              type="number"
              step="any"
              value={genVal}
              onChange={(e) => setGenVal(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:bg-white focus:border-slate-800 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                From Unit (यस एकाइबाट)
              </label>
              <select
                value={genFrom}
                onChange={(e) => setGenFrom(e.target.value as AreaUnit)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-900 focus:bg-white outline-none"
              >
                {Object.entries(areaUnitNames).map(([key, name]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                To Target Unit (यस एकाइमा)
              </label>
              <select
                value={genTo}
                onChange={(e) => setGenTo(e.target.value as AreaUnit)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-900 focus:bg-white outline-none"
              >
                {Object.entries(areaUnitNames).map(([key, name]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Converted Output Display */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-center space-y-1">
            <span className="text-[11px] text-slate-500 font-medium">Conversion Result (रूपान्तरित नतिजा)</span>
            <div className="text-xl font-bold font-mono text-slate-950">
              {genResult.toLocaleString('en-US', { maximumFractionDigits: 4 })}
            </div>
            <div className="text-xs text-slate-600 font-medium">
              {areaUnitNames[genTo]}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LENGTH CONVERTER */}
      {activeTab === 'length' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-slate-700" />
            <div>
              <span className="text-xs font-semibold text-slate-800">
                Length & Distance Converter (लम्बाइ तथा दूरी रूपान्तरण)
              </span>
              <p className="text-[11px] text-slate-500">
                Supports Feet, Meters, Hath, Gaj, Chain/Jarib
              </p>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-700 block mb-1">
              Length Distance (दूरी मान)
            </label>
            <input
              type="number"
              step="any"
              value={lenVal}
              onChange={(e) => setLenVal(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:bg-white focus:border-slate-800 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                From Length Unit (यस एकाइबाट)
              </label>
              <select
                value={lenFrom}
                onChange={(e) => setLenFrom(e.target.value as LengthUnit)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-900 focus:bg-white outline-none"
              >
                {Object.entries(lengthUnitNames).map(([key, name]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                To Length Unit (यस एकाइमा)
              </label>
              <select
                value={lenTo}
                onChange={(e) => setLenTo(e.target.value as LengthUnit)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-900 focus:bg-white outline-none"
              >
                {Object.entries(lengthUnitNames).map(([key, name]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-center space-y-1">
            <span className="text-[11px] text-slate-500 font-medium">Converted Length (रूपान्तरित लम्बाइ)</span>
            <div className="text-xl font-bold font-mono text-slate-950">
              {lenResult.toLocaleString('en-US', { maximumFractionDigits: 4 })}
            </div>
            <div className="text-xs text-slate-600 font-medium">
              {lengthUnitNames[lenTo]}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: OFFICIAL STANDARDS TABLE */}
      {activeTab === 'table' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <BookOpen className="w-4 h-4 text-slate-700" />
            <div>
              <span className="text-xs font-semibold text-slate-800">
                Official Nepal Cadastral Standards (सरकारी नापी मापदण्ड)
              </span>
              <p className="text-[11px] text-slate-500">
                Fixed standard definitions approved by Survey Department of Nepal
              </p>
            </div>
          </div>

          {/* Ropani Breakdown Table */}
          <div>
            <h4 className="text-xs font-semibold text-slate-800 mb-1.5">
              1. Ropani System - Hills/Kathmandu (पहाडी प्रणाली)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                  <tr>
                    <th className="p-2">Unit (एकाइ)</th>
                    <th className="p-2">Subdivisions</th>
                    <th className="p-2">Square Feet</th>
                    <th className="p-2">Square Meter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  <tr>
                    <td className="p-2 font-sans font-medium text-slate-900">1 Ropani (रोपनी)</td>
                    <td className="p-2">16 Aana</td>
                    <td className="p-2">5,476.00</td>
                    <td className="p-2">508.74</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium text-slate-900">1 Aana (आना)</td>
                    <td className="p-2">4 Paisa</td>
                    <td className="p-2">342.25</td>
                    <td className="p-2">31.80</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium text-slate-900">1 Paisa (पैसा)</td>
                    <td className="p-2">4 Daam</td>
                    <td className="p-2">85.56</td>
                    <td className="p-2">7.95</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium text-slate-900">1 Daam (दाम)</td>
                    <td className="p-2">-</td>
                    <td className="p-2">21.39</td>
                    <td className="p-2">1.99</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bigha Breakdown Table */}
          <div className="pt-2">
            <h4 className="text-xs font-semibold text-slate-800 mb-1.5">
              2. Bigha System - Terai Region (तराई प्रणाली)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                  <tr>
                    <th className="p-2">Unit (एकाइ)</th>
                    <th className="p-2">Subdivisions</th>
                    <th className="p-2">Square Feet</th>
                    <th className="p-2">Square Meter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  <tr>
                    <td className="p-2 font-sans font-medium text-slate-900">1 Bigha (बिघा)</td>
                    <td className="p-2">20 Kattha</td>
                    <td className="p-2">72,900.00</td>
                    <td className="p-2">6,772.63</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium text-slate-900">1 Kattha (कट्ठा)</td>
                    <td className="p-2">20 Dhur</td>
                    <td className="p-2">3,645.00</td>
                    <td className="p-2">338.63</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium text-slate-900">1 Dhur (धुर)</td>
                    <td className="p-2">-</td>
                    <td className="p-2">182.25</td>
                    <td className="p-2">16.93</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
