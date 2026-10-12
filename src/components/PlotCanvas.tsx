import React, { useRef, useState, useEffect } from 'react';
import { Point2D, shoelaceArea, polygonPerimeter, getAllUnitsFromSqFt } from '../units';
import { Trash2, Undo, Plus, Minus, Move, Grid, Check, Sparkles, Building2 } from 'lucide-react';

interface PlotCanvasProps {
  onAreaCalculated?: (areaSqFt: number, perimeter: number, points: Point2D[]) => void;
  scaleUnit?: 'ft' | 'm';
  footprintArea?: number;
}

export const PlotCanvas: React.FC<PlotCanvasProps> = ({
  onAreaCalculated,
  scaleUnit = 'ft',
  footprintArea = 0,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [points, setPoints] = useState<Point2D[]>([
    { x: 100, y: 120 },
    { x: 280, y: 80 },
    { x: 340, y: 260 },
    { x: 160, y: 320 },
    { x: 70, y: 230 },
  ]);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [scaleFactor, setScaleFactor] = useState<number>(0.5); // 1 SVG unit = 0.5 ft or m
  const [zoom, setZoom] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Scaled coordinates in survey units (ft or m)
  const scaledPoints = points.map((p) => ({
    x: p.x * scaleFactor,
    y: p.y * scaleFactor,
  }));

  const rawArea = shoelaceArea(scaledPoints);
  const rawPerimeter = polygonPerimeter(scaledPoints);
  const areaInSqFt = scaleUnit === 'm' ? rawArea * 10.7639 : rawArea;
  const netAreaInSqFt = Math.max(0, areaInSqFt - footprintArea);

  useEffect(() => {
    if (onAreaCalculated) {
      onAreaCalculated(netAreaInSqFt, rawPerimeter, points);
    }
  }, [points, scaleFactor, scaleUnit, footprintArea]);

  // Convert SVG client coords to SVG space
  const getSVGCoordinates = (e: React.MouseEvent | React.TouchEvent): Point2D => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    let x = (clientX - rect.left - offset.x) / zoom;
    let y = (clientY - rect.top - offset.y) / zoom;

    if (snapToGrid) {
      x = Math.round(x / 20) * 20;
      y = Math.round(y / 20) * 20;
    }

    return { x: Math.max(10, Math.min(600, x)), y: Math.max(10, Math.min(500, y)) };
  };

  const handleSvgClick = (e: React.MouseEvent) => {
    if (draggingIdx !== null || isPanning) return;
    const newPoint = getSVGCoordinates(e);
    setPoints([...points, newPoint]);
  };

  const handleMouseDownNode = (idx: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setDraggingIdx(idx);
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (draggingIdx !== null) {
      const coords = getSVGCoordinates(e);
      setPoints((prev) => {
        const next = [...prev];
        next[draggingIdx] = coords;
        return next;
      });
    } else if (isPanning) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      setOffset({
        x: clientX - panStart.x,
        y: clientY - panStart.y,
      });
    }
  };

  const handlePointerUp = () => {
    setDraggingIdx(null);
    setIsPanning(false);
  };

  const removeLastPoint = () => {
    if (points.length > 3) {
      setPoints(points.slice(0, -1));
    }
  };

  const clearPoints = () => {
    setPoints([
      { x: 100, y: 100 },
      { x: 300, y: 100 },
      { x: 200, y: 250 },
    ]);
  };

  // SVG Polygon path string
  const pointsStr = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* CAD Toolbar */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-200">2D Field Plotter</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
            {points.length} Vertices
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1 ${
              snapToGrid
                ? 'bg-emerald-950/60 border-emerald-600 text-emerald-400'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
            title="Snap to Grid"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Snap</span>
          </button>

          <button
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300"
            title="Zoom In"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300"
            title="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={removeLastPoint}
            disabled={points.length <= 3}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-40"
            title="Undo Last Point"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={clearPoints}
            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300"
            title="Reset Triangle"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive CAD Canvas Area */}
      <div className="relative w-full h-80 sm:h-96 bg-slate-950 cursor-crosshair overflow-hidden select-none touch-none">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #38bdf8 1px, transparent 1px), radial-gradient(circle, #38bdf8 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
          }}
        />

        <svg
          ref={svgRef}
          className="w-full h-full"
          onClick={handleSvgClick}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          <g transform={`translate(${offset.x}, ${offset.y}) scale(${zoom})`}>
            {/* Grid Lines */}
            <defs>
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="800" height="600" fill="url(#smallGrid)" />

            {/* Polygon Body */}
            {points.length >= 3 && (
              <polygon
                points={pointsStr}
                fill="rgba(16, 185, 129, 0.15)"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="none"
              />
            )}

            {/* Simulated Building Footprint Deducted Area if any */}
            {footprintArea > 0 && points.length >= 3 && (
              <g>
                <rect
                  x="180"
                  y="160"
                  width="70"
                  height="50"
                  fill="rgba(239, 68, 68, 0.25)"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <text x="185" y="190" fill="#fca5a5" fontSize="10" fontWeight="bold">
                  Building Footprint
                </text>
              </g>
            )}

            {/* Side Dimension Labels */}
            {points.map((p, idx) => {
              const next = points[(idx + 1) % points.length];
              const midX = (p.x + next.x) / 2;
              const midY = (p.y + next.y) / 2;
              const dx = (next.x - p.x) * scaleFactor;
              const dy = (next.y - p.y) * scaleFactor;
              const dist = Math.sqrt(dx * dx + dy * dy);

              return (
                <g key={`edge-${idx}`}>
                  <rect
                    x={midX - 22}
                    y={midY - 10}
                    width="44"
                    height="18"
                    rx="4"
                    fill="#0f172a"
                    stroke="#334155"
                    strokeWidth="1"
                  />
                  <text
                    x={midX}
                    y={midY + 3}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="monospace"
                  >
                    {dist.toFixed(1)}{scaleUnit}
                  </text>
                </g>
              );
            })}

            {/* Vertex Handles */}
            {points.map((p, idx) => (
              <g
                key={`point-${idx}`}
                onMouseDown={(e) => handleMouseDownNode(idx, e)}
                onTouchStart={(e) => handleMouseDownNode(idx, e)}
                className="cursor-grab active:cursor-grabbing"
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="8"
                  fill="#059669"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                />
                <circle cx={p.x} cy={p.y} r="14" fill="transparent" />
                <text
                  x={p.x + 12}
                  y={p.y - 8}
                  fill="#f1f5f9"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                  className="pointer-events-none select-none drop-shadow"
                >
                  P{idx + 1}
                </text>
              </g>
            ))}
          </g>
        </svg>

        {/* Live HUD Floating Over Canvas */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 flex items-center gap-3 pointer-events-auto">
            <div>
              <span className="text-[10px] text-slate-400 block">Gross Shoelace</span>
              <span className="font-mono font-bold text-emerald-400">
                {rawArea.toLocaleString('en-US', { maximumFractionDigits: 1 })} sq {scaleUnit}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 block">Perimeter</span>
              <span className="font-mono font-bold text-sky-400">
                {rawPerimeter.toFixed(1)} {scaleUnit}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800 pointer-events-auto">
            💡 Tap canvas to add vertex, drag to move
          </div>
        </div>
      </div>

      {/* Scale adjustment slider */}
      <div className="p-3 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span>CAD Scale Ratio:</span>
          <span className="font-mono font-bold text-white">1 px = {scaleFactor} {scaleUnit}</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="2.0"
          step="0.1"
          value={scaleFactor}
          onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
          className="w-36 accent-emerald-500 cursor-pointer"
        />
      </div>
    </div>
  );
};
