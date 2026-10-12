import React, { useState, useEffect, useRef } from 'react';
import {
  Point2D,
  shoelaceArea,
  polygonPerimeter,
  getAllUnitsFromSqFt,
  generateDXF,
} from '../units';
import { UnitResultsBadge } from '../components/UnitResultsBadge';
import {
  Undo,
  RotateCcw,
  Save,
  Download,
  Plus,
  Trash2,
  Building,
  Check,
  FolderOpen,
} from 'lucide-react';

interface SavedPlot {
  id: string;
  name: string;
  date: string;
  areaSqFt: number;
  points: Point2D[];
}

export const PlotterScreen: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [unit, setUnit] = useState<'ft' | 'm'>('ft');
  const [plotName, setPlotName] = useState<string>('Parcel-1 (कित्ता १)');

  // Input view mode: Canvas Interactive Tap vs Table Coordinates/Dimensions
  const [viewMode, setViewMode] = useState<'canvas' | 'table'>('canvas');

  // Boundary points (cadastral pegs)
  const [points, setPoints] = useState<Point2D[]>([
    { x: 80, y: 60 },
    { x: 300, y: 60 },
    { x: 340, y: 260 },
    { x: 60, y: 240 },
  ]);

  // Active dragging point index
  const [activeNode, setActiveNode] = useState<number | null>(null);

  // Building overlay
  const [showBuilding, setShowBuilding] = useState<boolean>(false);
  const [buildingWidth, setBuildingWidth] = useState<number>(30); // in ft
  const [buildingLength, setBuildingLength] = useState<number>(40); // in ft

  // Saved plots
  const [savedPlots, setSavedPlots] = useState<SavedPlot[]>([]);
  const [showSavedList, setShowSavedList] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Load saved plots from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('land_survey_pro_plots');
      if (stored) setSavedPlots(JSON.parse(stored));
    } catch (e) {}
  }, []);

  // Compute Area using Shoelace formula
  const rawShoelaceArea = shoelaceArea(points);
  const rawPerimeter = polygonPerimeter(points);
  // Scale factor: 1 SVG pixel = 0.5 ft
  const scaleFtPerPx = 0.5;
  const areaSqFt =
    unit === 'm'
      ? rawShoelaceArea * scaleFtPerPx * scaleFtPerPx * 10.7639
      : rawShoelaceArea * scaleFtPerPx * scaleFtPerPx;
  const perimeterFt =
    unit === 'm'
      ? rawPerimeter * scaleFtPerPx * 3.28084
      : rawPerimeter * scaleFtPerPx;

  const results = getAllUnitsFromSqFt(areaSqFt);

  // Tap on canvas to add a new corner peg
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeNode !== null || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    if (x >= 15 && x <= rect.width - 15 && y >= 15 && y <= rect.height - 15) {
      setPoints([...points, { x, y }]);
    }
  };

  // Node Dragging Handling
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

  const handleUndo = () => {
    if (points.length > 3) {
      setPoints(points.slice(0, -1));
    }
  };

  const handleReset = () => {
    setPoints([
      { x: 80, y: 60 },
      { x: 300, y: 60 },
      { x: 340, y: 260 },
      { x: 60, y: 240 },
    ]);
  };

  const handleSavePlot = () => {
    const newPlot: SavedPlot = {
      id: String(Date.now()),
      name: plotName.trim() || `Plot ${savedPlots.length + 1}`,
      date: new Date().toLocaleDateString(),
      areaSqFt,
      points,
    };
    const updated = [newPlot, ...savedPlots];
    setSavedPlots(updated);
    try {
      localStorage.setItem('land_survey_pro_plots', JSON.stringify(updated));
    } catch (e) {}
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDownloadDXF = () => {
    const dxfString = generateDXF(
      points.map((p) => ({ x: p.x * scaleFtPerPx, y: p.y * scaleFtPerPx })),
      plotName
    );
    const blob = new Blob([dxfString], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plotName.replace(/\s+/g, '_')}.dxf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plotName.replace(/\s+/g, '_')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3 pb-8 max-w-xl mx-auto">
      {/* 1. Header Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={plotName}
            onChange={(e) => setPlotName(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded px-2.5 py-1 focus:bg-white outline-none w-44"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {/* Unit Toggle */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setUnit('ft')}
              className={`px-2.5 py-0.5 rounded ${unit === 'ft' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'}`}
            >
              Feet (फिट)
            </button>
            <button
              onClick={() => setUnit('m')}
              className={`px-2.5 py-0.5 rounded ${unit === 'm' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'}`}
            >
              Meter (मिटर)
            </button>
          </div>

          <button
            onClick={() => setShowSavedList(!showSavedList)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs flex items-center gap-1"
            title="Saved Plots (सुरक्षित प्लटहरू)"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Plots ({savedPlots.length})</span>
          </button>
        </div>
      </div>

      {/* Saved Plots Drawer */}
      {showSavedList && (
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100 text-xs font-semibold text-slate-800">
            <span>Saved Land Plots (सुरक्षित गरिएका प्लटहरू)</span>
            <button
              onClick={() => setShowSavedList(false)}
              className="text-[11px] text-slate-500 hover:text-slate-800"
            >
              Close (बन्द)
            </button>
          </div>

          {savedPlots.length === 0 ? (
            <div className="text-[11px] text-slate-500 py-2 text-center">
              No saved plots yet. Draw a plot and click "Save Plot".
            </div>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {savedPlots.map((sp) => (
                <div
                  key={sp.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-900">{sp.name}</span>
                    <span className="text-[10px] text-slate-500 ml-2">
                      {sp.areaSqFt.toFixed(1)} sq ft · {sp.points.length} corners
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setPoints(sp.points);
                        setPlotName(sp.name);
                        setShowSavedList(false);
                      }}
                      className="text-slate-800 hover:underline font-medium text-[11px]"
                    >
                      Load (खोल्नुहोस्)
                    </button>
                    <button
                      onClick={() => {
                        const updated = savedPlots.filter((p) => p.id !== sp.id);
                        setSavedPlots(updated);
                        localStorage.setItem('land_survey_pro_plots', JSON.stringify(updated));
                      }}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Mode Toggle: Interactive Canvas vs Coordinate Table */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('canvas')}
          className={`flex-1 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
            viewMode === 'canvas'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Cadastral Canvas (नक्सा ग्राफ)
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`flex-1 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
            viewMode === 'table'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Corner Coordinates & Dimensions (कुना नाप तालिका)
        </button>
      </div>

      {/* 3. MAIN CAD CANVAS */}
      {viewMode === 'canvas' ? (
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-2">
          {/* Canvas Sub-toolbar */}
          <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">
              Tap canvas to add peg (छोएर कुना थप्नुहोस्) · Drag to move
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleUndo}
                disabled={points.length <= 3}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-[11px] flex items-center gap-1 font-medium"
              >
                <Undo className="w-3 h-3" /> Undo (पछाडि)
              </button>
              <button
                onClick={handleReset}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" /> Reset (रिसेट)
              </button>
            </div>
          </div>

          {/* SVG Plotting Paper */}
          <div className="relative w-full h-72 sm:h-80 bg-slate-50/70 border border-slate-200 rounded-lg overflow-hidden select-none touch-none">
            {/* Subtle background cadastral grid */}
            <svg
              ref={svgRef}
              className="w-full h-full cursor-crosshair"
              onClick={handleSvgClick}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {/* Grid pattern */}
              <defs>
                <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cadGrid)" />

              {/* Polygon fill & stroke */}
              {points.length >= 3 && (
                <polygon
                  points={points.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill="rgba(51, 65, 85, 0.08)"
                  stroke="#1e293b"
                  strokeWidth="2"
                  strokeDasharray="none"
                />
              )}

              {/* Edge Length Labels */}
              {points.map((p, idx) => {
                const nextP = points[(idx + 1) % points.length];
                const midX = (p.x + nextP.x) / 2;
                const midY = (p.y + nextP.y) / 2;
                const dx = nextP.x - p.x;
                const dy = nextP.y - p.y;
                const distPx = Math.sqrt(dx * dx + dy * dy);
                const distVal = unit === 'm' ? (distPx * scaleFtPerPx * 0.3048).toFixed(1) : (distPx * scaleFtPerPx).toFixed(1);

                return (
                  <g key={`edge-${idx}`}>
                    <rect
                      x={midX - 16}
                      y={midY - 8}
                      width="32"
                      height="16"
                      rx="3"
                      fill="#ffffff"
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />
                    <text
                      x={midX}
                      y={midY + 3.5}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="600"
                      fill="#334155"
                      fontFamily="monospace"
                    >
                      {distVal}
                    </text>
                  </g>
                );
              })}

              {/* Building Footprint Overlay */}
              {showBuilding && points.length >= 3 && (
                <g>
                  {/* Building rectangle centered at canvas center */}
                  <rect
                    x="150"
                    y="130"
                    width={buildingLength * (1 / scaleFtPerPx) * 0.4}
                    height={buildingWidth * (1 / scaleFtPerPx) * 0.4}
                    fill="rgba(244, 63, 94, 0.15)"
                    stroke="#e11d48"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    rx="2"
                  />
                  <text
                    x="155"
                    y="145"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#be123c"
                  >
                    House (घर)
                  </text>
                </g>
              )}

              {/* Corner Pegs (P1, P2, P3...) */}
              {points.map((p, idx) => (
                <g
                  key={`node-${idx}`}
                  onPointerDown={(e) => handlePointerDown(idx, e)}
                  className="cursor-move"
                >
                  {/* Outer touch hitbox */}
                  <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
                  {/* Visible point circle */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={activeNode === idx ? '8' : '6'}
                    fill="#0f172a"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {/* Point Label */}
                  <text
                    x={p.x + 9}
                    y={p.y - 7}
                    fontSize="10"
                    fontWeight="bold"
                    fill="#0f172a"
                    fontFamily="monospace"
                  >
                    P{idx + 1}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg border border-slate-200 font-mono">
            <span>Corners: {points.length} Pegs</span>
            <span>Perimeter: {perimeterFt.toFixed(1)} {unit}</span>
            <span className="font-bold text-slate-900">
              Shoelace Area: {areaSqFt.toFixed(1)} sq ft
            </span>
          </div>

          {/* Building Footprint Toggle */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-700">
              <Building className="w-3.5 h-3.5" />
              <span>Overlay Building Footprint (घरको नक्सा देखाउने)</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showBuilding}
                onChange={(e) => setShowBuilding(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-slate-900"></div>
            </label>
          </div>
        </div>
      ) : (
        /* TABLE VIEW FOR EXACT NUMERIC INPUT */
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-800">
              Corner Pegs Coordinate Table (कुना बिन्दु तालिका)
            </span>
            <button
              onClick={() => {
                const last = points[points.length - 1];
                setPoints([...points, { x: last.x + 30, y: last.y + 30 }]);
              }}
              className="px-2 py-1 rounded bg-slate-900 text-white text-xs font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Peg (कुना थप्नुहोस्)
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-50 text-slate-600 font-medium">
                <tr>
                  <th className="p-2">Peg (कुना)</th>
                  <th className="p-2">X Coordinate</th>
                  <th className="p-2">Y Coordinate</th>
                  <th className="p-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {points.map((p, idx) => (
                  <tr key={idx}>
                    <td className="p-2 font-bold font-sans">P{idx + 1}</td>
                    <td className="p-1.5">
                      <input
                        type="number"
                        value={p.x}
                        onChange={(e) => {
                          const next = [...points];
                          next[idx].x = parseFloat(e.target.value) || 0;
                          setPoints(next);
                        }}
                        className="w-20 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="p-1.5">
                      <input
                        type="number"
                        value={p.y}
                        onChange={(e) => {
                          const next = [...points];
                          next[idx].y = parseFloat(e.target.value) || 0;
                          setPoints(next);
                        }}
                        className="w-20 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="p-2 text-right">
                      {points.length > 3 && (
                        <button
                          onClick={() => setPoints(points.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Export & Save Actions Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
        <button
          onClick={handleSavePlot}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors"
        >
          {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
          <span>{saveSuccess ? 'Saved (सुरक्षित भयो)' : 'Save Plot (सुरक्षित गर्नुहोस्)'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadDXF}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1 transition-colors"
            title="Export standard AutoCAD DXF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>AutoCAD DXF</span>
          </button>

          <button
            onClick={handleDownloadSVG}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1 transition-colors"
            title="Export vector image"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Image SVG</span>
          </button>
        </div>
      </div>

      {/* 5. Live Area Results Badge */}
      <UnitResultsBadge results={results} title="Shoelace Polygon Area (प्लटर क्षेत्रफल)" />
    </div>
  );
};
