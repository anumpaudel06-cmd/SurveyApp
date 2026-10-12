import React, { useRef, useState, useEffect } from 'react';
import { Point2D, shoelaceArea, polygonPerimeter } from '../units';
import { Trash2, Undo, Plus, Minus, Grid } from 'lucide-react';

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
  const [scaleFactor, setScaleFactor] = useState<number>(0.5);
  const [zoom, setZoom] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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

  const pointsStr = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Simple Drafting Toolbar */}
      <div className="bg-zinc-950 px-3.5 py-2.5 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-300">2D Drafting View</span>
          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">
            {points.length} Vertices
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1 ${
              snapToGrid
                ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500'
            }`}
            title="Snap to Grid"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Snap</span>
          </button>

          <button
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300"
            title="Zoom In"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300"
            title="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={removeLastPoint}
            disabled={points.length <= 3}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 disabled:opacity-30"
            title="Undo Last Point"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={clearPoints}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            title="Reset Triangle"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full h-80 sm:h-96 bg-zinc-950 cursor-crosshair overflow-hidden select-none touch-none">
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
            {/* Subtle Drafting Grid */}
            <defs>
              <pattern id="minimalGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#27272a" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="800" height="600" fill="url(#minimalGrid)" />

            {/* Polygon Geometry */}
            {points.length >= 3 && (
              <polygon
                points={pointsStr}
                fill="rgba(161, 161, 170, 0.08)"
                stroke="#d4d4d8"
                strokeWidth="2"
              />
            )}

            {/* Deducted Building Footprint if any */}
            {footprintArea > 0 && points.length >= 3 && (
              <g>
                <rect
                  x="180"
                  y="160"
                  width="70"
                  height="50"
                  fill="rgba(113, 113, 122, 0.2)"
                  stroke="#71717a"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <text x="185" y="190" fill="#a1a1aa" fontSize="10" fontWeight="500">
                  Building Footprint
                </text>
              </g>
            )}

            {/* Edge Dimension Labels */}
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
                    y={midY - 9}
                    width="44"
                    height="16"
                    rx="3"
                    fill="#18181b"
                    stroke="#3f3f46"
                    strokeWidth="0.8"
                  />
                  <text
                    x={midX}
                    y={midY + 2.5}
                    textAnchor="middle"
                    fill="#e4e4e7"
                    fontSize="9"
                    fontWeight="500"
                    fontFamily="monospace"
                  >
                    {dist.toFixed(1)}{scaleUnit}
                  </text>
                </g>
              );
            })}

            {/* Vertices */}
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
                  r="6"
                  fill="#ffffff"
                  stroke="#18181b"
                  strokeWidth="2"
                />
                <circle cx={p.x} cy={p.y} r="14" fill="transparent" />
                <text
                  x={p.x + 10}
                  y={p.y - 6}
                  fill="#d4d4d8"
                  fontSize="10"
                  fontFamily="monospace"
                  className="pointer-events-none select-none font-medium"
                >
                  P{idx + 1}
                </text>
              </g>
            ))}
          </g>
        </svg>

        {/* Minimal Overlay Info */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 flex items-center gap-3 pointer-events-auto shadow-sm">
            <div>
              <span className="text-[10px] text-zinc-500 block">Area</span>
              <span className="font-mono font-semibold text-zinc-100">
                {rawArea.toLocaleString('en-US', { maximumFractionDigits: 1 })} sq {scaleUnit}
              </span>
            </div>
            <div className="h-5 w-px bg-zinc-800" />
            <div>
              <span className="text-[10px] text-zinc-500 block">Perimeter</span>
              <span className="font-mono font-semibold text-zinc-300">
                {rawPerimeter.toFixed(1)} {scaleUnit}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 bg-zinc-900/90 px-2 py-1 rounded-lg border border-zinc-800 pointer-events-auto">
            Click to add, drag node to move
          </div>
        </div>
      </div>

      {/* Scale slider */}
      <div className="p-2.5 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs">
        <span className="text-zinc-500">
          Scale: 1 px = <span className="font-mono text-zinc-200">{scaleFactor} {scaleUnit}</span>
        </span>
        <input
          type="range"
          min="0.1"
          max="2.0"
          step="0.1"
          value={scaleFactor}
          onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
          className="w-32 accent-zinc-400 cursor-pointer"
        />
      </div>
    </div>
  );
};
