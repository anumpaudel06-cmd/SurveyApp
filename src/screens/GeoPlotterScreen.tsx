import React, { useState, useEffect } from 'react';
import { GeoMap } from '../components/GeoMap';
import { UnitResultsBadge } from '../components/UnitResultsBadge';
import { NepaliUnitsBreakdown } from '../components/NepaliUnitsBreakdown';
import { GeoPoint, getAllUnitsFromSqFt, generateKML, generateGeoJSON } from '../units';
import { Globe, Save, FolderOpen, Trash2, Check } from 'lucide-react';

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
  const [parcelTitle, setParcelTitle] = useState<string>('Geo-Parcel-01');
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
    <div className="space-y-4 pb-6 max-w-2xl mx-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-zinc-300" />
          <h2 className="text-sm font-semibold text-zinc-100">Satellite Geo-Plotter</h2>
        </div>

        <button
          onClick={() => setShowDrawer(true)}
          className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-zinc-700 transition-colors"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Library ({savedGeoPlots.length})</span>
        </button>
      </div>

      <GeoMap onAreaChange={handleAreaChange} />

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-2.5 shadow-sm">
        <div className="flex-1 min-w-[160px]">
          <input
            type="text"
            value={parcelTitle}
            onChange={(e) => setParcelTitle(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 font-medium"
            placeholder="Parcel name"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-zinc-700"
          >
            {isSaved ? <Check className="w-3.5 h-3.5 text-zinc-200" /> : <Save className="w-3.5 h-3.5" />}
            {isSaved ? 'Saved' : 'Save'}
          </button>

          <button
            onClick={handleExportKML}
            className="bg-zinc-950 hover:bg-zinc-850 text-zinc-300 font-medium text-xs px-2.5 py-1.5 rounded-lg transition-colors border border-zinc-800"
          >
            KML
          </button>

          <button
            onClick={handleExportGeoJSON}
            className="bg-zinc-950 hover:bg-zinc-850 text-zinc-300 font-medium text-xs px-2.5 py-1.5 rounded-lg transition-colors border border-zinc-800"
          >
            GeoJSON
          </button>
        </div>
      </div>

      <UnitResultsBadge results={results} title={`Parcel: ${parcelTitle}`} />
      <NepaliUnitsBreakdown results={results} />

      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-sm w-full p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-xs font-semibold text-zinc-200">Geo Parcels ({savedGeoPlots.length})</h3>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded"
              >
                Close
              </button>
            </div>

            {savedGeoPlots.length === 0 ? (
              <div className="text-center py-5 text-zinc-500 text-xs">No saved parcels</div>
            ) : (
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {savedGeoPlots.map((plot) => (
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
                      onClick={() => {
                        const next = savedGeoPlots.filter((p) => p.id !== plot.id);
                        setSavedGeoPlots(next);
                        try {
                          localStorage.setItem('land_survey_pro_geoplots', JSON.stringify(next));
                        } catch (e) {}
                      }}
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
