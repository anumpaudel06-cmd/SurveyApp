import React, { useState, useRef } from 'react';
import {
  Point2D,
  triangleAreaHeron,
  getAllUnitsFromSqFt,
  generateDXF,
  ROPANI_SQFT,
  AANA_SQFT,
  PAISA_SQFT,
  DAAM_SQFT,
  BIGHA_SQFT,
  KATTHA_SQFT,
  DHUR_SQFT,
} from '../units';
import {
  RotateCcw,
  Download,
  Copy,
  Check,
  Info,
} from 'lucide-react';

export const PlotterScreen: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  // 4 points for the quadrilateral with diagonal
  const [points, setPoints] = useState<Point2D[]>([
    { x: 80, y: 70 },
    { x: 290, y: 70 },
    { x: 330, y: 260 },
    { x: 60, y: 240 },
  ]);

  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Scale: 1 SVG pixel = 0.5 feet
  const scaleFtPerPx = 0.5;

  // Calculate distance in feet between two points
  const distFt = (p1: Point2D, p2: Point2D): number => {
    const dx = (p2.x - p1.x) * scaleFtPerPx;
    const dy = (p2.y - p1.y) * scaleFtPerPx;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Edge lengths (in feet)
  const side1 = distFt(points[0], points[1]); // P1 - P2
  const side2 = distFt(points[1], points[2]); // P2 - P3
  const side3 = distFt(points[2], points[3]); // P3 - P4
  const side4 = distFt(points[3], points[0]); // P4 - P1
  const diagonal = distFt(points[0], points[2]); // P1 - P3 diagonal

  // Area via Triangle Decomposition (Heron's Formula on T1 & T2)
  // Triangle 1: P1, P2, P3 (sides: side1, side2, diagonal)
  const t1Area = triangleAreaHeron(side1, side2, diagonal);
  // Triangle 2: P1, P3, P4 (sides: diagonal, side3, side4)
  const t2Area = triangleAreaHeron(diagonal, side3, side4);
  const totalAreaSqFt = t1Area + t2Area;
  const totalAreaSqM = totalAreaSqFt * 0.092903;
  const acre = totalAreaSqFt / 43560;
  const hectare = totalAreaSqFt / 107639;

  // Exact Ropani-Aana-Paisa-Daam formatting
  const ropani = Math.floor(totalAreaSqFt / ROPANI_SQFT);
  let remR = totalAreaSqFt % ROPANI_SQFT;
  const aana = Math.floor(remR / AANA_SQFT);
  remR = remR % AANA_SQFT;
  const paisa = Math.floor(remR / PAISA_SQFT);
  remR = remR % PAISA_SQFT;
  const daam = (remR / DAAM_SQFT).toFixed(2);
  const ropaniFormatted = `${ropani}-${aana}-${paisa}-${daam}`;

  // Exact Bigha-Kattha-Dhur formatting
  const bigha = Math.floor(totalAreaSqFt / BIGHA_SQFT);
  let remB = totalAreaSqFt % BIGHA_SQFT;
  const kattha = Math.floor(remB / KATTHA_SQFT);
  remB = remB % KATTHA_SQFT;
  const dhur = (remB / DHUR_SQFT).toFixed(4);
  const bighaFormatted = `${bigha}-${kattha}-${dhur}`;

  // Dragging vertex points
  const handlePointerDown = (idx: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setActiveNode(idx);
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (activeNode === null || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = Math.max(15, Math.min(rect.width - 15, Math.round(clientX - rect.left)));
    const y = Math.max(15, Math.min(rect.height - 15, Math.round(clientY - rect.top)));

    setPoints((prev) => {
      const next = [...prev];
      next[activeNode] = { x, y };
      return next;
    });
  };

  const handlePointerUp = () => {
    setActiveNode(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeNode !== null || !svgRef.current) return;
    // If user clicks, move the closest vertex to the tapped position
    const rect = svgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    let closestIdx = 0;
    let minDist = Infinity;
    points.forEach((p, idx) => {
      const d = Math.hypot(p.x - clickX, p.y - clickY);
      if (d < minDist) {
        minDist = d;
        closestIdx = idx;
      }
    });

    setPoints((prev) => {
      const next = [...prev];
      next[closestIdx] = { x: Math.round(clickX), y: Math.round(clickY) };
      return next;
    });
  };

  const handleResetPoints = () => {
    setPoints([
      { x: 80, y: 70 },
      { x: 290, y: 70 },
      { x: 330, y: 260 },
      { x: 60, y: 240 },
    ]);
  };

  const handleExportDXF = () => {
    const dxfString = generateDXF(
      points.map((p) => ({ x: p.x * scaleFtPerPx, y: p.y * scaleFtPerPx })),
      'QUADRILATERAL_PARCEL'
    );
    const blob = new Blob([dxfString], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parcel_quadrilateral.dxf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyResults = () => {
    const text = `Land Calculator - Quadrilateral Parcel:
• Side 1 (P1-P2): ${side1.toFixed(2)} ft
• Side 2 (P2-P3): ${side2.toFixed(2)} ft
• Side 3 (P3-P4): ${side3.toFixed(2)} ft
• Side 4 (P4-P1): ${side4.toFixed(2)} ft
• Diagonal (P1-P3): ${diagonal.toFixed(2)} ft
• Triangle 1 Area: ${t1Area.toFixed(2)} sq ft
• Triangle 2 Area: ${t2Area.toFixed(2)} sq ft
• TOTAL AREA: ${totalAreaSqFt.toFixed(2)} sq ft (${totalAreaSqM.toFixed(2)} m²)
• Acre: ${acre.toFixed(4)} ac
• Hectare: ${hectare.toFixed(4)} ha
• Ropani-Aana-Paisa-Daam: ${ropaniFormatted}
• Bigha-Kattha-Dhur: ${bighaFormatted}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper for red side length label position
  const getMidpoint = (p1: Point2D, p2: Point2D) => ({
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  });

  const mid1 = getMidpoint(points[0], points[1]);
  const mid2 = getMidpoint(points[1], points[2]);
  const mid3 = getMidpoint(points[2], points[3]);
  const mid4 = getMidpoint(points[3], points[0]);
  const midDiag = getMidpoint(points[0], points[2]);

  return (
    <div className="space-y-3 pb-8 max-w-xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs flex items-center justify-between">
        <div>
          <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400 block">
            *Unit = feet
          </span>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Quadrilateral Plotter & Triangle Decomposition
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleResetPoints}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            title="Reset Corners"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleExportDXF}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            <span>DXF</span>
          </button>
          <button
            onClick={handleCopyResults}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Canvas */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-2">
        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Drag the blue corner dots or tap to reshape the quadrilateral.</span>
          <span className="font-mono text-blue-600 font-semibold">T1 + T2 Decomposition</span>
        </div>

        {/* Canvas area */}
        <div className="relative w-full h-72 sm:h-80 bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden select-none touch-none">
          <svg
            ref={svgRef}
            className="w-full h-full cursor-crosshair"
            onClick={handleCanvasClick}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* Subtle grid pattern */}
            <defs>
              <pattern id="quadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.8" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#quadGrid)" />

            {/* Triangle 1 Fill (P1-P2-P3) */}
            <polygon
              points={`${points[0].x},${points[0].y} ${points[1].x},${points[1].y} ${points[2].x},${points[2].y}`}
              fill="rgba(37, 99, 235, 0.06)"
            />

            {/* Triangle 2 Fill (P1-P3-P4) */}
            <polygon
              points={`${points[0].x},${points[0].y} ${points[2].x},${points[2].y} ${points[3].x},${points[3].y}`}
              fill="rgba(37, 99, 235, 0.03)"
            />

            {/* 4 Outer Blue Boundary Edges */}
            <line
              x1={points[0].x}
              y1={points[0].y}
              x2={points[1].x}
              y2={points[1].y}
              stroke="#2563eb"
              strokeWidth="2.5"
            />
            <line
              x1={points[1].x}
              y1={points[1].y}
              x2={points[2].x}
              y2={points[2].y}
              stroke="#2563eb"
              strokeWidth="2.5"
            />
            <line
              x1={points[2].x}
              y1={points[2].y}
              x2={points[3].x}
              y2={points[3].y}
              stroke="#2563eb"
              strokeWidth="2.5"
            />
            <line
              x1={points[3].x}
              y1={points[3].y}
              x2={points[0].x}
              y2={points[0].y}
              stroke="#2563eb"
              strokeWidth="2.5"
            />

            {/* Diagonal Line (P1 to P3 in Blue) */}
            <line
              x1={points[0].x}
              y1={points[0].y}
              x2={points[2].x}
              y2={points[2].y}
              stroke="#2563eb"
              strokeWidth="1.8"
              strokeDasharray="4 4"
            />

            {/* Triangle Label Indicators */}
            <text
              x={(points[0].x + points[1].x + points[2].x) / 3}
              y={(points[0].y + points[1].y + points[2].y) / 3}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#3b82f6"
              fontFamily="sans-serif"
            >
              Triangle 1 ({t1Area.toFixed(1)} sq ft)
            </text>

            <text
              x={(points[0].x + points[2].x + points[3].x) / 3}
              y={(points[0].y + points[2].y + points[3].y) / 3}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#3b82f6"
              fontFamily="sans-serif"
            >
              Triangle 2 ({t2Area.toFixed(1)} sq ft)
            </text>

            {/* RED LABELS FOR SIDE LENGTHS */}
            {/* Edge 1 (P1-P2) */}
            <g>
              <rect x={mid1.x - 22} y={mid1.y - 14} width="44" height="15" rx="3" fill="#ffffff" stroke="#fca5a5" strokeWidth="1" />
              <text x={mid1.x} y={mid1.y - 3} textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#dc2626" fontFamily="monospace">
                {side1.toFixed(1)} ft
              </text>
            </g>

            {/* Edge 2 (P2-P3) */}
            <g>
              <rect x={mid2.x + 6} y={mid2.y - 8} width="44" height="15" rx="3" fill="#ffffff" stroke="#fca5a5" strokeWidth="1" />
              <text x={mid2.x + 28} y={mid2.y + 3} textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#dc2626" fontFamily="monospace">
                {side2.toFixed(1)} ft
              </text>
            </g>

            {/* Edge 3 (P3-P4) */}
            <g>
              <rect x={mid3.x - 22} y={mid3.y + 3} width="44" height="15" rx="3" fill="#ffffff" stroke="#fca5a5" strokeWidth="1" />
              <text x={mid3.x} y={mid3.y + 14} textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#dc2626" fontFamily="monospace">
                {side3.toFixed(1)} ft
              </text>
            </g>

            {/* Edge 4 (P4-P1) */}
            <g>
              <rect x={mid4.x - 48} y={mid4.y - 8} width="44" height="15" rx="3" fill="#ffffff" stroke="#fca5a5" strokeWidth="1" />
              <text x={mid4.x - 26} y={mid4.y + 3} textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#dc2626" fontFamily="monospace">
                {side4.toFixed(1)} ft
              </text>
            </g>

            {/* Diagonal (P1-P3) RED LABEL */}
            <g>
              <rect x={midDiag.x - 24} y={midDiag.y - 8} width="48" height="15" rx="3" fill="#ffffff" stroke="#fca5a5" strokeWidth="1" />
              <text x={midDiag.x} y={midDiag.y + 3} textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#dc2626" fontFamily="monospace">
                {diagonal.toFixed(1)} ft
              </text>
            </g>

            {/* 4 Blue Dots for Vertices */}
            {points.map((p, idx) => (
              <g
                key={`vertex-${idx}`}
                onPointerDown={(e) => handlePointerDown(idx, e)}
                className="cursor-move"
              >
                {/* Hitbox */}
                <circle cx={p.x} cy={p.y} r="18" fill="transparent" />
                {/* Blue Dot Vertex */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={activeNode === idx ? '8' : '6.5'}
                  fill="#2563eb"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <text
                  x={p.x + (idx === 1 || idx === 2 ? 10 : -16)}
                  y={p.y + (idx === 0 || idx === 1 ? -10 : 16)}
                  fontSize="11"
                  fontWeight="bold"
                  fill="#1e40af"
                  fontFamily="monospace"
                >
                  P{idx + 1}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Side lengths summary strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs font-mono pt-1">
          <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 block">Side 1 (P1-P2)</span>
            <span className="font-bold text-red-600">{side1.toFixed(2)} ft</span>
          </div>
          <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 block">Side 2 (P2-P3)</span>
            <span className="font-bold text-red-600">{side2.toFixed(2)} ft</span>
          </div>
          <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 block">Side 3 (P3-P4)</span>
            <span className="font-bold text-red-600">{side3.toFixed(2)} ft</span>
          </div>
          <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 block">Side 4 (P4-P1)</span>
            <span className="font-bold text-red-600">{side4.toFixed(2)} ft</span>
          </div>
          <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-500 block">Diagonal (P1-P3)</span>
            <span className="font-bold text-red-600">{diagonal.toFixed(2)} ft</span>
          </div>
        </div>
      </div>

      {/* DISPLAY AREA IN ALL UNITS AT THE BOTTOM */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Calculated Quadrilateral Parcel Area
          </span>
          <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400">
            Triangle 1 + Triangle 2
          </span>
        </div>

        {/* 1. Square Feet & Square Meter Main Badges */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Square Feet</span>
            <div className="text-lg font-mono font-bold text-slate-900 dark:text-slate-100">
              {totalAreaSqFt.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-400">sq ft</span>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Square Meters</span>
            <div className="text-lg font-mono font-bold text-slate-900 dark:text-slate-100">
              {totalAreaSqM.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-400">m²</span>
          </div>
        </div>

        {/* 2. Acre & Hectare */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Acre</span>
            <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
              {acre.toFixed(4)}
            </div>
            <span className="text-[9px] text-slate-400">43,560 sq ft / acre</span>
          </div>

          <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Hectare</span>
            <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
              {hectare.toFixed(4)}
            </div>
            <span className="text-[9px] text-slate-400">107,639 sq ft / ha</span>
          </div>
        </div>

        {/* 3. Nepali Units: Ropani-Aana-Paisa-Daam & Bigha-Kattha-Dhur */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Ropani-Aana-Paisa-Daam */}
          <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
              Ropani-Aana-Paisa-Daam
            </span>
            <div className="text-base font-mono font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {ropaniFormatted}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              {ropani} Ropani, {aana} Aana, {paisa} Paisa, {daam} Daam
            </div>
          </div>

          {/* Bigha-Kattha-Dhur */}
          <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
              Bigha-Kattha-Dhur
            </span>
            <div className="text-base font-mono font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {bighaFormatted}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              {bigha} Bigha, {kattha} Kattha, {dhur} Dhur
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
