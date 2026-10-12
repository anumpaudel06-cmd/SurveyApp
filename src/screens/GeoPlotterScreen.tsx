import React, { useState, useEffect } from 'react';
import { GeoMap } from '../components/GeoMap';
import { UnitResultsBadge } from '../components/UnitResultsBadge';
import { NepaliUnitsBreakdown } from '../components/NepaliUnitsBreakdown';
import {
  GeoPoint,
  getAllUnitsFromSqFt,
  generateKML,
  generateGeoJSON,
} from '../units';
import {
  Globe,
  Save,
  Download,
  FolderOpen,
  Trash2,
  FileCode2,
  Share2,
  Check,
} from 'lucide-react';

interface SavedGeoPlot {
  id: string;
  name: string;
  date: string;
  areaSqFt: number;
  points: GeoPoint[];
}

export const GeoPlotterScreen: React.FC = () => {
  const [geoPoints, setGeoPoints] = useState<GeoPoint[]>([]);
  const [areaSqFt, setAreaSqFt] = useState<number>(0);
  const [parcelTitle, setParcelTitle] = useState<string>('Nagarkot Survey Parcel 12');
  const [savedGeoPlots, setSavedGeoPlots] = useState<SavedGeoPlot[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('land_survey_pro_geoplots');
      if (stored) setSavedGeoPlots(JSON.parse(stored));
    } catch (e) {}
  }, []);

  const handleAreaChange = (sqft: number, points: GeoPoint[]) => {
    setAreaSqFt(sqft);
    setGeoPoints(points);
  };

  const handleSave = () => {
    const item: SavedGeoPlot = {
      id: Date.now().toString(),
      name: parcelTitle,
      date: new Date().toLocaleDateString(),
      areaSqFt,
      points: geoPoints,
    };
    const updated = [item, ...savedGeoPlots];
    setSavedGeoPlots(updated);
    try {
      localStorage.setItem('land_survey_pro_geoplots', JSON.stringify(updated));
    } catch (e) {}
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportKML = () => {
    const kml = generateKML(geoPoints, parcelTitle);
    const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${parcelTitle.replace(/\s+/g, '_')}.kml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportGeoJSON = () => {
    const geojson = generateGeoJSON(geoPoints, { title: parcelTitle, areaSqFt });
    const blob = new Blob([geojson], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${parcelTitle.replace(/\s+/g, '_')}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const results = getAllUnitsFromSqFt(areaSqFt);

  return (
    <div className="space-y-5 pb-8 max-w-3xl mx-auto">
      {/* Screen Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
            Satellite & Geodesy
          </span>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-400" /> Geo-Plotter (Map Polygon)
          </h2>
        </div>

        <button
          onClick={() => setShowDrawer(true)}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Library ({savedGeoPlots.length})</span>
        </button>
      </div>

      {/* Interactive Map Component */}
      <GeoMap onAreaChange={handleAreaChange} />

      {/* Title & Export Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="text-[10px] text-slate-400 block mb-1">Parcel / Client Title</label>
          <input
            type="text"
            value={parcelTitle}
            onChange={(e) => setParcelTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-medium"
            placeholder="e.g. Parcel 402 - Lalitpur"
          />
        </div>

        <div className="flex items-center gap-2 pt-2 sm:pt-0">
          <button
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
          >
            {isSaved ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            {isSaved ? 'Saved!' : 'Save'}
          </button>

          <button
            onClick={handleExportKML}
            className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
            title="Download Google Earth KML"
          >
            <Download className="w-4 h-4" /> KML
          </button>

          <button
            onClick={handleExportGeoJSON}
            className="bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
            title="Download GeoJSON format"
          >
            <FileCode2 className="w-4 h-4" /> GeoJSON
          </button>
        </div>
      </div>

      {/* Multi-Unit Output Breakdown */}
      <UnitResultsBadge results={results} title={`Geodesic Area: ${parcelTitle}`} />

      {/* Nepali Systems Detail */}
      <NepaliUnitsBreakdown results={results} />

      {/* Saved Library Modal */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Geo Parcels ({savedGeoPlots.length})</h3>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg"
              >
                Close
              </button>
            </div>

            {savedGeoPlots.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                No saved geo parcels yet. Tap map to add pins and save.
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {savedGeoPlots.map((plot) => (
                  <div
                    key={plot.id}
                    className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{plot.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {plot.date} • {plot.points.length} GPS Coordinates
                      </div>
                      <div className="text-xs font-mono font-semibold text-sky-400 mt-1">
                        {plot.areaSqFt.toFixed(1)} sq ft
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const next = savedGeoPlots.filter((p) => p.id !== plot.id);
                        setSavedGeoPlots(next);
                        try {
                          localStorage.setItem('land_survey_pro_geoplots', JSON.stringify(next));
                        } catch (e) {}
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg"
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
