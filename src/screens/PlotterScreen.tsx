import React, { useState, useEffect } from 'react';
import { PlotCanvas } from '../components/PlotCanvas';
import { UnitResultsBadge } from '../components/UnitResultsBadge';
import { NepaliUnitsBreakdown } from '../components/NepaliUnitsBreakdown';
import { Point2D, getAllUnitsFromSqFt, generateDXF } from '../units';
import { Layers, Save, FolderOpen, Trash2, FileCode, Building, Check } from 'lucide-react';

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
  const [plotName, setPlotName] = useState<string>('Plot-01');
  const [footprintArea, setFootprintArea] = useState<number>(0);
  const [savedPlots, setSavedPlots] = useState<SavedPlot[]>([]);
  const [showSavedModal, setShowSavedModal] = useState<boolean>(false);
  const [savedStatus, setSavedStatus] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('land_survey_pro_plots');
      if (stored) setSavedPlots(JSON.parse(stored));
    } catch (e) {}
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
    <div className="space-y-4 pb-6 max-w-2xl mx-auto">
      {/* Top Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-zinc-300" />
          <h2 className="text-sm font-semibold text-zinc-100">2D Shoelace Plotter</h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-xs">
            <button
              onClick={() => setUnit('ft')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                unit === 'ft' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Feet
            </button>
            <button
              onClick={() => setUnit('m')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                unit === 'm' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Meters
            </button>
          </div>

          <button
            onClick={() => setShowSavedModal(true)}
            className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-zinc-700 transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Saved ({savedPlots.length})</span>
          </button>
        </div>
      </div>

      <PlotCanvas
        scaleUnit={unit}
        footprintArea={footprintArea}
        onAreaCalculated={handleAreaCalculated}
      />

      {/* Plot Metadata and Actions */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-2.5 shadow-sm">
        <div className="flex-1 min-w-[160px]">
          <input
            type="text"
            value={plotName}
            onChange={(e) => setPlotName(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 font-medium"
            placeholder="Plot name"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSavePlot}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-zinc-700"
          >
            {savedStatus ? <Check className="w-3.5 h-3.5 text-zinc-200" /> : <Save className="w-3.5 h-3.5" />}
            {savedStatus ? 'Saved' : 'Save'}
          </button>

          <button
            onClick={handleExportDXF}
            className="bg-zinc-950 hover:bg-zinc-850 text-zinc-300 font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-zinc-800"
          >
            <FileCode className="w-3.5 h-3.5" />
            Export DXF
          </button>
        </div>
      </div>

      {/* Deduct Footprint */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-zinc-400">
          <Building className="w-4 h-4 text-zinc-500" />
          <span>Deduct Building Footprint</span>
        </div>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min="0"
            value={footprintArea}
            onChange={(e) => setFootprintArea(Math.max(0, parseFloat(e.target.value) || 0))}
            placeholder="0"
            className="w-20 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-zinc-100 font-mono text-right"
          />
          <span className="text-zinc-500 text-xs font-mono">sq {unit}</span>
        </div>
      </div>

      <UnitResultsBadge results={multiUnits} title={`Parcel: ${plotName}`} />
      <NepaliUnitsBreakdown results={multiUnits} />

      {/* Saved Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-sm w-full p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-xs font-semibold text-zinc-200">Saved Plots ({savedPlots.length})</h3>
              <button
                onClick={() => setShowSavedModal(false)}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded"
              >
                Close
              </button>
            </div>

            {savedPlots.length === 0 ? (
              <div className="text-center py-5 text-zinc-500 text-xs">No saved plots</div>
            ) : (
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {savedPlots.map((plot) => (
                  <div
                    key={plot.id}
                    className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-medium text-zinc-200">{plot.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {plot.areaSqFt.toFixed(1)} sq ft • {plot.date}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteSaved(plot.id)}
                      className="text-zinc-500 hover:text-zinc-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
