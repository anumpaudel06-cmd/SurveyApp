import React, { useState } from 'react';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { NtripConnector } from '../components/NtripConnector';
import { ARCameraView } from '../components/ARCameraView';
import { CutFillCalculator } from '../components/CutFillCalculator';
import { StakeoutCompass } from '../components/StakeoutCompass';
import { latLngToUTM, utmToMGRS, degToDms } from '../units';
import {
  Wrench,
  Sun,
  Moon,
  Laptop,
  MapPin,
  HardDriveDownload,
  HelpCircle,
  Camera,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'theme' | 'coords' | 'cutfill' | 'stakeout' | 'ntrip' | 'offline' | 'tips'>('theme');
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <span>Settings & Survey Utilities</span>
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Theme Modes, Coordinates, Cut/Fill, Stakeout & RTK GNSS
          </p>
        </div>

        <button
          onClick={() => setShowAR(true)}
          className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>AR Camera</span>
        </button>
      </div>

      {showAR && <ARCameraView onClose={() => setShowAR(false)} targetPointName="Boundary Peg P1" distanceMeters={14.8} />}

      {/* 2. Sub-tab Buttons */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-xs grid grid-cols-3 sm:grid-cols-6 gap-1 text-xs font-medium">
        <button
          onClick={() => setActiveTab('theme')}
          className={`py-1.5 px-1 rounded-lg text-center transition-colors ${
            activeTab === 'theme'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Theme
        </button>

        <button
          onClick={() => setActiveTab('coords')}
          className={`py-1.5 px-1 rounded-lg text-center transition-colors ${
            activeTab === 'coords'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Coordinates
        </button>

        <button
          onClick={() => setActiveTab('cutfill')}
          className={`py-1.5 px-1 rounded-lg text-center transition-colors ${
            activeTab === 'cutfill'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Cut / Fill
        </button>

        <button
          onClick={() => setActiveTab('stakeout')}
          className={`py-1.5 px-1 rounded-lg text-center transition-colors ${
            activeTab === 'stakeout'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Stakeout
        </button>

        <button
          onClick={() => setActiveTab('ntrip')}
          className={`py-1.5 px-1 rounded-lg text-center transition-colors ${
            activeTab === 'ntrip'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          RTK GNSS
        </button>

        <button
          onClick={() => setActiveTab('offline')}
          className={`py-1.5 px-1 rounded-lg text-center transition-colors ${
            activeTab === 'offline'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Offline
        </button>
      </div>

      {/* 3. TAB 1: THEME SETTINGS (LIGHT / DARK / SYSTEM) */}
      {activeTab === 'theme' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3.5">
          <div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Appearance Theme
            </span>
            <p className="text-[11px] text-slate-500">
              Select your preferred visual style (high-contrast, minimal, no neon)
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Light Mode */}
            <button
              onClick={() => setTheme('light')}
              className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1.5 text-xs font-medium transition-all ${
                theme === 'light'
                  ? 'border-slate-900 bg-slate-100 text-slate-950 font-semibold ring-1 ring-slate-900'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <Sun className="w-5 h-5 text-amber-500" />
              <span>Light Mode</span>
            </button>

            {/* Dark Mode */}
            <button
              onClick={() => setTheme('dark')}
              className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1.5 text-xs font-medium transition-all ${
                theme === 'dark'
                  ? 'border-slate-100 bg-slate-800 text-white font-semibold ring-1 ring-slate-100'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <Moon className="w-5 h-5 text-blue-400" />
              <span>Dark Mode</span>
            </button>

            {/* System Mode */}
            <button
              onClick={() => setTheme('system')}
              className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1.5 text-xs font-medium transition-all ${
                theme === 'system'
                  ? 'border-slate-900 dark:border-slate-100 bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white font-semibold ring-1 ring-slate-900 dark:ring-slate-100'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <Laptop className="w-5 h-5 text-slate-500" />
              <span>System Theme</span>
            </button>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400">
            Current mode: <b className="capitalize text-slate-900 dark:text-slate-100">{theme}</b>. Designed for clear outdoor contrast under direct sunlight with minimal battery consumption.
          </div>
        </div>
      )}

      {/* 4. TAB 2: COORDINATE CONVERSION */}
      {activeTab === 'coords' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <MapPin className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Coordinate Conversion
              </span>
              <p className="text-[11px] text-slate-500">
                WGS84 Lat/Lng, UTM Projection (Zone 44N & 45N), MGRS, DMS
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Latitude (Decimal °)
              </label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-mono font-bold text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Longitude (Decimal °)
              </label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-mono font-bold text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">
                UTM Projection
              </span>
              <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                {utm.formatted}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                E: {utm.easting.toLocaleString()} m | N: {utm.northing.toLocaleString()} m
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">
                Degrees Minutes Seconds (DMS)
              </span>
              <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
                {degToDms(numLat, true)}
              </div>
              <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
                {degToDms(numLng, false)}
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">
                MGRS Military Grid
              </span>
              <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                {mgrs}
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">
                Geodetic Datum
              </span>
              <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                WGS84 / Everest 1830 Datum
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Central Meridian: 84°E / 87°E
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: CUT/FILL */}
      {activeTab === 'cutfill' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <CutFillCalculator />
        </div>
      )}

      {/* 6. TAB 4: STAKEOUT */}
      {activeTab === 'stakeout' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <StakeoutCompass />
        </div>
      )}

      {/* 7. TAB 5: NTRIP RTK */}
      {activeTab === 'ntrip' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <NtripConnector />
        </div>
      )}

      {/* 8. TAB 6: OFFLINE MAPS */}
      {activeTab === 'offline' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <HardDriveDownload className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Offline Map Storage
              </span>
              <p className="text-[11px] text-slate-500">
                Save satellite & terrain tiles for remote survey sites without internet
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">Cached Map Tiles</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{cachedTiles} Tiles stored locally</div>
            </div>
            <button
              onClick={handleCacheArea}
              disabled={caching}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-medium transition-colors"
            >
              {caching ? 'Caching...' : 'Download Current Area'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
