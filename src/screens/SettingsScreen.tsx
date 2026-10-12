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
  Check,
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
    <div className="space-y-3 pb-8 max-w-xl mx-auto">
      {/* 1. Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-slate-700" />
            <span>Survey Tools & Settings (सर्भे औजार तथा सेटिङ्स)</span>
          </h2>
          <p className="text-[11px] text-slate-500">
            Coordinates, Cut/Fill, Stakeout, RTK Client & Offline Maps
          </p>
        </div>

        <button
          onClick={() => setShowAR(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>AR Camera</span>
        </button>
      </div>

      {showAR && <ARCameraView onClose={() => setShowAR(false)} targetPointName="Boundary Peg P1" distanceMeters={14.8} />}

      {/* 2. Sub-tab Buttons */}
      <div className="bg-white border border-slate-200 rounded-xl p-1.5 shadow-xs grid grid-cols-3 sm:grid-cols-6 gap-1 text-xs font-medium">
        <button
          onClick={() => setActiveTab('coords')}
          className={`py-1.5 px-1 rounded-lg text-center transition-colors ${
            activeTab === 'coords' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Coords (निर्देशाङ्क)
        </button>

        <button
          onClick={() => setActiveTab('cutfill')}
          className={`py-1.5 px-1 rounded-lg text-center transition-colors ${
            activeTab === 'cutfill' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Cut/Fill (माटो)
        </button>

        <button
          onClick={() => setActiveTab('stakeout')}
          className={`py-1.5 px-1 rounded-lg text-center transition-colors ${
            activeTab === 'stakeout' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Stakeout (नेभिगेसन)
        </button>

        <button
          onClick={() => setActiveTab('ntrip')}
          className={`py-1.5 px-1 rounded-lg text-center transition-colors ${
            activeTab === 'ntrip' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          RTK GNSS
        </button>

        <button
          onClick={() => setActiveTab('offline')}
          className={`py-1.5 px-1 rounded-lg text-center transition-colors ${
            activeTab === 'offline' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Offline (अफलाइन)
        </button>

        <button
          onClick={() => setActiveTab('tips')}
          className={`py-1.5 px-1 rounded-lg text-center transition-colors ${
            activeTab === 'tips' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Field Tips (सुझाव)
        </button>
      </div>

      {/* 3. TAB 1: COORDINATE CONVERSION */}
      {activeTab === 'coords' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-slate-700" />
            <div>
              <span className="text-xs font-semibold text-slate-800">
                Coordinate Conversion (निर्देशाङ्क रूपान्तरण)
              </span>
              <p className="text-[11px] text-slate-500">
                WGS84 Lat/Lng, UTM Projection (Zone 44N & 45N Nepal), MGRS, DMS
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Latitude - अक्षांश (Decimal °)
              </label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Longitude - देशान्तर (Decimal °)
              </label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">
                UTM Projection (युटिएम)
              </span>
              <div className="font-mono font-bold text-slate-900 text-sm">
                {utm.formatted}
              </div>
              <div className="text-[11px] text-slate-600 font-mono">
                E: {utm.easting.toLocaleString()} m | N: {utm.northing.toLocaleString()} m
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">
                DMS (डिग्री-मिनेट-सेकेन्ड)
              </span>
              <div className="font-mono font-bold text-slate-900 text-xs">
                {degToDms(numLat, true)}
              </div>
              <div className="font-mono font-bold text-slate-900 text-xs">
                {degToDms(numLng, false)}
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">
                MGRS Military Grid (एमजीआरएस)
              </span>
              <div className="font-mono font-bold text-slate-900 text-sm">
                {mgrs}
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">
                Nepal Geodetic Grid
              </span>
              <div className="text-[11px] text-slate-700">
                MUTM Zone 44N (West) / Zone 45N (East)
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Central Meridian: 84°E / 87°E
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: CUT/FILL */}
      {activeTab === 'cutfill' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <CutFillCalculator />
        </div>
      )}

      {/* 5. TAB 3: STAKEOUT */}
      {activeTab === 'stakeout' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <StakeoutCompass />
        </div>
      )}

      {/* 6. TAB 4: NTRIP RTK */}
      {activeTab === 'ntrip' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <NtripConnector />
        </div>
      )}

      {/* 7. TAB 5: OFFLINE MAPS */}
      {activeTab === 'offline' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <HardDriveDownload className="w-4 h-4 text-slate-700" />
            <div>
              <span className="text-xs font-semibold text-slate-800">
                Offline Map Storage (अफलाइन नक्सा सुरक्षित गर्ने)
              </span>
              <p className="text-[11px] text-slate-500">
                Save cadastral satellite & terrain tiles for remote areas without internet
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <div className="font-semibold text-slate-900">Current Cached Tiles (भण्डारित नक्सा)</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{cachedTiles} Tiles stored locally</div>
            </div>
            <button
              onClick={handleCacheArea}
              disabled={caching}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors"
            >
              {caching ? 'Caching...' : 'Download Current Region'}
            </button>
          </div>

          <div className="text-[11px] text-slate-500 leading-relaxed">
            Downloaded tiles work fully offline in deep valleys, hilly terraces, and remote survey sites across Nepal without mobile network.
          </div>
        </div>
      )}

      {/* 8. TAB 6: SURVEY TIPS */}
      {activeTab === 'tips' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <HelpCircle className="w-4 h-4 text-slate-700" />
            <div>
              <span className="text-xs font-semibold text-slate-800">
                Cadastral Survey Field Guide (अमिन तथा नापी निर्देशिका)
              </span>
              <p className="text-[11px] text-slate-500">
                Standard methods for measuring land in Nepal
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-0.5">
                1. Diagonal Triangulation (विकर्ण नाप विधि)
              </h4>
              <p>
                ४ कुने जग्गा नाप्दा सधैं ४ वटै बाहिरी सीमा भुजा र कम्तीमा १ वटा छड्के विकर्ण (diagonal) नाप्नुपर्दछ। यसले जग्गालाई २ वटा त्रिभुजमा विभाजन गरी हेरोन्स सूत्र (Heron's Formula) बाट सही क्षेत्रफल दिन्छ।
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-0.5">
                2. Boundary Road & Footprint Deduction (बाटो र घर कटाउने)
              </h4>
              <p>
                जग्गा प्लटिङ गर्दा वा घर नक्सापास गर्दा बाटोको लागि छाडिएको जग्गा (राइट अफ वे) र घरले ओगटेको क्षेत्रफल सिधै घटाउन सकिन्छ।
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-0.5">
                3. Bowditch vs Transit Rule (बाउडिच र ट्रान्जिट नियम)
              </h4>
              <p>
                टोटल स्टेशन वा इलेक्ट्रोनिक दूरी मापन (EDM) प्रयोग गर्दा कोण र दूरी दुवैमा बराबर त्रुटि सम्भावना हुने भएकाले बाउडिच नियम (Compass Rule) प्रयोग गरिन्छ। फित्ता नाप र थिओडोलाइट प्रयोग गर्दा ट्रान्जिट नियम प्रयोग गर्न सकिन्छ।
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
