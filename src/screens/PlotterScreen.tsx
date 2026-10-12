import React, { useState, useEffect, useRef } from 'react';
import {
  Point2D,
  shoelaceArea,
  polygonPerimeter,
  getAllUnitsFromSqFt,
  generateDXF,
} from '../units';
import { UnitResultsBadge } from '../components/UnitResultsBadge';
import { NepaliUnitsBreakdown } from '../components/NepaliUnitsBreakdown';
import {
  PenTool,
  Plus,
  Minus,
  Undo,
  RotateCcw,
  Save,
  Download,
  FolderOpen,
  Trash2,
  Check,
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
  const [scale, setScale] = useState<number>(1); // 1 screen unit = 1 ft/m
  const [plotName, setPlotName] = useState<string>('Plot-1');

  // Initial plot points (a standard irregular 4-corner cadastral plot)
  const [points, setPoints] = useState<Point2D[]>([
    { x: 60, y: 50 },
    { x: 260, y: 50 },
    { x: 300, y: 230 },
    { x: 40, y: 210 },
  ]);

  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [savedPlots, setSavedPlots] = useState<SavedPlot[]>([]);
  const [showSavedModal, setShowSavedModal] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Manual Side Lengths Input Mode
  const [inputMode, setInputMode] = useState<'tap' | 'sides'>('tap');
  const [manualSideLength, setManualSideLength] = useState<string>('50');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('land_survey_pro_plots');
      if (stored) setSavedPlots(JSON.parse(stored));
    } catch (e) {}
  }, []);

  // Compute Area using pure Shoelace
  const rawArea = shoelaceArea(points);
  const rawPerimeter = polygonPerimeter(points);
  const areaSqFt = unit === 'm' ? rawArea * 10.7639 : rawArea;
  const results = getAllUnitsFromSqFt(areaSqFt);

  // Canvas Interactions
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeNode !== null || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    if (x >= 15 && x <= rect.width - 15 && y >= 15 && y <= rect.height - 15) {
      setPoints([...points, { x, y }]);
    }
  };

  const handlePointerDownNode = (idx: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setActiveNode(idx);
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (activeNode === null || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = Math.max(20, Math.min(rect.width - 20, Math.round(clientX - rect.left)));
    const y = Math.max(20, Math.min(rect.height - 20, Math.round(clientY - rect.top)));

    setPoints((prev) => {
      const next = [...prev];
      next[activeNode] = { x, y };
      return next;
    });
  };

  const handlePointerUp = () => {
    setActiveNode(null);
  };

  const undoLastPoint = () => {
    if (points.length > 3) setPoints(points.slice(0, -1));
  };

  const resetPlot = () => {
    setPoints([
      { x: 60, y: 60 },
      { x: 260, y: 60 },
      { x: 280, y: 220 },
      { x: 40, y: 200 },
    ]);
  };

  const handleSave = () => {
    const item: SavedPlot = {
      id: Date.now().toString(),
      name: plotName || `Plot ${savedPlots.length + 1}`,
      date: new Date().toLocaleDateString(),
      areaSqFt,
      points,
    };
    const updated = [item, ...savedPlots];
    setSavedPlots(updated);
    try {
      localStorage.setItem('land_survey_pro_plots', JSON.stringify(updated));
    } catch (e) {}
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleExportDXF = () => {
    const dxf = generateDXF(points, plotName);
    const blob = new Blob([dxf], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plotName.replace(/\s+/g, '_')}.dxf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pointsSvgStr = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="space-y-3.5 pb-6 max-w-xl mx-auto select-none">
      {/* Top Header & Unit Toggle */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
            <PenTool className="w-3.5 h-3.5 text-zinc-300" /> जग्गाको नक्सा (Visual Plotter)
          </h2>
          <p className="text-[10px] text-zinc-500">कुनाहरू छोएर वा तानेर नक्सा बनाउनुहोस्</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-xs">
            <button
              onClick={() => setUnit('ft')}
              className={`px-2.5 py-0.5 rounded font-medium transition-colors ${
                unit === 'ft' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500'
              }`}
            >
              Feet
            </button>
            <button
              onClick={() => setUnit('m')}
              className={`px-2.5 py-0.5 rounded font-medium transition-colors ${
                unit === 'm' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500'
              }`}
            >
              Meter
            </button>
          </div>

          <button
            onClick={() => setShowSavedModal(true)}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1 rounded-lg border border-zinc-700 flex items-center gap-1"
          >
            <FolderOpen className="w-3 h-3" />
            <span>({savedPlots.length})</span>
          </button>
        </div>
      </div>

      {/* Lightweight, Battery-Efficient Canvas Area */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="bg-zinc-950 px-3 py-2 border-b border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="font-mono">{points.length} कुनाहरू (Corners)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={undoLastPoint}
              disabled={points.length <= 3}
              className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-30"
              title="Undo"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={resetPlot}
              className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
              title="Reset Plot"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Interactive SVG Drawing Box */}
        <div className="relative w-full h-72 sm:h-80 bg-zinc-950 touch-none">
          {/* Subtle Grid */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#a1a1aa 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <svg
            ref={svgRef}
            className="w-full h-full cursor-crosshair"
            onClick={handleSvgClick}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
          >
            {/* Polygon Geometry */}
            {points.length >= 3 && (
              <polygon
                points={pointsSvgStr}
                fill="rgba(255, 255, 255, 0.05)"
                stroke="#a1a1aa"
                strokeWidth="1.8"
              />
            )}

            {/* Edge Distance Labels on every side */}
            {points.map((p, idx) => {
              const next = points[(idx + 1) % points.length];
              const midX = (p.x + next.x) / 2;
              const midY = (p.y + next.y) / 2;
              const dx = next.x - p.x;
              const dy = next.y - p.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              return (
                <g key={`edge-${idx}`}>
                  <rect
                    x={midX - 22}
                    y={midY - 8}
                    width="44"
                    height="16"
                    rx="3"
                    fill="#18181b"
                    stroke="#3f3f46"
                    strokeWidth="0.8"
                  />
                  <text
                    x={midX}
                    y={midY + 3}
                    textAnchor="middle"
                    fill="#f4f4f5"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {dist.toFixed(1)}{unit}
                  </text>
                </g>
              );
            })}

            {/* Corner Nodes */}
            {points.map((p, idx) => (
              <g
                key={`pt-${idx}`}
                onMouseDown={(e) => handlePointerDownNode(idx, e)}
                onTouchStart={(e) => handlePointerDownNode(idx, e)}
                className="cursor-pointer"
              >
                <circle cx={p.x} cy={p.y} r="7" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
                <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
                <text
                  x={p.x + 9}
                  y={p.y - 7}
                  fill="#a1a1aa"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  P{idx + 1}
                </text>
              </g>
            ))}
          </svg>

          {/* Quick HUD inside canvas */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-300 pointer-events-auto flex items-center gap-2">
              <span className="text-[10px] text-zinc-500">क्षेत्रफल:</span>
              <span className="font-mono font-bold text-zinc-100">
                {results.ropani.formatted} <span className="text-[10px] text-zinc-400 font-normal">(R-A-P-D)</span>
              </span>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg px-2 py-1 text-[11px] text-zinc-400 pointer-events-auto">
              घेरा (Perimeter): <span className="font-mono text-zinc-200">{rawPerimeter.toFixed(1)}{unit}</span>
            </div>
          </div>
        </div>

        {/* Edge Lengths Table */}
        <div className="bg-zinc-950 p-3 border-t border-zinc-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-zinc-500 uppercase border-b border-zinc-800/80">
              <tr>
                <th className="pb-1.5">भुजा (Side)</th>
                <th className="pb-1.5">बिन्दुहरू (Line)</th>
                <th className="pb-1.5 text-right">लम्बाई ({unit})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850 font-mono text-zinc-300">
              {points.map((p, idx) => {
                const next = points[(idx + 1) % points.length];
                const dx = next.x - p.x;
                const dy = next.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                return (
                  <tr key={idx} className="hover:bg-zinc-900/40">
                    <td className="py-1 text-zinc-400">Side {idx + 1}</td>
                    <td className="py-1">P{idx + 1} → P{((idx + 1) % points.length) + 1}</td>
                    <td className="py-1 text-right font-bold text-zinc-100">{dist.toFixed(2)} {unit}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save & Export Controls */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <input
          type="text"
          value={plotName}
          onChange={(e) => setPlotName(e.target.value)}
          className="flex-1 min-w-[130px] bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-100 font-medium"
          placeholder="जग्गाको नाम (e.g. कित्ता नं. २१)"
        />

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleSave}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-3 py-1.5 rounded-lg flex items-center gap-1 border border-zinc-700 font-medium transition-colors"
          >
            {saveSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saveSuccess ? 'सुरक्षित भयो' : 'सुरक्षित (Save)'}</span>
          </button>

          <button
            onClick={handleExportDXF}
            className="bg-zinc-950 hover:bg-zinc-850 text-zinc-300 px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-zinc-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>AutoCAD DXF</span>
          </button>
        </div>
      </div>

      {/* Full Results Badge */}
      <UnitResultsBadge results={results} title={`नक्साको क्षेत्रफल: ${plotName}`} />
      <NepaliUnitsBreakdown results={results} />

      {/* Saved Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-sm w-full p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-xs font-semibold text-zinc-200">सुरक्षित नक्साहरू ({savedPlots.length})</h3>
              <button
                onClick={() => setShowSavedModal(false)}
                className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded"
              >
                बन्द गर्नुहोस्
              </button>
            </div>

            {savedPlots.length === 0 ? (
              <div className="text-center py-6 text-zinc-500 text-xs">कुनै सुरक्षित नक्सा छैन।</div>
            ) : (
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {savedPlots.map((plot) => (
                  <div
                    key={plot.id}
                    className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-medium text-zinc-200">{plot.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {plot.areaSqFt.toFixed(1)} sq ft • {plot.date}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const updated = savedPlots.filter((p) => p.id !== plot.id);
                        setSavedPlots(updated);
                        localStorage.setItem('land_survey_pro_plots', JSON.stringify(updated));
                      }}
                      className="text-zinc-500 hover:text-zinc-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
