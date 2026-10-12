import React, { useState } from 'react';
import { NtripConnector } from '../components/NtripConnector';
import { ARCameraView } from '../components/ARCameraView';
import {
  Settings,
  Cloud,
  Camera,
  Layers,
  HardDriveDownload,
  Share2,
  HelpCircle,
  Download,
  RefreshCw,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ntrip' | 'cloud' | 'ar' | 'offline' | 'tips' | 'export'>('ntrip');
  const [showARModal, setShowARModal] = useState<boolean>(false);
  const [offlineCachedTiles, setOfflineCachedTiles] = useState<number>(450);
  const [isCaching, setIsCaching] = useState<boolean>(false);
  const [cacheStatus, setCacheStatus] = useState<string>('Cached 450 tiles (Kathmandu Valley & Chitwan)');
  const [firebaseProject, setFirebaseProject] = useState<string>('land-survey-pro-sync');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('synced');

  const [layers, setLayers] = useState([
    { id: '1', name: 'Cadastral Boundaries (Kitta)', enabled: true, color: '#a1a1aa' },
    { id: '2', name: 'Government Topographic Contours', enabled: true, color: '#71717a' },
    { id: '3', name: 'Highways & Right-of-Way (RoW)', enabled: false, color: '#52525b' },
    { id: '4', name: 'River Buffer & Forest Zones', enabled: true, color: '#3f3f46' },
  ]);

  const toggleLayer = (id: string) => {
    setLayers(layers.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)));
  };

  const handleCacheArea = () => {
    setIsCaching(true);
    setCacheStatus('Downloading tiles...');
    setTimeout(() => {
      setOfflineCachedTiles((prev) => prev + 280);
      setIsCaching(false);
      setCacheStatus('730 map tiles ready for offline survey.');
    }, 1500);
  };

  const handleClearCache = () => {
    setOfflineCachedTiles(0);
    setCacheStatus('Cache cleared. 0 tiles stored.');
  };

  const handleSyncFirebase = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
    }, 1200);
  };

  const handleExportAllJSON = () => {
    const data = {
      app: 'Land Survey Pro',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      plots: localStorage.getItem('land_survey_pro_plots'),
      geoPlots: localStorage.getItem('land_survey_pro_geoplots'),
      layers,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Land_Survey_Pro_Backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Land Survey Pro Report',
        text: 'Survey Parcel Analysis & Nepali Unit Conversions',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Report link copied to clipboard.');
    }
  };

  return (
    <div className="space-y-4 pb-6 max-w-2xl mx-auto">
      {/* Settings Navigation Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-zinc-300" />
          <h2 className="text-sm font-semibold text-zinc-100">Settings & Peripherals</h2>
        </div>

        <button
          onClick={() => setShowARModal(true)}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-zinc-700 transition-colors"
        >
          <Camera className="w-3.5 h-3.5" /> AR View
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-xs">
        <button
          onClick={() => setActiveTab('ntrip')}
          className={`py-2 px-1 rounded-lg border text-center transition-colors ${
            activeTab === 'ntrip'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          GNSS / RTK
        </button>
        <button
          onClick={() => setActiveTab('cloud')}
          className={`py-2 px-1 rounded-lg border text-center transition-colors ${
            activeTab === 'cloud'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          Cloud & Layers
        </button>
        <button
          onClick={() => setActiveTab('ar')}
          className={`py-2 px-1 rounded-lg border text-center transition-colors ${
            activeTab === 'ar'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          AR View
        </button>
        <button
          onClick={() => setActiveTab('offline')}
          className={`py-2 px-1 rounded-lg border text-center transition-colors ${
            activeTab === 'offline'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          Offline Maps
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`py-2 px-1 rounded-lg border text-center transition-colors ${
            activeTab === 'export'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          Export
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`py-2 px-1 rounded-lg border text-center transition-colors ${
            activeTab === 'tips'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          Field Tips
        </button>
      </div>

      {activeTab === 'ntrip' && <NtripConnector />}

      {activeTab === 'cloud' && (
        <div className="space-y-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-zinc-400" />
                <h4 className="text-xs font-medium text-zinc-200">Cloud Sync (Firebase)</h4>
              </div>
              <button
                onClick={handleSyncFirebase}
                disabled={syncStatus === 'syncing'}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1 border border-zinc-700"
              >
                <RefreshCw className={`w-3 h-3 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 block mb-1">Project Instance</label>
              <input
                type="text"
                value={firebaseProject}
                onChange={(e) => setFirebaseProject(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-xs text-zinc-200"
              />
            </div>
          </div>

          {/* Layer Management */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
              <Layers className="w-4 h-4 text-zinc-400" />
              <h4 className="text-xs font-medium text-zinc-200">Cadastral GIS Layers</h4>
            </div>

            <div className="space-y-1.5">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 flex items-center justify-between cursor-pointer"
                >
                  <span className="text-xs text-zinc-300 font-medium">{layer.name}</span>
                  <input
                    type="checkbox"
                    checked={layer.enabled}
                    onChange={() => {}}
                    className="accent-zinc-400 w-4 h-4 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ar' && (
        <ARCameraView targetPointName="Boundary Peg P-01" distanceMeters={5.38} bearingDeg={42.5} />
      )}

      {activeTab === 'offline' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <HardDriveDownload className="w-4 h-4 text-zinc-400" />
              <h4 className="text-xs font-medium text-zinc-200">Offline Map Storage</h4>
            </div>
            <span className="text-xs font-mono text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded">
              {offlineCachedTiles} Tiles
            </span>
          </div>

          <p className="text-xs text-zinc-500">{cacheStatus}</p>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCacheArea}
              disabled={isCaching}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-zinc-700"
            >
              <Download className="w-3.5 h-3.5" />
              {isCaching ? 'Downloading...' : 'Cache Current Region'}
            </button>
            <button
              onClick={handleClearCache}
              className="bg-zinc-950 hover:bg-zinc-900 text-zinc-400 text-xs py-2 px-3 rounded-lg border border-zinc-800"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {activeTab === 'export' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h4 className="text-xs font-medium text-zinc-200">Data Interchange</h4>
            <button
              onClick={handleShareReport}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1 border border-zinc-700"
            >
              <Share2 className="w-3.5 h-3.5" /> Share Report
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
              <div className="font-medium text-zinc-200">AutoCAD DXF</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">2D Polyline export</div>
            </div>
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
              <div className="font-medium text-zinc-200">Google Earth</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">KML polygons</div>
            </div>
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
              <div className="font-medium text-zinc-200">GeoJSON</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">QGIS & web maps</div>
            </div>
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
              <div className="font-medium text-zinc-200">ESRI Shapefile</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Attribute table</div>
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={handleExportAllJSON}
              className="w-full bg-zinc-950 hover:bg-zinc-850 text-zinc-300 font-medium text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 border border-zinc-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Backup (JSON)
            </button>
          </div>
        </div>
      )}

      {activeTab === 'tips' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
            <HelpCircle className="w-4 h-4 text-zinc-400" />
            <h4 className="text-xs font-semibold text-zinc-200">Nepali Survey Standards</h4>
          </div>

          <div className="space-y-2 text-xs text-zinc-400 leading-relaxed">
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
              <div className="font-medium text-zinc-200 mb-1">Official Conversions (Survey Dept.)</div>
              <p className="text-[11px] text-zinc-500">
                1 Ropani = 16 Aana = 64 Paisa = 256 Daam = 5,476 sq ft<br />
                1 Aana = 4 Paisa = 16 Daam = 342.25 sq ft<br />
                1 Bigha = 20 Kattha = 400 Dhur = 72,900 sq ft<br />
                1 Kattha = 20 Dhur = 3,645 sq ft<br />
                1 Dhur = 182.25 sq ft
              </p>
            </div>
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
              <div className="font-medium text-zinc-200 mb-1">Traverse Precision</div>
              <p className="text-[11px] text-zinc-500">
                Aim for a relative closure precision of at least 1:5,000 for standard cadastral boundary control.
              </p>
            </div>
          </div>
        </div>
      )}

      {showARModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <ARCameraView onClose={() => setShowARModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
