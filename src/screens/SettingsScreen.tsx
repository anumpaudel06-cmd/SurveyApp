import React, { useState } from 'react';
import { NtripConnector } from '../components/NtripConnector';
import { ARCameraView } from '../components/ARCameraView';
import { CutFillCalculator } from '../components/CutFillCalculator';
import { StakeoutCompass } from '../components/StakeoutCompass';
import { latLngToUTM, utmToMGRS, degToDms } from '../units';
import {
  Wrench,
  Radio,
  MapPin,
  Shovel,
  Target,
  HardDriveDownload,
  HelpCircle,
  Camera,
  Share2,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'coords' | 'cutfill' | 'stakeout' | 'ntrip' | 'offline' | 'tips'>('coords');
  const [showAR, setShowAR] = useState<boolean>(false);

  // Coordinate Conversion state
  const [lat, setLat] = useState<string>('27.7172');
  const [lng, setLng] = useState<string>('85.3240');
  const numLat = parseFloat(lat) || 0;
  const numLng = parseFloat(lng) || 0;
  const utm = latLngToUTM(numLat, numLng);
  const mgrs = utmToMGRS(utm);

  // Offline caching
  const [cachedTiles, setCachedTiles] = useState<number>(450);
  const [caching, setCaching] = useState<boolean>(false);

  const handleCacheArea = () => {
    setCaching(true);
    setTimeout(() => {
      setCachedTiles((prev) => prev + 250);
      setCaching(false);
    }, 1200);
  };

  return (
    <div className="space-y-3.5 pb-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-zinc-300" /> थप नापी सुविधाहरू (Geomatics Tools)
          </h2>
          <p className="text-[10px] text-zinc-500">UTM, Cut/Fill, Stakeout, RTK & Offline Maps</p>
        </div>

        <button
          onClick={() => setShowAR(true)}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-2.5 py-1 rounded-lg border border-zinc-700 flex items-center gap-1 font-medium transition-colors"
        >
          <Camera className="w-3.5 h-3.5" /> AR View
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-xs">
        <button
          onClick={() => setActiveTab('coords')}
          className={`py-1.5 px-1 rounded-lg border text-center transition-colors ${
            activeTab === 'coords'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100 font-medium'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          UTM / MGRS
        </button>
        <button
          onClick={() => setActiveTab('cutfill')}
          className={`py-1.5 px-1 rounded-lg border text-center transition-colors ${
            activeTab === 'cutfill'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100 font-medium'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          Cut / Fill
        </button>
        <button
          onClick={() => setActiveTab('stakeout')}
          className={`py-1.5 px-1 rounded-lg border text-center transition-colors ${
            activeTab === 'stakeout'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100 font-medium'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          Stakeout
        </button>
        <button
          onClick={() => setActiveTab('ntrip')}
          className={`py-1.5 px-1 rounded-lg border text-center transition-colors ${
            activeTab === 'ntrip'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100 font-medium'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          GNSS RTK
        </button>
        <button
          onClick={() => setActiveTab('offline')}
          className={`py-1.5 px-1 rounded-lg border text-center transition-colors ${
            activeTab === 'offline'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100 font-medium'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          अफ्लाईन नक्सा
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`py-1.5 px-1 rounded-lg border text-center transition-colors ${
            activeTab === 'tips'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100 font-medium'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
          }`}
        >
          नापी नियम
        </button>
      </div>

      {/* 1. UTM / MGRS Coordinate Converter */}
      {activeTab === 'coords' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-zinc-400 block mb-0.5">Latitude (अक्षांश)</label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 block mb-0.5">Longitude (देशान्तर)</label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block">UTM Coordinates</span>
              <span className="font-mono font-bold text-zinc-200 mt-0.5 block">{utm.formatted}</span>
              <span className="text-[10px] text-zinc-500 font-mono">
                E: {utm.easting}m | N: {utm.northing}m
              </span>
            </div>

            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block">MGRS Grid</span>
              <span className="font-mono font-bold text-zinc-200 mt-0.5 block">{mgrs}</span>
              <span className="text-[10px] text-zinc-500 font-mono">
                DMS: {degToDms(numLat, true)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Cut & Fill Calculator */}
      {activeTab === 'cutfill' && <CutFillCalculator />}

      {/* 3. Stakeout Compass */}
      {activeTab === 'stakeout' && <StakeoutCompass />}

      {/* 4. GNSS RTK */}
      {activeTab === 'ntrip' && <NtripConnector />}

      {/* 5. Offline Maps */}
      {activeTab === 'offline' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div>
              <h4 className="font-medium text-zinc-200">अफ्लाईन नक्सा क्यास (Offline Maps)</h4>
              <p className="text-[10px] text-zinc-500">इन्टरनेट नहुने ठाउँमा नक्सा प्रयोग गर्न</p>
            </div>
            <span className="font-mono font-bold text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded">
              {cachedTiles} Tiles
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCacheArea}
              disabled={caching}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 py-2 rounded-lg font-medium border border-zinc-700 transition-colors"
            >
              {caching ? 'डाउनलोड हुँदैछ...' : 'हालको क्षेत्र क्यास गर्नुहोस् (Download)'}
            </button>
            <button
              onClick={() => setCachedTiles(0)}
              className="bg-zinc-950 hover:bg-zinc-850 text-zinc-400 py-2 px-3 rounded-lg border border-zinc-800"
            >
              हटाउनुहोस्
            </button>
          </div>
        </div>
      )}

      {/* 6. Survey Rules & Standards */}
      {activeTab === 'tips' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm text-xs leading-relaxed">
          <div className="flex items-center gap-1.5 pb-2 border-b border-zinc-800">
            <HelpCircle className="w-4 h-4 text-zinc-300" />
            <h4 className="font-semibold text-zinc-200">नेपाल नापी विभाग आधिकारिक मापदण्ड</h4>
          </div>

          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 space-y-1">
            <div className="font-semibold text-zinc-200">१. पहाडी प्रणाली (Hill System):</div>
            <p className="text-zinc-400 text-[11px]">
              • १ रोपनी = १६ आना = ६४ पैसा = २५६ दाम = <strong>५,४७६ वर्ग फिट</strong> (५०८.७३ वर्ग मिटर)<br />
              • १ आना = ४ पैसा = १६ दाम = <strong>३४२.२५ वर्ग फिट</strong><br />
              • १ पैसा = ४ दाम = <strong>८५.५६ वर्ग फिट</strong><br />
              • १ दाम = <strong>२१.३९ वर्ग फिट</strong>
            </p>
          </div>

          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 space-y-1">
            <div className="font-semibold text-zinc-200">२. तराई प्रणाली (Terai System):</div>
            <p className="text-zinc-400 text-[11px]">
              • १ बिघा = २० कट्ठा = ४०० धुर = <strong>७२,९०० वर्ग फिट</strong> (६,७७२.६३ वर्ग मिटर)<br />
              • १ कट्ठा = २० धुर = <strong>३,६४५ वर्ग फिट</strong><br />
              • १ धुर = <strong>१८२.२५ वर्ग फिट</strong>
            </p>
          </div>

          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 space-y-1">
            <div className="font-semibold text-zinc-200">३. परम्परागत लम्बाई एकाइहरू:</div>
            <p className="text-zinc-400 text-[11px]">
              • १ हात = १.५ फिट (१८ इन्च = ०.४५७२ मिटर)<br />
              • १ गज = ३ फिट (३६ इन्च = १ यार्ड = ०.९१४४ मिटर)<br />
              • १ चेन = ६६ फिट (१०० लिंक्स)
            </p>
          </div>
        </div>
      )}

      {/* AR Modal */}
      {showAR && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <ARCameraView onClose={() => setShowAR(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
