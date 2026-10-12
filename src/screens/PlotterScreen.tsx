import React, { useState, useEffect } from 'react';
import { PlotCanvas } from '../components/PlotCanvas';
import { UnitResultsBadge } from '../components/UnitResultsBadge';
import { NepaliUnitsBreakdown } from '../components/NepaliUnitsBreakdown';
import {
  Point2D,
  getAllUnitsFromSqFt,
  generateDXF,
  MultiUnitAreaResult,
} from '../units';
import {
  Layers,
  Save,
  Download,
  FolderOpen,
  Trash2,
  FileCode,
  Building,
  Check,
  Share2,
} from 'lucide-react';

interface SavedPlot {
  id: string;
  name: string;
  date: string;
  areaSqFt: number;
  points: Point2D[];
}

export const PlotterScreen: React.FC = () => {
  const [unit, setUnit] = useState<'ft' | 'm'>('ft');
  const [currentAreaSqFt, setCurrentAreaSqFt] = useState<number>(0);
  const [currentPerimeter, setCurrentPerimeter] = useState<number>(0);
  const [currentPoints, setCurrentPoints] = useState<Point2D[]>([]);
  const [plotName, setPlotName] = useState<string>('Plot-Kathmandu-01');
  const [footprintArea, setFootprintArea] = useState<number>(0);
  const [savedPlots, setSavedPlots] = useState<SavedPlot[]>([]);
  const [showSavedModal, setShowSavedModal] = useState<boolean>(false);
  const [savedStatus, setSavedStatus] = useState<boolean>(false);

  // Load saved plots from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('land_survey_pro_plots');
      if (stored) {
        setSavedPlots(JSON.parse(stored));
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  const handleAreaCalculated = (areaSqFt: number, perimeter: number, points: Point2D[]) => {
    setCurrentAreaSqFt(areaSqFt);
    setCurrentPerimeter(perimeter);
    setCurrentPoints(points);
  };

  const handleSavePlot = () => {
    const newPlot: SavedPlot = {
      id: Date.now().toString(),
      name: plotName || `Plot ${savedPlots.length + 1}`,
      date: new Date().toLocaleDateString(),
      areaSqFt: currentAreaSqFt,
      points: currentPoints,
    };
    const updated = [newPlot, ...savedPlots];
    setSavedPlots(updated);
    try {
      localStorage.setItem('land_survey_pro_plots', JSON.stringify(updated));
    } catch (e) {}
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const handleDeleteSaved = (id: string) => {
    const updated = savedPlots.filter((p) => p.id !== id);
    setSavedPlots(updated);
    try {
      localStorage.setItem('land_survey_pro_plots', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleExportDXF = () => {
    const dxf = generateDXF(currentPoints, plotName);
    const blob = new Blob([dxf], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plotName.replace(/\s+/g, '_')}.dxf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const multiUnits = getAllUnitsFromSqFt(currentAreaSqFt);

  return (
    <div className="space-y-5 pb-8 max-w-3xl mx-auto">
      {/* Header and Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
            Interactive CAD
          </span>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" /> 2D Shoelace Plotter
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Feet/Meter Toggle */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setUnit('ft')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                unit === 'ft' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Feet
            </button>
            <button
              onClick={() => setUnit('m')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                unit === 'm' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Meters
            </button>
          </div>

          <button
            onClick={() => setShowSavedModal(true)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Saved ({savedPlots.length})</span>
          </button>
        </div>
      </div>

      {/* Interactive CAD Canvas */}
      <PlotCanvas
        scaleUnit={unit}
        footprintArea={footprintArea}
        onAreaCalculated={handleAreaCalculated}
      />

      {/* Plot Metadata and Save/Export Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="text-[10px] text-slate-400 block mb-1">Parcel / Plot Name</label>
          <input
            type="text"
            value={plotName}
            onChange={(e) => setPlotName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-medium"
            placeholder="e.g. Kitta No. 248, Ward 4"
          />
        </div>

        <div className="flex items-center gap-2 pt-4 sm:pt-0">
          <button
            onClick={handleSavePlot}
            className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
          >
            {savedStatus ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            {savedStatus ? 'Saved!' : 'Save Locally'}
          </button>

          <button
            onClick={handleExportDXF}
            className="bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
            title="Download AutoCAD DXF file"
          >
            <FileCode className="w-4 h-4" />
            Export DXF
          </button>
        </div>
      </div>

      {/* Building Footprint Deduction on Canvas */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-rose-400" />
          <div>
            <div className="text-xs font-bold text-white">Deduct Building Footprint</div>
            <div className="text-[10px] text-slate-400">Subtract house/structure area from polygon</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={footprintArea}
            onChange={(e) => setFootprintArea(Math.max(0, parseFloat(e.target.value) || 0))}
            placeholder="0"
            className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono text-right"
          />
          <span className="text-xs text-slate-400 font-mono">sq {unit}</span>
        </div>
      </div>

      {/* Multi-Unit Output Breakdown */}
      <UnitResultsBadge results={multiUnits} title={`Polygon Area: ${plotName}`} />

      {/* Nepali Systems Detail */}
      <NepaliUnitsBreakdown results={multiUnits} />

      {/* Saved Plots Drawer Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Saved Plots ({savedPlots.length})</h3>
              <button
                onClick={() => setShowSavedModal(false)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg"
              >
                Close
              </button>
            </div>

            {savedPlots.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                No saved plots yet. Draw a polygon and tap "Save Locally".
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {savedPlots.map((plot) => (
                  <div
                    key={plot.id}
                    className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{plot.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {plot.date} • {plot.points.length} vertices
                      </div>
                      <div className="text-xs font-mono font-semibold text-emerald-400 mt-1">
                        {plot.areaSqFt.toFixed(1)} sq ft
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteSaved(plot.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
