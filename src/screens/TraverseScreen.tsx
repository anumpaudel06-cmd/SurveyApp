import React, { useState } from 'react';
import {
  TraverseStationInput,
  TraverseAdjustmentRule,
  SurveyClass,
  calculateFullTraverse,
  generateTraverseCSV,
  generateTraverseReportTXT,
  SURVEY_CLASS_SPECS,
  shoelaceArea,
  getAllUnitsFromSqFt,
  generateDXF,
} from '../units';
import { UnitResultsBadge } from '../components/UnitResultsBadge';
import {
  Compass,
  Download,
  Plus,
  Trash2,
  FileSpreadsheet,
  FileText,
  CheckCircle,
  AlertTriangle,
  Upload,
  Info,
} from 'lucide-react';

export const TraverseScreen: React.FC = () => {
  // Start origin control coordinates
  const [startE, setStartE] = useState<string>('500000.000');
  const [startN, setStartN] = useState<string>('3000000.000');

  // Adjustment rule: Bowditch vs Transit
  const [rule, setRule] = useState<TraverseAdjustmentRule>('bowditch');

  // Permissible Survey Standard Class
  const [surveyClass, setSurveyClass] = useState<SurveyClass>('class2');

  // Traverse station legs
  const [stations, setStations] = useState<TraverseStationInput[]>([
    { id: 'A', bearingDeg: 35.5, distance: 125.4 },
    { id: 'B', bearingDeg: 120.2, distance: 98.6 },
    { id: 'C', bearingDeg: 215.8, distance: 132.1 },
    { id: 'D', bearingDeg: 305.4, distance: 104.2 },
  ]);

  // Quick new leg input
  const [newId, setNewId] = useState<string>('E');
  const [newBearing, setNewBearing] = useState<string>('45');
  const [newDistance, setNewDistance] = useState<string>('100');

  // CSV Import Modal
  const [showImport, setShowImport] = useState<boolean>(false);
  const [importText, setImportText] = useState<string>('');

  const numStartE = parseFloat(startE) || 500000;
  const numStartN = parseFloat(startN) || 3000000;

  // Compute complete traverse adjustment
  const result = calculateFullTraverse(stations, numStartE, numStartN, rule, surveyClass);

  // Compute closed polygon area from adjusted coordinates
  const polygonPoints = result.stations.map((s) => ({ x: s.easting, y: s.northing }));
  const traverseAreaSqM = shoelaceArea(polygonPoints);
  const traverseAreaSqFt = traverseAreaSqM * 10.7639;
  const areaResults = getAllUnitsFromSqFt(traverseAreaSqFt);

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
    const csvContent = generateTraverseCSV(result);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Traverse_Computation_${result.adjustmentRule}_Rule.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export TXT Report
  const handleDownloadReport = () => {
    const txtContent = generateTraverseReportTXT(result);
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Traverse_FieldBook_Report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export DXF
  const handleDownloadDXF = () => {
    const dxfContent = generateDXF(polygonPoints, 'TRAVERSE_SURVEY');
    const blob = new Blob([dxfContent], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Traverse_Cadastral_Plot.dxf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import CSV text
  const handleImportCSV = () => {
    try {
      const lines = importText.trim().split('\n');
      const parsed: TraverseStationInput[] = [];
      lines.forEach((line) => {
        const parts = line.split(/[,\t]+/);
        if (parts.length >= 3) {
          const id = parts[0].trim();
          const bearing = parseFloat(parts[1].trim());
          const dist = parseFloat(parts[2].trim());
          if (!isNaN(bearing) && !isNaN(dist) && dist > 0) {
            parsed.push({ id, bearingDeg: bearing, distance: dist });
          }
        }
      });
      if (parsed.length >= 2) {
        setStations(parsed);
        setShowImport(false);
        setImportText('');
      } else {
        alert('Invalid CSV format. Expected: Station, Bearing, Distance');
      }
    } catch (e) {
      alert('Error parsing CSV');
    }
  };

  return (
    <div className="space-y-3 pb-8 max-w-xl mx-auto">
      {/* 1. Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Traverse Calculator & Coordinate Balancer
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Closing Error, Permissible Limits, Bowditch / Transit Rule & CSV / CAD Output
            </p>
          </div>
        </div>

        <button
          onClick={loadSampleLoop}
          className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
        >
          Sample Loop
        </button>
      </div>

      {/* 2. Survey Standard & Adjustment Rule Settings */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Survey Standard / Permissible Limit */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Survey Standard / Permissible Limit:
            </label>
            <select
              value={surveyClass}
              onChange={(e) => setSurveyClass(e.target.value as SurveyClass)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="class2">Nepal Cadastral Class II (1 : 3,000)</option>
              <option value="class1">Nepal Cadastral Class I (1 : 5,000)</option>
              <option value="engineering">Engineering / Topo Survey (1 : 10,000)</option>
              <option value="geodetic">Geodetic Control Survey (1 : 25,000)</option>
            </select>
          </div>

          {/* Adjustment Rule: Bowditch vs Transit */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Adjustment Balancing Rule:
            </label>
            <select
              value={rule}
              onChange={(e) => setRule(e.target.value as TraverseAdjustmentRule)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="bowditch">Bowditch / Compass Rule (Recommended for Total Station)</option>
              <option value="transit">Transit Rule (When Angular Precision Exceeds Taping)</option>
            </select>
          </div>
        </div>

        {/* Rule explanation tip */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <span>
            <b>Engineering Note:</b> {result.ruleExplanation}
          </span>
        </div>

        {/* Initial Coordinates */}
        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
              Initial Easting - X (m)
            </label>
            <input
              type="number"
              step="any"
              value={startE}
              onChange={(e) => setStartE(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-xs text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
              Initial Northing - Y (m)
            </label>
            <input
              type="number"
              step="any"
              value={startN}
              onChange={(e) => setStartN(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-xs text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
      </div>

      {/* 3. CLOSING ERROR SUMMARY CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Traverse Accuracy & Closing Error
          </span>
          <div
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
              result.isPermissible
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {result.isPermissible ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                <span>PASSED (Acceptable)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>EXCEEDED (Above Limit)</span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
            <div className="text-[10px] text-slate-500">Linear Misclosure</div>
            <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
              {result.linearMisclosure} m
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">e = √(dN² + dE²)</div>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
            <div className="text-[10px] text-slate-500">Relative Precision</div>
            <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
              {result.relativePrecision}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">1 : N accuracy</div>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
            <div className="text-[10px] text-slate-500">Permissible Standard</div>
            <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
              {result.permissibleLimitStr}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{SURVEY_CLASS_SPECS[surveyClass].name}</div>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
            <div className="text-[10px] text-slate-500">Total Perimeter</div>
            <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
              {result.totalDistance} m
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Σ L</div>
          </div>
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-600 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <span>Sum Latitude (Σ dN): {result.sumLat} m</span>
          <span>Sum Departure (Σ dE): {result.sumDep} m</span>
          <span>Error Bearing: {result.misclosureBearingDeg}°</span>
        </div>
      </div>

      {/* 4. STATION LEGS INPUT TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Traverse Legs Field Book
            </span>
            <span className="text-[11px] text-slate-500 ml-2">
              ({stations.length} Legs)
            </span>
          </div>

          <button
            onClick={() => setShowImport(!showImport)}
            className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1"
          >
            <Upload className="w-3 h-3" />
            <span>Import CSV</span>
          </button>
        </div>

        {/* CSV Import Drawer */}
        {showImport && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg space-y-2">
            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              Paste CSV / Tab-separated data (Station, Bearing_Deg, Distance_m):
            </div>
            <textarea
              rows={4}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="A, 35.5, 125.4&#10;B, 120.2, 98.6&#10;C, 215.8, 132.1&#10;D, 305.4, 104.2"
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-2 text-xs font-mono outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImport(false)}
                className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleImportCSV}
                className="px-3 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded text-xs font-medium"
              >
                Load CSV Data
              </button>
            </div>
          </div>
        )}

        {/* Stations Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
              <tr>
                <th className="p-2">Station</th>
                <th className="p-2">Bearing / Azimuth (°)</th>
                <th className="p-2">Distance (m)</th>
                <th className="p-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {stations.map((stn, idx) => (
                <tr key={idx}>
                  <td className="p-2 font-bold font-sans">
                    {stn.id} → {stations[(idx + 1) % stations.length].id}
                  </td>
                  <td className="p-1.5">
                    <input
                      type="number"
                      step="any"
                      value={stn.bearingDeg}
                      onChange={(e) => handleUpdateStation(idx, 'bearingDeg', e.target.value)}
                      className="w-24 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="p-1.5">
                    <input
                      type="number"
                      step="any"
                      value={stn.distance}
                      onChange={(e) => handleUpdateStation(idx, 'distance', e.target.value)}
                      className="w-24 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="p-2 text-right">
                    {stations.length > 2 && (
                      <button
                        onClick={() => handleRemoveStation(idx)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Add Leg Bar */}
        <div className="flex gap-2 pt-1">
          <input
            type="text"
            placeholder="Station"
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            className="w-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs font-mono"
          />
          <input
            type="number"
            placeholder="Bearing (°)"
            value={newBearing}
            onChange={(e) => setNewBearing(e.target.value)}
            className="w-28 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs font-mono"
          />
          <input
            type="number"
            placeholder="Distance (m)"
            value={newDistance}
            onChange={(e) => setNewDistance(e.target.value)}
            className="w-28 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs font-mono"
          />
          <button
            onClick={handleAddStation}
            className="px-3 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded text-xs font-medium flex items-center gap-1 ml-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Leg</span>
          </button>
        </div>
      </div>

      {/* 5. ADJUSTED COORDINATE COMPUTATION SHEET */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Balanced Coordinates Sheet ({result.adjustmentRule.toUpperCase()} Rule)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            Origin: {result.startEasting}E / {result.startNorthing}N
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
              <tr>
                <th className="p-2">Station</th>
                <th className="p-2">Raw dN</th>
                <th className="p-2">Raw dE</th>
                <th className="p-2">Corr dN</th>
                <th className="p-2">Corr dE</th>
                <th className="p-2">Adj dN</th>
                <th className="p-2">Adj dE</th>
                <th className="p-2 font-bold text-slate-900 dark:text-white">Easting (m)</th>
                <th className="p-2 font-bold text-slate-900 dark:text-white">Northing (m)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
              {result.stations.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-2 font-sans font-bold text-slate-900 dark:text-slate-100">
                    {s.fromId} → {s.toId}
                  </td>
                  <td className="p-1.5 text-slate-600 dark:text-slate-400">{s.rawLat}</td>
                  <td className="p-1.5 text-slate-600 dark:text-slate-400">{s.rawDep}</td>
                  <td className="p-1.5 text-slate-500">{s.corrLat}</td>
                  <td className="p-1.5 text-slate-500">{s.corrDep}</td>
                  <td className="p-1.5 text-slate-700 dark:text-slate-300">{s.adjLat}</td>
                  <td className="p-1.5 text-slate-700 dark:text-slate-300">{s.adjDep}</td>
                  <td className="p-1.5 font-bold text-slate-900 dark:text-slate-100 bg-slate-50/70 dark:bg-slate-800/60">{s.easting}</td>
                  <td className="p-1.5 font-bold text-slate-900 dark:text-slate-100 bg-slate-50/70 dark:bg-slate-800/60">{s.northing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. TRAVERSE ENCLOSED AREA BADGE */}
      <UnitResultsBadge
        results={areaResults}
        title="Enclosed Traverse Area (Shoelace on Balanced Coordinates)"
      />

      {/* 7. STANDARD FILE FORMAT EXPORT BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-2">
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
          Download Standard Survey File Formats:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-medium">
          <button
            onClick={handleDownloadCSV}
            className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Download CSV (Excel / GIS)</span>
          </button>

          <button
            onClick={handleDownloadReport}
            className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Field Book Report (.txt)</span>
          </button>

          <button
            onClick={handleDownloadDXF}
            className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-purple-600" />
            <span>AutoCAD CAD (.dxf)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
