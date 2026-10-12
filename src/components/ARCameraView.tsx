import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Eye, ShieldAlert, Crosshair, ArrowUp, Compass } from 'lucide-react';

interface ARCameraViewProps {
  onClose?: () => void;
  targetPointName?: string;
  distanceMeters?: number;
  bearingDeg?: number;
}

export const ARCameraView: React.FC<ARCameraViewProps> = ({
  onClose,
  targetPointName = 'Corner Pin P-04',
  distanceMeters = 8.42,
  bearingDeg = 48.2,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(45);
  const [devicePitch, setDevicePitch] = useState<number>(0);

  // Initialize camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCam = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' } },
            audio: false,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasCamera(true);
          }
        } else {
          setCameraError('Camera API not accessible in this environment. AR Simulation active.');
        }
      } catch (err: any) {
        setCameraError(err?.message || 'Camera permission denied. Using high-fidelity survey simulation.');
      }
    };

    startCam();

    // Listen to orientation if available
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) setDeviceHeading(e.alpha);
      if (e.beta !== null) setDevicePitch(e.beta - 90);
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[450px] bg-black rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col justify-between">
      {/* Real Video or Simulated AR Background */}
      {hasCamera ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-emerald-950/20 to-slate-950 flex items-center justify-center">
          {/* Simulated 3D Ground Mesh */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(to right, #059669 1px, transparent 1px), linear-gradient(to bottom, #059669 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              perspective: '600px',
              transform: 'rotateX(60deg)',
              transformOrigin: 'bottom',
            }}
          />
          <div className="text-center p-6 text-slate-400 z-10 max-w-sm">
            <Camera className="w-10 h-10 mx-auto text-emerald-400 mb-2 animate-pulse" />
            <div className="text-xs font-semibold text-slate-300">AR Boundary Camera Mode</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {cameraError || 'Align surveyor target pin through live optical viewfinder'}
            </div>
          </div>
        </div>
      )}

      {/* AR HUD Overlay: Top Bar */}
      <div className="relative z-10 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold tracking-wide uppercase text-emerald-400 font-mono">
            AR Boundary Locked
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono bg-black/60 px-2 py-0.5 rounded border border-white/20">
            Azimuth {bearingDeg.toFixed(1)}°
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="text-xs bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-600 text-slate-200"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Center AR Crosshair & Projected Peg */}
      <div className="relative z-10 self-center flex flex-col items-center pointer-events-none">
        {/* Optical Crosshair */}
        <div className="relative w-28 h-28 border border-emerald-400/50 rounded-full flex items-center justify-center">
          <div className="w-1 h-3 bg-emerald-400 absolute top-0 -translate-y-1/2" />
          <div className="w-1 h-3 bg-emerald-400 absolute bottom-0 translate-y-1/2" />
          <div className="h-1 w-3 bg-emerald-400 absolute left-0 -translate-x-1/2" />
          <div className="h-1 w-3 bg-emerald-400 absolute right-0 translate-x-1/2" />
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Floating 3D Stakeout Pin Billboard in AR */}
        <div className="mt-4 bg-emerald-950/90 border border-emerald-400/80 px-3 py-1.5 rounded-xl shadow-2xl backdrop-blur-md text-center animate-bounce">
          <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
            {targetPointName}
          </div>
          <div className="text-lg font-mono font-black text-white">
            {distanceMeters.toFixed(2)} m
          </div>
          <div className="text-[9px] text-emerald-300">
            ΔE: +1.24m | ΔN: +8.32m
          </div>
        </div>
      </div>

      {/* Bottom AR Horizon Level & Guidance */}
      <div className="relative z-10 p-4 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between text-xs text-white">
        <div className="flex items-center gap-2">
          <ArrowUp className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[11px] font-bold text-slate-200">Move Forward</div>
            <div className="text-[10px] text-slate-400">Step 8.4m along line N 48° E</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-slate-400">Optical RTK Fix</div>
          <div className="font-mono text-emerald-400 font-bold text-xs">Horizontal ±0.012 m</div>
        </div>
      </div>
    </div>
  );
};
