import React, { useState } from 'react';
import {
  TraverseStationInput,
  TraverseAdjustmentRule,
  SurveyClass,
  calculateFullTraverse,
  generateTraverseCSV,
  generateTraverseReportTXT,
  SURVEY_CLASS_SPECS,
} from '../units';
import {
  Compass,
  Download,
  Plus,
  Trash2,
  FileSpreadsheet,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  RotateCcw,
  Upload,
} from 'lucide-react';

export const TraverseScreen: React.FC = () => {
  // Start origin coordinates
  const [startE, setStartE] = useState<string>('500000.000');
  const [startN, setStartN] = useState<string>('3000000.000');

  // Adjustment rule: Bowditch vs Transit
  const [rule, setRule] = useState<TraverseAdjustmentRule>('bowditch');
  // Permissible class
  const [surveyClass, setSurveyClass] = useState<SurveyClass>('class2');

  // Traverse station legs
  const [stations, setStations] = useState<TraverseStationInput[]>([
    { id: 'A', bearingDeg: 35.5, distance: 125.4 },
    { id: 'B', bearingDeg: 120.2, distance: 98.6 },
    { id: 'C', bearingDeg: 215.8, distance: 132.1 },
    { id: 'D', bearingDeg: 305.4, distance: 104.2 },
  ]);

  // New leg input
  const [newId, setNewId] = useState<string>('E');
  const [newBearing, setNewBearing] = useState<string>('45');
  const [newDistance, setNewDistance] = useState<string>('100');

  // CSV Import Modal
  const [showImport, setShowImport] = useState<boolean>(false);
  const [importText, setImportText] = useState<string>('');

  const numStartE = parseFloat(startE) || 500000;
  const numStartN = parseFloat(startN) || 3000000;

  // Compute traverse results
  const result = calculateFullTraverse(stations, numStartE, numStartN, rule, surveyClass);

  const handleAddStation = () => {
    const b = parseFloat(newBearing);
    const d = parseFloat(newDistance);
    if (!isNaN(b) && !isNaN(d) && d > 0) {
      setStations([
        ...stations,
        {
          id: newId.trim() || `S${stations.length + 1}`,
          bearingDeg: (b + 360) % 360,
          distance: d,
        },
      ]);
      setNewId(String.fromCharCode(newId.charCodeAt(0) + 1));
      setNewDistance('');
    }
  };

  const handleRemoveStation = (idx: number) => {
    if (stations.length > 2) {
      setStations(stations.filter((_, i) => i !== idx));
    }
  };

  const handleUpdateStation = (idx: number, field: 'bearingDeg' | 'distance', val: string) => {
    const num = parseFloat(val) || 0;
    setStations((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: num };
      return next;
    });
  };

  const loadSampleLoop = () => {
    setStations([
      { id: 'A', bearingDeg: 40.0, distance: 120.5 },
      { id: 'B', bearingDeg: 130.0, distance: 95.2 },
      { id: 'C', bearingDeg: 220.0, distance: 118.8 },
      { id: 'D', bearingDeg: 310.0, distance: 96.1 },
    ]);
  };

  // Export CSV
  const handleDownloadCSV = () => {
    const csv = generateTraverseCSV(result);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Traverse_Computation_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export Text Report
  const handleDownloadTXT = () => {
    const txt = generateTraverseReportTXT(result);
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Traverse_Report_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import CSV text
  const handleProcessImport = () => {
    try {
      const lines = importText.trim().split('\n');
      const parsed: TraverseStationInput[] = [];
      lines.forEach((line) => {
        const parts = line.split(/[,\t]/).map((p) => p.trim());
        if (parts.length >= 2) {
          const id = parts.length >= 3 ? parts[0] : `S${parsed.length + 1}`;
          const bearing = parseFloat(parts.length >= 3 ? parts[1] : parts[0]);
          const dist = parseFloat(parts.length >= 3 ? parts[2] : parts[1]);
          if (!isNaN(bearing) && !isNaN(dist) && dist > 0) {
            parsed.push({ id, bearingDeg: bearing, distance: dist });
          }
        }
      });
      if (parsed.length >= 3) {
        setStations(parsed);
        setShowImport(false);
      } else {
        alert('Please enter at least 3 valid station lines: [Station, Bearing, Distance]');
      }
    } catch (e) {
      alert('Error parsing CSV');
    }
  };

  return (
    <div className="space-y-3.5 pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-zinc-300" /> ट्राभर्स हिसाब (Traverse Calculator & Coordinator)
          </h2>
          <p className="text-[10px] text-zinc-500">Closing Error, Permissible Limits, Bowditch & Coordinates</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowImport(true)}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1 rounded-lg border border-zinc-700 flex items-center gap-1"
          >
            <Upload className="w-3 h-3" /> Import CSV
          </button>
          <button
            onClick={loadSampleLoop}
            className="text-xs bg-zinc-950 hover:bg-zinc-850 text-zinc-405 px-2 py-1 rounded-lg border border-zinc-800"
            title="Load Sample"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Starting Origin & Specs */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 space-y-3 shadow-sm">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] text-zinc-400 block mb-0.5">सुरुवाती Easting (X in m)</label>
            <input
              type="number"
              step="any"
              value={startE}
              onChange={(e) => setStartE(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
            />
          </div>
          <div>
            <label className="text-[10px] text-zinc-400 block mb-0.5">सुरुवाती Northing (Y in m)</label>
            <input
              type="number"
              step="any"
              value={startN}
              onChange={(e) => setStartN(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
            />
          </div>
        </div>

        {/* Survey Standard & Permissible Limit Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] text-zinc-400 block mb-0.5">
              नापी मापदण्ड (Survey Class / Tolerance)
            </label>
            <select
              value={surveyClass}
              onChange={(e) => setSurveyClass(e.target.value as SurveyClass)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-100 text-xs"
            >
              {Object.entries(SURVEY_CLASS_SPECS).map(([k, spec]) => (
                <option key={k} value={k}>
                  {spec.name} ({spec.description.split('-')[0].trim()})
                </option>
              ))}
            </select>
          </div>

          {/* Adjustment Rule Selector */}
          <div>
            <label className="text-[10px] text-zinc-400 block mb-0.5">
              समायोजन नियम (Adjustment Rule)
            </label>
            <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
              <button
                onClick={() => setRule('bowditch')}
                className={`flex-1 py-1 rounded font-medium transition-colors ${
                  rule === 'bowditch' ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-500'
                }`}
              >
                Bowditch (Compass)
              </button>
              <button
                onClick={() => setRule('transit')}
                className={`flex-1 py-1 rounded font-medium transition-colors ${
                  rule === 'transit' ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-500'
                }`}
              >
                Transit Rule
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Misclosure & Permissible Error Summary Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <span className="text-xs font-semibold text-zinc-200">
            क्लोजिङ त्रुटि र नतिजा (Closure & Precision Summary)
          </span>

          <span
            className={`text-xs px-2.5 py-0.5 rounded font-bold font-mono flex items-center gap-1 border ${
              result.isPermissible
                ? 'bg-zinc-800 text-zinc-100 border-zinc-700'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800'
            }`}
          >
            {result.isPermissible ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-zinc-300" />
                स्वीकार्य (PASS: Within Limit)
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-zinc-400" />
                त्रुटि बढी भयो (FAIL: Exceeds Limit)
              </>
            )}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block">कुल लम्बाई (Perimeter)</span>
            <span className="font-mono font-bold text-zinc-100 text-sm mt-0.5 block">
              {result.totalDistance.toFixed(2)} m
            </span>
          </div>

          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block">क्लोजिङ त्रुटि (Misclosure)</span>
            <span className="font-mono font-bold text-zinc-100 text-sm mt-0.5 block">
              {result.linearMisclosure} m
            </span>
          </div>

          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block">परिशुद्धता (Precision)</span>
            <span className="font-mono font-bold text-zinc-100 text-sm mt-0.5 block">
              {result.relativePrecision}
            </span>
          </div>

          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block">स्वीकार्य सीमा (Standard)</span>
            <span className="font-mono font-bold text-zinc-300 text-sm mt-0.5 block">
              {result.permissibleLimitStr}
            </span>
          </div>
        </div>

        {/* Which rule to use guidance */}
        <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80 text-[11px] text-zinc-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-zinc-200">कुन नियम प्रयोग गर्ने? </span>
            {result.ruleExplanation}
          </div>
        </div>
      </div>

      {/* Stations Input & Edit Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between pb-1 text-xs">
          <span className="font-medium text-zinc-200">स्टेशन र नापहरू (Station Observations)</span>
          <span className="text-[10px] text-zinc-500">सम्पादन गर्न सिधै अंक परिवर्तन गर्नुहोस्</span>
        </div>

        {/* Add Station Input Row */}
        <div className="flex items-center gap-1.5 text-xs bg-zinc-950 p-2 rounded-lg border border-zinc-800">
          <input
            type="text"
            placeholder="Stn ID"
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            className="w-14 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-100 font-mono text-center text-xs"
          />
          <input
            type="number"
            step="any"
            placeholder="Bearing (deg)"
            value={newBearing}
            onChange={(e) => setNewBearing(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-100 font-mono text-xs"
          />
          <input
            type="number"
            step="any"
            placeholder="Distance (m)"
            value={newDistance}
            onChange={(e) => setNewDistance(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-100 font-mono text-xs"
          />
          <button
            onClick={handleAddStation}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium px-3 py-1 rounded text-xs border border-zinc-700 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> थप्नुहोस्
          </button>
        </div>

        {/* Editable Table */}
        <div className="overflow-x-auto border border-zinc-800 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-[10px] text-zinc-500 uppercase border-b border-zinc-800">
              <tr>
                <th className="p-2">Line</th>
                <th className="p-2">Bearing (डिग्री)</th>
                <th className="p-2">Distance (मिटर)</th>
                <th className="p-2 text-right">कार्य</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850 font-mono">
              {stations.map((stn, idx) => {
                const nextStn = stations[(idx + 1) % stations.length];
                return (
                  <tr key={idx} className="hover:bg-zinc-950/50">
                    <td className="p-2 text-zinc-300 font-bold">
                      {stn.id} → {nextStn.id}
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        step="any"
                        value={stn.bearingDeg}
                        onChange={(e) => handleUpdateStation(idx, 'bearingDeg', e.target.value)}
                        className="w-24 bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-zinc-100 text-xs font-mono"
                      />
                      <span className="text-zinc-500 text-[10px] ml-1">°</span>
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        step="any"
                        value={stn.distance}
                        onChange={(e) => handleUpdateStation(idx, 'distance', e.target.value)}
                        className="w-24 bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-zinc-100 text-xs font-mono"
                      />
                      <span className="text-zinc-500 text-[10px] ml-1">m</span>
                    </td>
                    <td className="p-2 text-right">
                      <button
                        onClick={() => handleRemoveStation(idx)}
                        disabled={stations.length <= 3}
                        className="text-zinc-500 hover:text-zinc-300 disabled:opacity-20 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Computed & Adjusted Coordinates Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between pb-1 text-xs">
          <div>
            <span className="font-semibold text-zinc-100">समायोजित निर्देशांकहरू (Adjusted Coordinates Table)</span>
            <p className="text-[10px] text-zinc-500">Method: {rule.toUpperCase()} Adjustment</p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleDownloadCSV}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-2.5 py-1 rounded text-xs border border-zinc-700 flex items-center gap-1"
              title="Download Excel CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
            </button>
            <button
              onClick={handleDownloadTXT}
              className="bg-zinc-950 hover:bg-zinc-850 text-zinc-300 px-2.5 py-1 rounded text-xs border border-zinc-800 flex items-center gap-1"
              title="Download Field Book Text Report"
            >
              <FileText className="w-3.5 h-3.5" /> Report
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border border-zinc-800 rounded-lg">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-zinc-950 text-[10px] text-zinc-500 uppercase border-b border-zinc-800">
              <tr>
                <th className="p-2">Station</th>
                <th className="p-2">Raw dN (Lat)</th>
                <th className="p-2">Raw dE (Dep)</th>
                <th className="p-2">Adj dN</th>
                <th className="p-2">Adj dE</th>
                <th className="p-2 text-right">Easting (X)</th>
                <th className="p-2 text-right">Northing (Y)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850 font-mono text-[11px]">
              {result.stations.map((s, idx) => (
                <tr key={idx} className="hover:bg-zinc-950/40">
                  <td className="p-2 font-bold text-zinc-300">{s.toId}</td>
                  <td className="p-2 text-zinc-400">{s.rawLat >= 0 ? `+${s.rawLat}` : s.rawLat}</td>
                  <td className="p-2 text-zinc-400">{s.rawDep >= 0 ? `+${s.rawDep}` : s.rawDep}</td>
                  <td className="p-2 text-zinc-300">{s.adjLat >= 0 ? `+${s.adjLat}` : s.adjLat}</td>
                  <td className="p-2 text-zinc-300">{s.adjDep >= 0 ? `+${s.adjDep}` : s.adjDep}</td>
                  <td className="p-2 text-right font-bold text-zinc-100">{s.easting.toFixed(3)}</td>
                  <td className="p-2 text-right font-bold text-zinc-100">{s.northing.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Import Modal */}
      {showImport && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-xs font-semibold text-zinc-200">Import Stations (CSV / Text)</h3>
              <button onClick={() => setShowImport(false)} className="text-xs text-zinc-400">
                Cancel
              </button>
            </div>

            <p className="text-[11px] text-zinc-400">
              Format: <code>Station, Bearing, Distance</code> (one per line)
            </p>

            <textarea
              rows={6}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="A, 35.5, 125.4&#10;B, 120.2, 98.6&#10;C, 215.8, 132.1&#10;D, 305.4, 104.2"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-xs text-zinc-100"
            />

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={handleProcessImport}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs px-3 py-1.5 rounded-lg border border-zinc-700 font-medium"
              >
                Load Into Calculator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
