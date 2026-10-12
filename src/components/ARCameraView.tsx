import React, { useRef, useState, useEffect } from 'react';
import { Camera, ArrowUp } from 'lucide-react';

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
          setCameraError('Camera API not supported in current context.');
        }
      } catch (err: any) {
        setCameraError('Camera inactive. Simulation viewfinder enabled.');
      }
    };

    startCam();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[420px] bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shadow-sm flex flex-col justify-between">
      {hasCamera ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-500 text-center">
          <Camera className="w-8 h-8 text-zinc-400 mb-2" />
          <div className="text-xs font-medium text-zinc-300">AR Camera Viewfinder</div>
          <div className="text-[11px] text-zinc-600 mt-1">
            {cameraError || 'Align surveyor target pin with crosshair'}
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="relative z-10 p-3 bg-zinc-950/80 border-b border-zinc-800/60 flex items-center justify-between text-zinc-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">AR Stakeout View</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 text-zinc-300">
            Azimuth {bearingDeg.toFixed(1)}°
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded text-zinc-300"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Crosshair */}
      <div className="relative z-10 self-center flex flex-col items-center pointer-events-none">
        <div className="relative w-24 h-24 border border-zinc-500/60 rounded-full flex items-center justify-center">
          <div className="w-px h-6 bg-zinc-400 absolute top-0" />
          <div className="w-px h-6 bg-zinc-400 absolute bottom-0" />
          <div className="h-px w-6 bg-zinc-400 absolute left-0" />
          <div className="h-px w-6 bg-zinc-400 absolute right-0" />
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
        </div>

        <div className="mt-3 bg-zinc-900/90 border border-zinc-700 px-3 py-1.5 rounded-lg text-center">
          <div className="text-[10px] text-zinc-400 font-medium">{targetPointName}</div>
          <div className="text-base font-mono font-bold text-zinc-100">{distanceMeters.toFixed(2)} m</div>
        </div>
      </div>

      {/* Bottom Guidance */}
      <div className="relative z-10 p-3 bg-zinc-950/80 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-300">
        <div className="flex items-center gap-1.5">
          <ArrowUp className="w-4 h-4 text-zinc-400" />
          <span className="text-[11px]">Follow direction N {bearingDeg.toFixed(0)}° E</span>
        </div>
        <div className="font-mono text-zinc-400 text-[11px]">Tolerance: ±0.02m</div>
      </div>
    </div>
  );
};
