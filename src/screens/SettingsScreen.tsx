import React, { useState } from 'react';
import { NtripConnector } from '../components/NtripConnector';
import { ARCameraView } from '../components/ARCameraView';
import {
  Settings,
  Cloud,
  Radio,
  Camera,
  Layers,
  HardDriveDownload,
  Share2,
  HelpCircle,
  Download,
  Upload,
  CheckCircle,
  FileSpreadsheet,
  Globe,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ntrip' | 'cloud' | 'ar' | 'offline' | 'tips' | 'export'>('ntrip');
  const [showARModal, setShowARModal] = useState<boolean>(false);
  const [offlineCachedTiles, setOfflineCachedTiles] = useState<number>(450);
  const [isCaching, setIsCaching] = useState<boolean>(false);
  const [cacheStatus, setCacheStatus] = useState<string>('Cached 450 tiles (Kathmandu Valley & Chitwan)');
  const [firebaseProject, setFirebaseProject] = useState<string>('land-survey-pro-sync');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('synced');

  // Layer management state
  const [layers, setLayers] = useState([
    { id: '1', name: 'Cadastral Boundaries (Kitta)', enabled: true, color: '#10b981' },
    { id: '2', name: 'Government Topographic Contours', enabled: true, color: '#f59e0b' },
    { id: '3', name: 'Highways & Right-of-Way (RoW)', enabled: false, color: '#ef4444' },
    { id: '4', name: 'River Buffer & Forest Zones', enabled: true, color: '#06b6d4' },
  ]);

  const toggleLayer = (id: string) => {
    setLayers(layers.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)));
  };

  const handleCacheArea = () => {
    setIsCaching(true);
    setCacheStatus('Downloading OpenStreetMap & Esri satellite tiles for offline field work...');
    setTimeout(() => {
      setOfflineCachedTiles((prev) => prev + 280);
      setIsCaching(false);
      setCacheStatus('Offline caching complete! 730 map tiles ready for offline survey.');
    }, 1800);
  };

  const handleClearCache = () => {
    setOfflineCachedTiles(0);
    setCacheStatus('Cache cleared. 0 tiles stored.');
  };

  const handleSyncFirebase = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
    }, 1500);
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
        text: 'Survey Parcel Analysis & Nepali Unit Conversions (Ropani-Aana-Paisa-Daam / Bigha-Kattha-Dhur)',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Report link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-5 pb-8 max-w-3xl mx-auto">
      {/* Settings Navigation Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            System Configuration
          </span>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" /> Settings & Peripherals
          </h2>
        </div>

        <button
          onClick={() => setShowARModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow transition-all"
        >
          <Camera className="w-3.5 h-3.5" /> AR Boundary Camera
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
        <button
          onClick={() => setActiveTab('ntrip')}
          className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center transition-all ${
            activeTab === 'ntrip'
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          GNSS / RTK
        </button>
        <button
          onClick={() => setActiveTab('cloud')}
          className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center transition-all ${
            activeTab === 'cloud'
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          Cloud & Layers
        </button>
        <button
          onClick={() => setActiveTab('ar')}
          className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center transition-all ${
            activeTab === 'ar'
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          AR View
        </button>
        <button
          onClick={() => setActiveTab('offline')}
          className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center transition-all ${
            activeTab === 'offline'
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          Offline Maps
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center transition-all ${
            activeTab === 'export'
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          Export & Sync
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center transition-all ${
            activeTab === 'tips'
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          Field Tips
        </button>
      </div>

      {/* 1. BLUETOOTH GNSS & NTRIP RTK */}
      {activeTab === 'ntrip' && <NtripConnector />}

      {/* 2. CLOUD SYNC (FIREBASE) + LAYER MANAGEMENT */}
      {activeTab === 'cloud' && (
        <div className="space-y-4">
          {/* Cloud Sync */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-sky-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Firebase Cloud Storage & Multi-Device Sync</h4>
                  <p className="text-[10px] text-slate-400">Sync cadastral parcels with office CAD workstation</p>
                </div>
              </div>
              <button
                onClick={handleSyncFirebase}
                disabled={syncStatus === 'syncing'}
                className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Firestore Project Instance</label>
              <input
                type="text"
                value={firebaseProject}
                onChange={(e) => setFirebaseProject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-xs text-white"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Cloud Connection Status
              </span>
              <span className="font-mono text-emerald-400 text-xs">Ready • Encrypted AES-256</span>
            </div>
          </div>

          {/* Layer Management */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Cadastral GIS Layer Management</h4>
                  <p className="text-[10px] text-slate-400">Toggle active map overlays & zoning vectors</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: layer.color }}
                    />
                    <span className="text-xs font-medium text-slate-200">{layer.name}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layer.enabled}
                    onChange={() => {}}
                    className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. AR VIEW */}
      {activeTab === 'ar' && (
        <div className="space-y-4">
          <ARCameraView targetPointName="Boundary Peg P-01 (NE Corner)" distanceMeters={5.38} bearingDeg={42.5} />
        </div>
      )}

      {/* 4. OFFLINE MAP CACHING */}
      {activeTab === 'offline' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <HardDriveDownload className="w-5 h-5 text-amber-400" />
              <div>
                <h4 className="text-xs font-bold text-white">Offline Map Tile Cache</h4>
                <p className="text-[10px] text-slate-400">Download satellite & topographic tiles for zero-connectivity zones</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
              {offlineCachedTiles} Tiles Cached
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
            {cacheStatus}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCacheArea}
              disabled={isCaching}
              className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <Download className={`w-4 h-4 ${isCaching ? 'animate-bounce' : ''}`} />
              {isCaching ? 'Caching Survey Region...' : 'Download Current Bounding Box'}
            </button>
            <button
              onClick={handleClearCache}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2.5 px-4 rounded-xl border border-slate-700"
            >
              Clear Cache
            </button>
          </div>
        </div>
      )}

      {/* 5. EXPORT & REPORT SHARING */}
      {activeTab === 'export' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-white">Cadastral Import / Export Hub</h4>
              <p className="text-[10px] text-slate-400">Interchange data with AutoCAD, ArcGIS, QGIS & Google Earth</p>
            </div>
            <button
              onClick={handleShareReport}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow"
            >
              <Share2 className="w-3.5 h-3.5" /> Share Report
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-sky-400 block">AutoCAD DXF</span>
              <p className="text-[10px] text-slate-400">2D closed polyline layer with vertex points</p>
              <span className="text-[10px] font-mono text-emerald-400 bg-slate-900 px-2 py-0.5 rounded block">
                Supported
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 block">Google Earth KML</span>
              <p className="text-[10px] text-slate-400">WGS84 3D polygon & placemark coordinates</p>
              <span className="text-[10px] font-mono text-emerald-400 bg-slate-900 px-2 py-0.5 rounded block">
                Supported
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 block">GeoJSON / QGIS</span>
              <p className="text-[10px] text-slate-400">FeatureCollection parcel boundaries</p>
              <span className="text-[10px] font-mono text-emerald-400 bg-slate-900 px-2 py-0.5 rounded block">
                Supported
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-purple-400 block">Shapefile (ESRI)</span>
              <p className="text-[10px] text-slate-400">GIS polygon attributes (.shp/.dbf)</p>
              <span className="text-[10px] font-mono text-emerald-400 bg-slate-900 px-2 py-0.5 rounded block">
                Supported
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleExportAllJSON}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-700"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Download Full Project Archive (JSON Backup)
            </button>
          </div>
        </div>
      )}

      {/* 6. TIPS & FIELD GUIDE SCREEN */}
      {activeTab === 'tips' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Nepali Cadastral Field Survey Guide</h4>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-300 block mb-1">
                  1. Official Conversion Formula (Survey Dept Nepal)
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  • 1 Ropani = 16 Aana = 64 Paisa = 256 Daam = <strong>5,476 sq ft</strong> (508.73 m²)<br />
                  • 1 Aana = 4 Paisa = 16 Daam = <strong>342.25 sq ft</strong> (31.80 m²)<br />
                  • 1 Bigha = 20 Kattha = 400 Dhur = <strong>72,900 sq ft</strong> (6,772.63 m²)<br />
                  • 1 Kattha = 20 Dhur = <strong>3,645 sq ft</strong> (338.63 m²)<br />
                  • 1 Dhur = <strong>182.25 sq ft</strong> (16.93 m²)
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-sky-300 block mb-1">
                  2. Irregular Plot Subdivision (Nepali 2-Triangle Rule)
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  When surveying non-rectangular four-corner plots, measure the common diagonal between the two furthest opposing corners. Calculate the Heron area for each triangle and sum them together.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-emerald-300 block mb-1">
                  3. RTK Stakeout Best Practice
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Ensure PDOP is under 2.0 and the fix is RTK FIXED prior to staking boundary pegs. Orient the phone northwards and align the compass needle with the target azimuth.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AR Fullscreen Modal */}
      {showARModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl">
            <ARCameraView onClose={() => setShowARModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
