import React, { useState, useRef, useEffect } from 'react';
import {
  Point2D,
  triangleAreaHeron,
  generateDXF,
  ROPANI_SQFT,
  AANA_SQFT,
  PAISA_SQFT,
  DAAM_SQFT,
  BIGHA_SQFT,
  KATTHA_SQFT,
  DHUR_SQFT,
  KHETMURI_SQFT,
  SQYD_TO_SQFT,
  SQMI_TO_SQFT,
  SQKM_TO_SQFT,
} from '../units';
import {
  RotateCcw,
  Download,
  Copy,
  Check,
  Edit3,
  MousePointer,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const PlotterScreen: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Active linear unit: 'feet' | 'meter'
  const [unit, setUnit] = useState<'feet' | 'meter'>('feet');

  // Side lengths state (editable with 3-decimal precision, e.g. 173.226)
  // Default values in feet:
  const [side1Input, setSide1Input] = useState<string>('125.450'); // AB (P1-P2)
  const [side2Input, setSide2Input] = useState<string>('98.625');  // BC (P2-P3)
  const [side3Input, setSide3Input] = useState<string>('132.180'); // CD (P3-P4)
  const [side4Input, setSide4Input] = useState<string>('104.240'); // DA (P4-P1)
  const [diagInput, setDiagInput] = useState<string>('155.800');  // AC (P1-P3 Diagonal)

  // Canvas visual points (in SVG coordinates)
  const [canvasPoints, setCanvasPoints] = useState<Point2D[]>([
    { x: 75, y: 80 },
    { x: 305, y: 70 },
    { x: 325, y: 250 },
    { x: 65, y: 230 },
  ]);

  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [inputMode, setInputMode] = useState<'length' | 'drag'>('length');
  const [geomError, setGeomError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Numeric side lengths in current unit
  const s1 = parseFloat(side1Input) || 0;
  const s2 = parseFloat(side2Input) || 0;
  const s3 = parseFloat(side3Input) || 0;
  const s4 = parseFloat(side4Input) || 0;
  const dDiag = parseFloat(diagInput) || 0;

  // Conversion factors:
  // If unit === 'meter': 1 m = 3.28084 ft; 1 m² = 10.76391 sq ft
  // If unit === 'feet': 1 ft = 1 ft
  const unitToSqFt = unit === 'meter' ? 10.76391041671 : 1;
  const unitToM = unit === 'meter' ? 1 : 0.3048;

  // Validate triangle geometry
  const isTriangleValid = (a: number, b: number, c: number): boolean => {
    return a > 0 && b > 0 && c > 0 && a + b > c && a + c > b && b + c > a;
  };

  const isT1Valid = isTriangleValid(s1, s2, dDiag);
  const isT2Valid = isTriangleValid(dDiag, s3, s4);

  // Reconstruct canvas coordinates from side lengths using Law of Cosines
  const reconstructFromLengths = () => {
    if (!isT1Valid || !isT2Valid) {
      setGeomError('Invalid triangle side lengths. For each triangle, sum of 2 sides must exceed 3rd side.');
      return;
    }
    setGeomError(null);

    try {
      // Triangle 1: P1 at (0, 0), P2 at (s1, 0)
      // Angle alpha at P1:
      const cosAlpha1 = Math.max(-1, Math.min(1, (s1 * s1 + dDiag * dDiag - s2 * s2) / (2 * s1 * dDiag)));
      const alpha1 = Math.acos(cosAlpha1);

      const p1Raw = { x: 0, y: 0 };
      const p2Raw = { x: s1, y: 0 };
      const p3Raw = { x: dDiag * Math.cos(alpha1), y: dDiag * Math.sin(alpha1) };

      // Triangle 2 on diagonal AC:
      const cosAlpha2 = Math.max(-1, Math.min(1, (dDiag * dDiag + s4 * s4 - s3 * s3) / (2 * dDiag * s4)));
      const alpha2 = Math.acos(cosAlpha2);
      // Place P4 on the opposite side of diagonal AC:
      const angleP4 = alpha1 - alpha2;
      const p4Raw = { x: s4 * Math.cos(angleP4), y: s4 * Math.sin(angleP4) };

      const rawPoly = [p1Raw, p2Raw, p3Raw, p4Raw];

      // Fit and scale into SVG box (width 380, height 280, padding 35)
      const minX = Math.min(...rawPoly.map((p) => p.x));
      const maxX = Math.max(...rawPoly.map((p) => p.x));
      const minY = Math.min(...rawPoly.map((p) => p.y));
      const maxY = Math.max(...rawPoly.map((p) => p.y));

      const w = Math.max(1, maxX - minX);
      const h = Math.max(1, maxY - minY);

      const svgW = 380;
      const svgH = 280;
      const pad = 36;
      const scale = Math.min((svgW - pad * 2) / w, (svgH - pad * 2) / h);

      const offsetX = (svgW - w * scale) / 2 - minX * scale;
      const offsetY = (svgH - h * scale) / 2 - minY * scale;

      const fitted: Point2D[] = rawPoly.map((p) => ({
        x: Math.round(p.x * scale + offsetX),
        y: Math.round(p.y * scale + offsetY),
      }));

      setCanvasPoints(fitted);
    } catch {
      // Fallback
    }
  };

  // Re-calculate when length inputs change in 'length' mode
  useEffect(() => {
    if (inputMode === 'length') {
      reconstructFromLengths();
    }
  }, [side1Input, side2Input, side3Input, side4Input, diagInput, unit]);

  // Compute areas in current linear units squared
  let t1AreaUnit = 0;
  let t2AreaUnit = 0;
  if (isT1Valid) {
    t1AreaUnit = triangleAreaHeron(s1, s2, dDiag);
  }
  if (isT2Valid) {
    t2AreaUnit = triangleAreaHeron(dDiag, s3, s4);
  }
  const totalAreaInUnit = t1AreaUnit + t2AreaUnit;

  // Convert to Sq Ft for universal conversions
  const totalAreaSqFt = totalAreaInUnit * unitToSqFt;
  const totalAreaSqM = totalAreaSqFt * 0.09290304;
  const acre = totalAreaSqFt / 43560;
  const hectare = totalAreaSqFt / 107639.104;
  const sqYd = totalAreaSqFt / SQYD_TO_SQFT;
  const sqMi = totalAreaSqFt / SQMI_TO_SQFT;
  const sqKm = totalAreaSqFt / SQKM_TO_SQFT;
  const khetmuri = totalAreaSqFt / KHETMURI_SQFT;

  // Exact Ropani-Aana-Paisa-Daam breakdown
  const ropani = Math.floor(totalAreaSqFt / ROPANI_SQFT);
  let remR = totalAreaSqFt % ROPANI_SQFT;
  const aana = Math.floor(remR / AANA_SQFT);
  remR = remR % AANA_SQFT;
  const paisa = Math.floor(remR / PAISA_SQFT);
  remR = remR % PAISA_SQFT;
  const daam = (remR / DAAM_SQFT).toFixed(3);
  const ropaniFormatted = `${ropani}-${aana}-${paisa}-${daam}`;

  // Exact Bigha-Kattha-Dhur breakdown
  const bigha = Math.floor(totalAreaSqFt / BIGHA_SQFT);
  let remB = totalAreaSqFt % BIGHA_SQFT;
  const kattha = Math.floor(remB / KATTHA_SQFT);
  remB = remB % KATTHA_SQFT;
  const dhur = (remB / DHUR_SQFT).toFixed(3);
  const bighaFormatted = `${bigha}-${kattha}-${dhur}`;

  // Dragging vertex points on canvas
  const handlePointerDown = (idx: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setActiveNode(idx);
    setInputMode('drag');
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (activeNode === null || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = Math.max(15, Math.min(rect.width - 15, Math.round(clientX - rect.left)));
    const y = Math.max(15, Math.min(rect.height - 15, Math.round(clientY - rect.top)));

    setCanvasPoints((prev) => {
      const next = [...prev];
      next[activeNode] = { x, y };

      // Update side length inputs based on distance
      const pxDist = (p1: Point2D, p2: Point2D) => Math.hypot(p2.x - p1.x, p2.y - p1.y);
      // Canvas scale: derive from diagonal
      const scaleFactor = dDiag > 0 ? dDiag / Math.max(1, pxDist(next[0], next[2])) : 0.5;

      const calc1 = pxDist(next[0], next[1]) * scaleFactor;
      const calc2 = pxDist(next[1], next[2]) * scaleFactor;
      const calc3 = pxDist(next[2], next[3]) * scaleFactor;
      const calc4 = pxDist(next[3], next[0]) * scaleFactor;
      const calcDiag = pxDist(next[0], next[2]) * scaleFactor;

      setSide1Input(calc1.toFixed(3));
      setSide2Input(calc2.toFixed(3));
      setSide3Input(calc3.toFixed(3));
      setSide4Input(calc4.toFixed(3));
      setDiagInput(calcDiag.toFixed(3));

      return next;
    });
  };

  const handlePointerUp = () => {
    setActiveNode(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeNode !== null || !svgRef.current) return;
    setInputMode('drag');
    const rect = svgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    let closestIdx = 0;
    let minDist = Infinity;
    canvasPoints.forEach((p, idx) => {
      const d = Math.hypot(p.x - clickX, p.y - clickY);
      if (d < minDist) {
        minDist = d;
        closestIdx = idx;
      }
    });

    setCanvasPoints((prev) => {
      const next = [...prev];
      next[closestIdx] = { x: Math.round(clickX), y: Math.round(clickY) };

      const pxDist = (p1: Point2D, p2: Point2D) => Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const scaleFactor = dDiag > 0 ? dDiag / Math.max(1, pxDist(next[0], next[2])) : 0.5;

      setSide1Input((pxDist(next[0], next[1]) * scaleFactor).toFixed(3));
      setSide2Input((pxDist(next[1], next[2]) * scaleFactor).toFixed(3));
      setSide3Input((pxDist(next[2], next[3]) * scaleFactor).toFixed(3));
      setSide4Input((pxDist(next[3], next[0]) * scaleFactor).toFixed(3));
      setDiagInput((pxDist(next[0], next[2]) * scaleFactor).toFixed(3));

      return next;
    });
  };

  const handleReset = () => {
    setInputMode('length');
    if (unit === 'meter') {
      setSide1Input('38.237');
      setSide2Input('30.061');
      setSide3Input('40.288');
      setSide4Input('31.772');
      setDiagInput('47.488');
    } else {
      setSide1Input('125.450');
      setSide2Input('98.625');
      setSide3Input('132.180');
      setSide4Input('104.240');
      setDiagInput('155.800');
    }
  };

  const toggleUnit = (newUnit: 'feet' | 'meter') => {
    if (newUnit === unit) return;
    const factor = newUnit === 'meter' ? 0.3048 : 3.28084;
    setSide1Input((s1 * factor).toFixed(3));
    setSide2Input((s2 * factor).toFixed(3));
    setSide3Input((s3 * factor).toFixed(3));
    setSide4Input((s4 * factor).toFixed(3));
    setDiagInput((dDiag * factor).toFixed(3));
    setUnit(newUnit);
  };

  const handleExportDXF = () => {
    const dxfString = generateDXF(
      canvasPoints.map((p) => ({ x: p.x, y: p.y })),
      'QUADRILATERAL_PARCEL'
    );
    const blob = new Blob([dxfString], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parcel_quadrilateral_${unit}.dxf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyResults = () => {
    const unitSymbol = unit === 'meter' ? 'm' : 'ft';
    const text = `Land Calculator - Quadrilateral Plotter:
• Linear Unit: ${unit === 'meter' ? 'Meter (m)' : 'Feet (ft)'}
• Side 1 (P1-P2): ${s1.toFixed(3)} ${unitSymbol}
• Side 2 (P2-P3): ${s2.toFixed(3)} ${unitSymbol}
• Side 3 (P3-P4): ${s3.toFixed(3)} ${unitSymbol}
• Side 4 (P4-P1): ${s4.toFixed(3)} ${unitSymbol}
• Diagonal (P1-P3): ${dDiag.toFixed(3)} ${unitSymbol}
• Triangle 1 Area: ${t1AreaUnit.toFixed(3)} sq ${unitSymbol}
• Triangle 2 Area: ${t2AreaUnit.toFixed(3)} sq ${unitSymbol}
• TOTAL AREA:
  - ${totalAreaSqFt.toFixed(3)} sq ft
  - ${totalAreaSqM.toFixed(3)} m²
  - Acre: ${acre.toFixed(4)} ac
  - Hectare: ${hectare.toFixed(4)} ha
  - Nepali Ropani-Aana-Paisa-Daam: ${ropaniFormatted}
  - Nepali Bigha-Kattha-Dhur: ${bighaFormatted}
  - Khetmuri: ${khetmuri.toFixed(4)}
  - Sq Yards: ${sqYd.toFixed(3)} sq yd
  - Sq Miles: ${sqMi.toFixed(6)} sq mi
  - Sq Kilometers: ${sqKm.toFixed(6)} sq km`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper for midpoint of lines
  const getMidpoint = (p1: Point2D, p2: Point2D) => ({
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  });

  const mid1 = getMidpoint(canvasPoints[0], canvasPoints[1]);
  const mid2 = getMidpoint(canvasPoints[1], canvasPoints[2]);
  const mid3 = getMidpoint(canvasPoints[2], canvasPoints[3]);
  const mid4 = getMidpoint(canvasPoints[3], canvasPoints[0]);
  const midDiag = getMidpoint(canvasPoints[0], canvasPoints[2]);

  return (
    <div className="space-y-3 pb-8 max-w-xl mx-auto">
      {/* 1. Header Bar with Unit Display & Quick Actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs flex items-center justify-between">
        <div>
          <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400 block tracking-wide">
            *Unit = {unit === 'meter' ? 'meter' : 'feet'}
          </span>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Quadrilateral Plotter & Triangle Decomposition
          </span>
        </div>

        {/* Linear Unit Switcher & Export */}
        <div className="flex items-center gap-1.5">
          <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-950">
            <button
              onClick={() => toggleUnit('feet')}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                unit === 'feet'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Feet
            </button>
            <button
              onClick={() => toggleUnit('meter')}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                unit === 'meter'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Meter
            </button>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleExportDXF}
            className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1"
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

      {/* 2. Manual Line Length Input Strip (Enter exact side lengths with 3 decimal precision) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
            <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Enter Side Lengths (Up to 3 Decimals, e.g. 173.226 {unit === 'meter' ? 'm' : 'ft'})
            </h3>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Mode: {inputMode === 'length' ? 'Numeric Input' : 'Canvas Drag'}
          </span>
        </div>

        {geomError && (
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{geomError}</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {/* Side 1: AB (P1-P2) */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-600 dark:text-slate-400 flex items-center justify-between">
              <span>Side 1 (P1-P2)</span>
              <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.001"
                value={side1Input}
                onChange={(e) => {
                  setInputMode('length');
                  setSide1Input(e.target.value);
                }}
                className="w-full px-2 py-1.5 pr-6 rounded-lg text-xs font-mono font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                placeholder="173.226"
              />
              <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-mono">
                {unit === 'meter' ? 'm' : 'ft'}
              </span>
            </div>
          </div>

          {/* Side 2: BC (P2-P3) */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-600 dark:text-slate-400 flex items-center justify-between">
              <span>Side 2 (P2-P3)</span>
              <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.001"
                value={side2Input}
                onChange={(e) => {
                  setInputMode('length');
                  setSide2Input(e.target.value);
                }}
                className="w-full px-2 py-1.5 pr-6 rounded-lg text-xs font-mono font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                placeholder="98.625"
              />
              <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-mono">
                {unit === 'meter' ? 'm' : 'ft'}
              </span>
            </div>
          </div>

          {/* Side 3: CD (P3-P4) */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-600 dark:text-slate-400 flex items-center justify-between">
              <span>Side 3 (P3-P4)</span>
              <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.001"
                value={side3Input}
                onChange={(e) => {
                  setInputMode('length');
                  setSide3Input(e.target.value);
                }}
                className="w-full px-2 py-1.5 pr-6 rounded-lg text-xs font-mono font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                placeholder="132.180"
              />
              <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-mono">
                {unit === 'meter' ? 'm' : 'ft'}
              </span>
            </div>
          </div>

          {/* Side 4: DA (P4-P1) */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-600 dark:text-slate-400 flex items-center justify-between">
              <span>Side 4 (P4-P1)</span>
              <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.001"
                value={side4Input}
                onChange={(e) => {
                  setInputMode('length');
                  setSide4Input(e.target.value);
                }}
                className="w-full px-2 py-1.5 pr-6 rounded-lg text-xs font-mono font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                placeholder="104.240"
              />
              <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-mono">
                {unit === 'meter' ? 'm' : 'ft'}
              </span>
            </div>
          </div>

          {/* Diagonal: AC (P1-P3) */}
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <label className="text-[10px] font-medium text-blue-600 dark:text-blue-400 flex items-center justify-between">
              <span>Diagonal (P1-P3)</span>
              <span className="text-blue-500 font-bold">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.001"
                value={diagInput}
                onChange={(e) => {
                  setInputMode('length');
                  setDiagInput(e.target.value);
                }}
                className="w-full px-2 py-1.5 pr-6 rounded-lg text-xs font-mono font-bold bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-blue-900 dark:text-blue-100"
                placeholder="155.800"
              />
              <span className="absolute right-2 top-2 text-[10px] text-blue-400 font-mono">
                {unit === 'meter' ? 'm' : 'ft'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Quadrilateral Canvas */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-2">
        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MousePointer className="w-3.5 h-3.5 text-blue-600" />
            <span>Drag blue dots or tap canvas to reshape. Values update with 3-decimal precision.</span>
          </div>
          <span className="font-mono text-blue-600 font-semibold text-xs">
            {t1AreaUnit > 0 && t2AreaUnit > 0 ? 'T1 + T2 Decomposition' : 'Invalid Geometry'}
          </span>
        </div>

        {/* Canvas Area */}
        <div className="relative w-full h-72 sm:h-80 bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden select-none touch-none">
          <svg
            ref={svgRef}
            className="w-full h-full cursor-crosshair"
            onClick={handleCanvasClick}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <defs>
              <pattern id="plotterGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" className="text-slate-200/50 dark:text-slate-800/50" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#plotterGrid)" />

            {/* Triangle 1 Shaded Polygon (P1 - P2 - P3) */}
            <polygon
              points={`${canvasPoints[0].x},${canvasPoints[0].y} ${canvasPoints[1].x},${canvasPoints[1].y} ${canvasPoints[2].x},${canvasPoints[2].y}`}
              fill="rgba(59, 130, 246, 0.08)"
            />

            {/* Triangle 2 Shaded Polygon (P1 - P3 - P4) */}
            <polygon
              points={`${canvasPoints[0].x},${canvasPoints[0].y} ${canvasPoints[2].x},${canvasPoints[2].y} ${canvasPoints[3].x},${canvasPoints[3].y}`}
              fill="rgba(59, 130, 246, 0.14)"
            />

            {/* BLUE LINES FOR EDGES */}
            {/* Edge 1: P1 - P2 */}
            <line
              x1={canvasPoints[0].x}
              y1={canvasPoints[0].y}
              x2={canvasPoints[1].x}
              y2={canvasPoints[1].y}
              stroke="#2563eb"
              strokeWidth="2.5"
            />
            {/* Edge 2: P2 - P3 */}
            <line
              x1={canvasPoints[1].x}
              y1={canvasPoints[1].y}
              x2={canvasPoints[2].x}
              y2={canvasPoints[2].y}
              stroke="#2563eb"
              strokeWidth="2.5"
            />
            {/* Edge 3: P3 - P4 */}
            <line
              x1={canvasPoints[2].x}
              y1={canvasPoints[2].y}
              x2={canvasPoints[3].x}
              y2={canvasPoints[3].y}
              stroke="#2563eb"
              strokeWidth="2.5"
            />
            {/* Edge 4: P4 - P1 */}
            <line
              x1={canvasPoints[3].x}
              y1={canvasPoints[3].y}
              x2={canvasPoints[0].x}
              y2={canvasPoints[0].y}
              stroke="#2563eb"
              strokeWidth="2.5"
            />

            {/* BLUE DASHED DIAGONAL (P1 - P3) */}
            <line
              x1={canvasPoints[0].x}
              y1={canvasPoints[0].y}
              x2={canvasPoints[2].x}
              y2={canvasPoints[2].y}
              stroke="#2563eb"
              strokeWidth="2"
              strokeDasharray="5 5"
            />

            {/* Triangle Area Badges */}
            <text
              x={(canvasPoints[0].x + canvasPoints[1].x + canvasPoints[2].x) / 3}
              y={(canvasPoints[0].y + canvasPoints[1].y + canvasPoints[2].y) / 3}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#2563eb"
              fontFamily="sans-serif"
            >
              T1: {t1AreaUnit.toFixed(2)} {unit === 'meter' ? 'm²' : 'sq ft'}
            </text>

            <text
              x={(canvasPoints[0].x + canvasPoints[2].x + canvasPoints[3].x) / 3}
              y={(canvasPoints[0].y + canvasPoints[2].y + canvasPoints[3].y) / 3}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#2563eb"
              fontFamily="sans-serif"
            >
              T2: {t2AreaUnit.toFixed(2)} {unit === 'meter' ? 'm²' : 'sq ft'}
            </text>

            {/* RED LABELS FOR SIDE LENGTHS (3 Decimal Precision e.g. 173.226) */}
            {/* Edge 1 (P1-P2) */}
            <g>
              <rect x={mid1.x - 32} y={mid1.y - 14} width="64" height="16" rx="4" fill="#ffffff" stroke="#f87171" strokeWidth="1" />
              <text x={mid1.x} y={mid1.y - 2} textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#dc2626" fontFamily="monospace">
                {s1.toFixed(3)} {unit === 'meter' ? 'm' : 'ft'}
              </text>
            </g>

            {/* Edge 2 (P2-P3) */}
            <g>
              <rect x={mid2.x + 4} y={mid2.y - 8} width="64" height="16" rx="4" fill="#ffffff" stroke="#f87171" strokeWidth="1" />
              <text x={mid2.x + 36} y={mid2.y + 4} textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#dc2626" fontFamily="monospace">
                {s2.toFixed(3)} {unit === 'meter' ? 'm' : 'ft'}
              </text>
            </g>

            {/* Edge 3 (P3-P4) */}
            <g>
              <rect x={mid3.x - 32} y={mid3.y + 4} width="64" height="16" rx="4" fill="#ffffff" stroke="#f87171" strokeWidth="1" />
              <text x={mid3.x} y={mid3.y + 16} textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#dc2626" fontFamily="monospace">
                {s3.toFixed(3)} {unit === 'meter' ? 'm' : 'ft'}
              </text>
            </g>

            {/* Edge 4 (P4-P1) */}
            <g>
              <rect x={mid4.x - 68} y={mid4.y - 8} width="64" height="16" rx="4" fill="#ffffff" stroke="#f87171" strokeWidth="1" />
              <text x={mid4.x - 36} y={mid4.y + 4} textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#dc2626" fontFamily="monospace">
                {s4.toFixed(3)} {unit === 'meter' ? 'm' : 'ft'}
              </text>
            </g>

            {/* Diagonal (P1-P3) RED LABEL */}
            <g>
              <rect x={midDiag.x - 34} y={midDiag.y - 8} width="68" height="16" rx="4" fill="#ffffff" stroke="#f87171" strokeWidth="1" />
              <text x={midDiag.x} y={midDiag.y + 4} textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#dc2626" fontFamily="monospace">
                {dDiag.toFixed(3)} {unit === 'meter' ? 'm' : 'ft'}
              </text>
            </g>

            {/* 4 BLUE DOTS FOR VERTICES */}
            {canvasPoints.map((p, idx) => (
              <g
                key={`vertex-${idx}`}
                onPointerDown={(e) => handlePointerDown(idx, e)}
                className="cursor-move"
              >
                {/* Generous touch hitbox */}
                <circle cx={p.x} cy={p.y} r="20" fill="transparent" />
                {/* Solid Blue Dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={activeNode === idx ? '8.5' : '7'}
                  fill="#2563eb"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                />
                <text
                  x={p.x + (idx === 1 || idx === 2 ? 11 : -18)}
                  y={p.y + (idx === 0 || idx === 1 ? -11 : 17)}
                  fontSize="11"
                  fontWeight="bold"
                  fill="#1d4ed8"
                  fontFamily="monospace"
                >
                  P{idx + 1}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* 4. TOTAL AREA DISPLAY IN ALL UNITS AT THE BOTTOM (sq ft, m², Acre, Hectare, Nepali units, etc.) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Calculated Parcel Total Area (Triangle Decomposition)
          </span>
          <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400">
            T1 ({t1AreaUnit.toFixed(2)}) + T2 ({t2AreaUnit.toFixed(2)})
          </span>
        </div>

        {/* 1. Square Feet & Square Meter */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Square Feet</span>
            <div className="text-lg font-mono font-bold text-slate-900 dark:text-slate-100">
              {totalAreaSqFt.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">sq ft</span>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Square Meter</span>
            <div className="text-lg font-mono font-bold text-slate-900 dark:text-slate-100">
              {totalAreaSqM.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">m²</span>
          </div>
        </div>

        {/* 2. Acre & Hectare */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Acre</span>
            <div className="text-base font-mono font-bold text-slate-900 dark:text-slate-100">
              {acre.toFixed(4)}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">ac (1 ac = 43,560 sq ft)</span>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Hectare</span>
            <div className="text-base font-mono font-bold text-slate-900 dark:text-slate-100">
              {hectare.toFixed(4)}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">ha (1 ha = 10,000 m²)</span>
          </div>
        </div>

        {/* 3. Nepali Traditional Systems */}
        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Nepali Land Measurement Units
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Ropani-Aana-Paisa-Daam */}
            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block">Ropani - Aana - Paisa - Daam (R-A-P-D)</span>
              <div className="text-base font-mono font-bold text-blue-600 dark:text-blue-400">
                {ropaniFormatted}
              </div>
              <span className="text-[10px] text-slate-400">
                {ropani} Ropani, {aana} Aana, {paisa} Paisa, {daam} Daam
              </span>
            </div>

            {/* Bigha-Kattha-Dhur */}
            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block">Bigha - Kattha - Dhur (B-K-D)</span>
              <div className="text-base font-mono font-bold text-blue-600 dark:text-blue-400">
                {bighaFormatted}
              </div>
              <span className="text-[10px] text-slate-400">
                {bigha} Bigha, {kattha} Kattha, {dhur} Dhur
              </span>
            </div>
          </div>
        </div>

        {/* 4. Global International Units Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-mono">
          <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 block">Square Yards</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{sqYd.toFixed(3)}</span>
          </div>
          <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 block">Khetmuri</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{khetmuri.toFixed(4)}</span>
          </div>
          <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 block">Square Miles</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{sqMi.toFixed(6)}</span>
          </div>
          <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 block">Square Km</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{sqKm.toFixed(6)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
