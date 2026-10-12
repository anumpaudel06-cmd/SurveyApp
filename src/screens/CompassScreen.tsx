import React, { useState, useEffect, useRef } from 'react';
import {
  bearingToDms,
  calculateForwardAzimuthAndDistance,
  degToDms,
  GeoPoint,
} from '../units';
import {
  Compass as CompassIcon,
  Navigation,
  MapPin,
  Lock,
  Unlock,
  AlertTriangle,
  Info,
  RotateCcw,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ShieldAlert,
  Layers,
} from 'lucide-react';

export const CompassScreen: React.FC = () => {
  // Live Heading / Bearing (0 to 360)
  const [rawHeading, setRawHeading] = useState<number>(45.5);
  const [dampedHeading, setDampedHeading] = useState<number>(45.5);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lockedHeading, setLockedHeading] = useState<number | null>(null);

  // Tilt orientation (Pitch & Roll for spirit level)
  const [pitch, setPitch] = useState<number>(0); // tilt front-to-back
  const [roll, setRoll] = useState<number>(0);  // tilt left-to-right

  // Magnetic vs True North
  const [northMode, setNorthMode] = useState<'magnetic' | 'true'>('magnetic');
  const [declinationDeg, setDeclinationDeg] = useState<number>(0.25); // East positive

  // GPS Location (offline capability)
  const [gpsLocation, setGpsLocation] = useState<GeoPoint>({ lat: 27.71724, lng: 85.32402 });
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(3.5);
  const [gpsAltitude, setGpsAltitude] = useState<number | null>(1350);
  const [gpsStatus, setGpsStatus] = useState<'active' | 'locating' | 'cached' | 'denied'>('active');

  // Offline Target Bearing ("Bearing of Any Place")
  const [showTargetTool, setShowTargetTool] = useState<boolean>(false);
  const [targetLat, setTargetLat] = useState<string>('27.70076');
  const [targetLng, setTargetLng] = useState<string>('85.30014');
  const [targetName, setTargetName] = useState<string>('Kathmandu Durbar Benchmark');

  // Diagnostics & Sensor states
  const [sensorAvailable, setSensorAvailable] = useState<boolean>(true);
  const [showDisclaimers, setShowDisclaimers] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const prevAngleRef = useRef<number>(45.5);

  // 1. Live Device Orientation Listener with Low-Pass Filter
  useEffect(() => {
    let watchId: number | null = null;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (isLocked) return;

      let heading: number | null = null;

      // iOS compass heading (True or Magnetic)
      if ('webkitCompassHeading' in e && typeof (e as any).webkitCompassHeading === 'number') {
        heading = (e as any).webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Android / Standard alpha (counter-clockwise from North)
        heading = (360 - e.alpha) % 360;
      }

      if (heading !== null && !isNaN(heading)) {
        setSensorAvailable(true);
        setRawHeading(heading);

        // Low-pass exponential smoothing filter for liquid dampening
        let diff = heading - prevAngleRef.current;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        const smoothed = (prevAngleRef.current + diff * 0.25 + 360) % 360;
        prevAngleRef.current = smoothed;
        setDampedHeading(smoothed);
      }

      if (e.beta !== null) setPitch(e.beta);
      if (e.gamma !== null) setRoll(e.gamma);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    // 2. Offline GPS Watcher
    if (navigator.geolocation) {
      setGpsStatus('locating');
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setGpsLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setGpsAccuracy(pos.coords.accuracy);
          if (pos.coords.altitude !== null) {
            setGpsAltitude(Math.round(pos.coords.altitude));
          }
          setGpsStatus('active');
        },
        () => {
          // If denied or indoors, use cached location without blocking
          setGpsStatus('cached');
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 8000 }
      );
    }

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isLocked]);

  // Active observed heading (Magnetic)
  const activeMagHeading = isLocked && lockedHeading !== null ? lockedHeading : dampedHeading;

  // If True North mode is selected: True = Magnetic + Declination
  const activeObservedHeading =
    northMode === 'true'
      ? (activeMagHeading + declinationDeg + 360) % 360
      : activeMagHeading;

  // Degrees, Minutes, Seconds calculation
  const dmsResult = bearingToDms(activeObservedHeading);

  // Back Bearing (FB ± 180°)
  const backBearingDeg = (activeObservedHeading + 180) % 360;
  const backBearingDms = bearingToDms(backBearingDeg);

  // Tilt Calculation (magnitude of tilt off horizontal)
  const tiltMagnitude = Math.sqrt(pitch * pitch + roll * roll);
  const isTilted = tiltMagnitude > 4.5; // Greater than 4.5° tilt affects prismatic reading

  // Offline Target Calculation
  const parsedTargetLat = parseFloat(targetLat) || 0;
  const parsedTargetLng = parseFloat(targetLng) || 0;
  const targetAzimuth = calculateForwardAzimuthAndDistance(gpsLocation, {
    lat: parsedTargetLat,
    lng: parsedTargetLng,
  });

  // Toggle Sighting Lock (Prismatic Brake Pin)
  const toggleLock = () => {
    if (!isLocked) {
      setLockedHeading(dampedHeading);
      setIsLocked(true);
    } else {
      setIsLocked(false);
      setLockedHeading(null);
    }
  };

  // Manual Adjuster for Testing / Desktop or Calibration
  const adjustManual = (delta: number) => {
    const next = (activeMagHeading + delta + 360) % 360;
    setRawHeading(next);
    setDampedHeading(next);
    if (isLocked) setLockedHeading(next);
  };

  const copyBearing = () => {
    const text = `Prismatic Compass Survey Reading:
• Bearing (DMS): ${dmsResult.formatted}
• Bearing (Decimal): ${activeObservedHeading.toFixed(3)}°
• Reduced Bearing: ${dmsResult.quadrant}
• Back Bearing: ${backBearingDms.formatted} (${backBearingDeg.toFixed(3)}°)
• North Reference: ${northMode.toUpperCase()} (Declination: ${declinationDeg > 0 ? '+' : ''}${declinationDeg}°)
• Offline Coordinates: ${gpsLocation.lat.toFixed(6)}, ${gpsLocation.lng.toFixed(6)}
• Lat (DMS): ${degToDms(gpsLocation.lat, true)}
• Lng (DMS): ${degToDms(gpsLocation.lng, false)}
• GPS Accuracy: ±${gpsAccuracy ? gpsAccuracy.toFixed(1) : '3.0'} m`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 pb-8 max-w-xl mx-auto">
      {/* 1. Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <CompassIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>Prismatic Compass & Survey Bearing</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono font-medium">
                Offline
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              High Precision DMS • Sighting Reticle • GPS Coordinates • Tilt Level
            </p>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={copyBearing}
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-medium flex items-center gap-1 transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* 2. PRIMARY BEARING DISPLAY CARD (Degree Minute Second) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Observed Fore Bearing (W.C.B.)
            </span>
            {isLocked && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-medium flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                <span>Locked (Brake Pin)</span>
              </span>
            )}
          </div>

          {/* North Mode Toggle: Magnetic vs True */}
          <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-950">
            <button
              onClick={() => setNorthMode('magnetic')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                northMode === 'magnetic'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Magnetic North
            </button>
            <button
              onClick={() => setNorthMode('true')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                northMode === 'true'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              True North
            </button>
          </div>
        </div>

        {/* PROMINENT DEGREE MINUTE SECOND (DMS) DISPLAY */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex flex-col items-center justify-center text-center space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            Degree Minute Second (DMS)
          </span>
          <div className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-blue-600 dark:text-blue-400">
            {dmsResult.formatted}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono pt-1 text-slate-600 dark:text-slate-400">
            <span>Decimal: <b>{activeObservedHeading.toFixed(3)}°</b></span>
            <span>•</span>
            <span>Reduced (Q.B.): <b>{dmsResult.quadrant}</b></span>
          </div>
        </div>

        {/* Back Bearing & Quadrant Info Strip */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 block">Back Bearing (B.B.)</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">{backBearingDms.formatted}</span>
            <span className="text-[10px] text-slate-400 block">{backBearingDeg.toFixed(2)}° (FB ± 180°)</span>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 block">Declination Correction</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {declinationDeg > 0 ? `+${declinationDeg}° E` : `${declinationDeg}° W`}
            </span>
            <span className="text-[10px] text-slate-400 block">
              {northMode === 'true' ? 'Applied to True North' : 'Raw Magnetic'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. AUTHENTIC PRISMATIC COMPASS DIAL & SIGHTING RETICLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col items-center justify-center space-y-3">
        {/* Sighting Lubber Line & Sighting Hairline Indicator */}
        <div className="flex items-center justify-between w-full text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-medium text-slate-700 dark:text-slate-300">Target Sighting Line</span>
          </div>

          {/* Sighting Lock Button (Prismatic Brake Pin) */}
          <button
            onClick={toggleLock}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs ${
              isLocked
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900'
            }`}
          >
            {isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{isLocked ? 'Release Sighting' : 'Hold / Sight Bearing'}</span>
          </button>
        </div>

        {/* PRISMATIC COMPASS CIRCULAR DIAL */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-slate-800 dark:border-slate-700 bg-slate-950 flex items-center justify-center select-none shadow-lg overflow-hidden">
          {/* Top Sighting Index Mark / Lubber Line */}
          <div className="absolute top-0 z-30 flex flex-col items-center">
            <div className="w-1 h-4 bg-red-500 rounded-b shadow-sm" />
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-red-500" />
          </div>

          {/* Sighting Crosshair Hair-Line (Authentic Surveying Sighting Wire) */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Vertical hair */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-red-500/40 -translate-x-1/2" />
            {/* Horizontal hair */}
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-red-500/40 -translate-y-1/2" />
          </div>

          {/* Rotating Graduated Ring (Graduated in inverted/prismatic orientation 0-360) */}
          <div
            className="absolute w-56 h-56 sm:w-60 sm:h-60 rounded-full border border-slate-700 transition-transform duration-100 ease-out flex items-center justify-center"
            style={{ transform: `rotate(${-activeObservedHeading}deg)` }}
          >
            {/* Degree Markings around perimeter */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
              const rad = ((deg - 90) * Math.PI) / 180;
              const r = 95;
              const x = r * Math.cos(rad);
              const y = r * Math.sin(rad);

              let label = `${deg}°`;
              let isCardinal = false;
              let cardinalColor = 'text-slate-400';
              if (deg === 0) {
                label = 'N';
                isCardinal = true;
                cardinalColor = 'text-red-500 font-bold';
              } else if (deg === 90) {
                label = 'E';
                isCardinal = true;
                cardinalColor = 'text-slate-200 font-bold';
              } else if (deg === 180) {
                label = 'S';
                isCardinal = true;
                cardinalColor = 'text-blue-400 font-bold';
              } else if (deg === 270) {
                label = 'W';
                isCardinal = true;
                cardinalColor = 'text-slate-200 font-bold';
              }

              return (
                <div
                  key={`mark-${deg}`}
                  className="absolute text-[10px] font-mono select-none"
                  style={{
                    transform: `translate(${x}px, ${y}px) rotate(${deg}deg)`,
                  }}
                >
                  <span className={`${cardinalColor} ${isCardinal ? 'text-xs' : 'text-[9px]'}`}>
                    {label}
                  </span>
                </div>
              );
            })}

            {/* Minor Tick Marks */}
            {Array.from({ length: 72 }).map((_, i) => {
              const deg = i * 5;
              const isMajor = deg % 30 === 0;
              return (
                <div
                  key={`tick-${deg}`}
                  className="absolute top-1 left-1/2 -translate-x-1/2 origin-bottom h-1/2 flex flex-col justify-start"
                  style={{ transform: `rotate(${deg}deg)` }}
                >
                  <div
                    className={`w-[1px] bg-slate-500 ${
                      isMajor ? 'h-3 bg-slate-300' : deg % 10 === 0 ? 'h-2 bg-slate-400' : 'h-1 bg-slate-600'
                    }`}
                  />
                </div>
              );
            })}

            {/* Inner Needle / Compass Rose */}
            <div className="relative w-28 h-28 flex items-center justify-center pointer-events-none">
              {/* North Pointer (Red) */}
              <div className="absolute top-0 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[48px] border-b-red-600 drop-shadow-md" />
              {/* South Pointer (Silver/Blue) */}
              <div className="absolute bottom-0 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[48px] border-t-slate-400 drop-shadow-md" />
              {/* Center Pivot Jewel */}
              <div className="w-5 h-5 rounded-full bg-slate-200 border-2 border-slate-700 shadow-inner z-20" />
            </div>
          </div>

          {/* Circular Spirit Bubble Level (Bullseye Level Indicator) */}
          <div
            className="absolute bottom-2 right-2 w-12 h-12 rounded-full border border-slate-600 bg-slate-900/90 flex items-center justify-center z-20 shadow-md"
            title="Spirit Bubble Level: Keep bubble centered for precision"
          >
            {/* Center target ring */}
            <div className="w-4 h-4 rounded-full border border-emerald-500/60" />
            {/* Fluid Bubble */}
            <div
              className={`w-3 h-3 rounded-full shadow-sm transition-transform duration-100 ${
                isTilted ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{
                transform: `translate(${Math.max(-14, Math.min(14, roll * 1.2))}px, ${Math.max(
                  -14,
                  Math.min(14, pitch * 1.2)
                )}px)`,
              }}
            />
          </div>
        </div>

        {/* Manual Stepper Adjustment (For fine calibration or desktop use) */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
          <span className="text-[10px] text-slate-400">Manual / Calibration:</span>
          <button
            onClick={() => adjustManual(-5)}
            className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-mono text-[11px]"
          >
            -5°
          </button>
          <button
            onClick={() => adjustManual(-1)}
            className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-mono text-[11px]"
          >
            -1°
          </button>
          <button
            onClick={() => adjustManual(+1)}
            className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-mono text-[11px]"
          >
            +1°
          </button>
          <button
            onClick={() => adjustManual(+5)}
            className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-mono text-[11px]"
          >
            +5°
          </button>
        </div>
      </div>

      {/* 4. OFFLINE GPS LATITUDE & LONGITUDE COORDINATES */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Offline GPS Location Coordinates
            </span>
          </div>

          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
              gpsStatus === 'active'
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {gpsStatus === 'active' ? `Fix: ±${gpsAccuracy ? gpsAccuracy.toFixed(1) : '3.0'}m` : 'Cached Offline'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Latitude */}
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 block">Latitude</span>
            <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
              {degToDms(gpsLocation.lat, true)}
            </div>
            <span className="font-mono text-[10px] text-slate-400">
              Decimal: {gpsLocation.lat.toFixed(6)}°
            </span>
          </div>

          {/* Longitude */}
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 block">Longitude</span>
            <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
              {degToDms(gpsLocation.lng, false)}
            </div>
            <span className="font-mono text-[10px] text-slate-400">
              Decimal: {gpsLocation.lng.toFixed(6)}°
            </span>
          </div>
        </div>

        {gpsAltitude && (
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono px-1">
            <span>Elevation: {gpsAltitude} m above MSL</span>
            <span>Works 100% offline with onboard GNSS</span>
          </div>
        )}
      </div>

      {/* 5. BEARING TO ANY PLACE OFFLINE (TARGET BEARING) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs space-y-2.5">
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setShowTargetTool(!showTargetTool)}
        >
          <div className="flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-blue-600" />
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                Calculate Bearing to Any Place (Offline Geodesic Azimuth)
              </span>
              <span className="text-[10px] text-slate-500">
                Enter target coordinates to compute exact forward bearing in DMS
              </span>
            </div>
          </div>
          {showTargetTool ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>

        {showTargetTool && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                  Target Latitude (Decimal)
                </label>
                <input
                  type="number"
                  step="any"
                  value={targetLat}
                  onChange={(e) => setTargetLat(e.target.value)}
                  className="w-full px-2 py-1 rounded text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  placeholder="27.70076"
                />
              </div>

              <div>
                <label className="text-[10px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                  Target Longitude (Decimal)
                </label>
                <input
                  type="number"
                  step="any"
                  value={targetLng}
                  onChange={(e) => setTargetLng(e.target.value)}
                  className="w-full px-2 py-1 rounded text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  placeholder="85.30014"
                />
              </div>
            </div>

            {/* Target Bearing Result */}
            <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-medium text-blue-700 dark:text-blue-300 block">
                  Forward Bearing to Target (DMS)
                </span>
                <div className="text-xl font-mono font-bold text-blue-900 dark:text-blue-100">
                  {targetAzimuth.dms}
                </div>
                <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400">
                  {targetAzimuth.azimuthDeg.toFixed(2)}° ({targetAzimuth.quadrant})
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Distance</span>
                <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">
                  {targetAzimuth.distanceMeters > 1000
                    ? `${(targetAzimuth.distanceMeters / 1000).toFixed(2)} km`
                    : `${targetAzimuth.distanceMeters.toFixed(1)} m`}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. WHAT IS AFFECTING THE BEARING (DISCLAIMERS & ERROR DIAGNOSTICS) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs space-y-3">
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setShowDisclaimers(!showDisclaimers)}
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Bearing Accuracy Diagnostics & Potential Errors
            </h3>
          </div>
          {showDisclaimers ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>

        {showDisclaimers && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
            {/* Tilt Error Warning */}
            {isTilted && (
              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">
                    Device Tilt Detected ({tiltMagnitude.toFixed(1)}° off horizontal)
                  </span>
                  <span className="text-[11px]">
                    In a physical prismatic compass, tilting causes the magnetic needle to rub against the glass, inducing significant bearing error. Place the phone flat on your palm and center the green spirit bubble.
                  </span>
                </div>
              </div>
            )}

            {/* Detailed Survey Disclaimer Items */}
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  1. Local Magnetic Attraction (Metal Interference)
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Magnetic phone cases, steel rebar in concrete slabs, steel survey arrows/ranging rods, high-voltage electric transmission cables, and metal vehicles distort the Earth’s natural magnetic field. Always maintain a minimum 3-5 meter clearance from steel structures for engineering precision.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  2. Figure-8 Magnetometer Calibration
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  To calibrate your mobile phone magnetometer sensor, hold the phone and wave it smoothly in a slow <b>figure-8 pattern (∞)</b> in the air for 5-10 seconds. This resets the 3-axis magnetometer bias.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  3. Magnetic Declination (True vs Magnetic North)
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  A magnetic prismatic compass reads bearings referenced to Magnetic North. For engineering surveys and GIS alignment, adjust for local magnetic declination (True Bearing = Magnetic Bearing + Declination) using the True North toggle above.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
