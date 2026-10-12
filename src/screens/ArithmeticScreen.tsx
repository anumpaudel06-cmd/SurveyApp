import React, { useState } from 'react';
import {
  ropaniToSqFt,
  bighaToSqFt,
  getAllUnitsFromSqFt,
} from '../units';
import { UnitResultsBadge } from '../components/UnitResultsBadge';
import {
  Plus,
  Minus,
  Divide,
  X,
  Users,
  Trash2,
} from 'lucide-react';

interface PlotItem {
  id: string;
  name: string;
  system: 'ropani' | 'bigha' | 'sqft';
  // Ropani
  r: string;
  a: string;
  p: string;
  d: string;
  // Bigha
  b: string;
  k: string;
  dh: string;
  // Direct
  sqftVal: string;
}

export const ArithmeticScreen: React.FC = () => {
  // Mode: 'add' (Add Plots) | 'sub' (Subtract) | 'split' (Heir Division) | 'mul' (Multiply)
  const [opMode, setOpMode] = useState<'add' | 'sub' | 'split' | 'mul'>('add');

  // 1. ADD MODE: Multiple Plots List
  const [plots, setPlots] = useState<PlotItem[]>([
    {
      id: '1',
      name: 'Plot 1',
      system: 'ropani',
      r: '1',
      a: '2',
      p: '1',
      d: '0',
      b: '0',
      k: '0',
      dh: '0',
      sqftVal: '0',
    },
    {
      id: '2',
      name: 'Plot 2',
      system: 'ropani',
      r: '0',
      a: '14',
      p: '3',
      d: '2',
      b: '0',
      k: '0',
      dh: '0',
      sqftVal: '0',
    },
  ]);

  // Helper to compute plot sq ft
  const getPlotSqFt = (plot: PlotItem): number => {
    if (plot.system === 'ropani') {
      return ropaniToSqFt(
        parseFloat(plot.r) || 0,
        parseFloat(plot.a) || 0,
        parseFloat(plot.p) || 0,
        parseFloat(plot.d) || 0
      );
    } else if (plot.system === 'bigha') {
      return bighaToSqFt(
        parseFloat(plot.b) || 0,
        parseFloat(plot.k) || 0,
        parseFloat(plot.dh) || 0
      );
    } else {
      return parseFloat(plot.sqftVal) || 0;
    }
  };

  const handleAddPlot = () => {
    const nextNum = plots.length + 1;
    setPlots([
      ...plots,
      {
        id: String(Date.now()),
        name: `Plot ${nextNum}`,
        system: 'ropani',
        r: '0',
        a: '4',
        p: '0',
        d: '0',
        b: '0',
        k: '0',
        dh: '0',
        sqftVal: '0',
      },
    ]);
  };

  const handleRemovePlot = (id: string) => {
    if (plots.length > 1) {
      setPlots(plots.filter((p) => p.id !== id));
    }
  };

  const updatePlot = (id: string, field: string, val: string) => {
    setPlots((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  // 2. SUBTRACT MODE: Total Land - Deducted Land
  const [subSystem, setSubSystem] = useState<'ropani' | 'bigha'>('ropani');
  const [subR1, setSubR1] = useState<string>('2');
  const [subA1, setSubA1] = useState<string>('8');
  const [subP1, setSubP1] = useState<string>('0');
  const [subD1, setSubD1] = useState<string>('0');
  const [subB1, setSubB1] = useState<string>('1');
  const [subK1, setSubK1] = useState<string>('5');
  const [subDh1, setSubDh1] = useState<string>('0');

  const [subR2, setSubR2] = useState<string>('0');
  const [subA2, setSubA2] = useState<string>('6');
  const [subP2, setSubP2] = useState<string>('2');
  const [subD2, setSubD2] = useState<string>('0');
  const [subB2, setSubB2] = useState<string>('0');
  const [subK2, setSubK2] = useState<string>('4');
  const [subDh2, setSubDh2] = useState<string>('0');

  // 3. SPLIT / HEIRS DIVISION MODE
  const [splitSystem, setSplitSystem] = useState<'ropani' | 'bigha'>('ropani');
  const [splitR, setSplitR] = useState<string>('4');
  const [splitA, setSplitA] = useState<string>('0');
  const [splitP, setSplitP] = useState<string>('0');
  const [splitD, setSplitD] = useState<string>('0');
  const [splitB, setSplitB] = useState<string>('2');
  const [splitK, setSplitK] = useState<string>('10');
  const [splitDh, setSplitDh] = useState<string>('0');
  const [heirsCount, setHeirsCount] = useState<string>('4');

  // 4. MULTIPLY MODE
  const [mulSystem, setMulSystem] = useState<'ropani' | 'bigha'>('ropani');
  const [mulR, setMulR] = useState<string>('0');
  const [mulA, setMulA] = useState<string>('4');
  const [mulP, setMulP] = useState<string>('0');
  const [mulD, setMulD] = useState<string>('0');
  const [mulB, setMulB] = useState<string>('0');
  const [mulK, setMulK] = useState<string>('2');
  const [mulDh, setMulDh] = useState<string>('0');
  const [multiplier, setMultiplier] = useState<string>('5');

  // Compute Active Operation SqFt
  let resultSqFt = 0;
  let titleBadge = '';

  if (opMode === 'add') {
    resultSqFt = plots.reduce((sum, p) => sum + getPlotSqFt(p), 0);
    titleBadge = 'Total Combined Area (Sum)';
  } else if (opMode === 'sub') {
    const origSqFt =
      subSystem === 'ropani'
        ? ropaniToSqFt(parseFloat(subR1) || 0, parseFloat(subA1) || 0, parseFloat(subP1) || 0, parseFloat(subD1) || 0)
        : bighaToSqFt(parseFloat(subB1) || 0, parseFloat(subK1) || 0, parseFloat(subDh1) || 0);

    const dedSqFt =
      subSystem === 'ropani'
        ? ropaniToSqFt(parseFloat(subR2) || 0, parseFloat(subA2) || 0, parseFloat(subP2) || 0, parseFloat(subD2) || 0)
        : bighaToSqFt(parseFloat(subB2) || 0, parseFloat(subK2) || 0, parseFloat(subDh2) || 0);

    resultSqFt = Math.max(0, origSqFt - dedSqFt);
    titleBadge = 'Remaining Balance Land';
  } else if (opMode === 'split') {
    const totalSqFt =
      splitSystem === 'ropani'
        ? ropaniToSqFt(parseFloat(splitR) || 0, parseFloat(splitA) || 0, parseFloat(splitP) || 0, parseFloat(splitD) || 0)
        : bighaToSqFt(parseFloat(splitB) || 0, parseFloat(splitK) || 0, parseFloat(splitDh) || 0);

    const count = Math.max(1, parseFloat(heirsCount) || 1);
    resultSqFt = totalSqFt / count;
    titleBadge = `Per Person Share (${count} Heirs)`;
  } else if (opMode === 'mul') {
    const singleSqFt =
      mulSystem === 'ropani'
        ? ropaniToSqFt(parseFloat(mulR) || 0, parseFloat(mulA) || 0, parseFloat(mulP) || 0, parseFloat(mulD) || 0)
        : bighaToSqFt(parseFloat(mulB) || 0, parseFloat(mulK) || 0, parseFloat(mulDh) || 0);

    const m = Math.max(0, parseFloat(multiplier) || 1);
    resultSqFt = singleSqFt * m;
    titleBadge = `Multiplied Area (${m} Plots)`;
  }

  const results = getAllUnitsFromSqFt(resultSqFt);

  return (
    <div className="space-y-3 pb-8 max-w-xl mx-auto">
      {/* 1. Operation Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-xs grid grid-cols-4 gap-1 text-xs font-medium">
        <button
          onClick={() => setOpMode('add')}
          className={`py-2 px-1 rounded-lg text-center flex flex-col items-center justify-center transition-colors ${
            opMode === 'add'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </div>
          <span className="text-[10px] opacity-75 mt-0.5">Sum Plots</span>
        </button>

        <button
          onClick={() => setOpMode('sub')}
          className={`py-2 px-1 rounded-lg text-center flex flex-col items-center justify-center transition-colors ${
            opMode === 'sub'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-1">
            <Minus className="w-3.5 h-3.5" />
            <span>Subtract</span>
          </div>
          <span className="text-[10px] opacity-75 mt-0.5">Deduct Land</span>
        </button>

        <button
          onClick={() => setOpMode('split')}
          className={`py-2 px-1 rounded-lg text-center flex flex-col items-center justify-center transition-colors ${
            opMode === 'split'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>Divide</span>
          </div>
          <span className="text-[10px] opacity-75 mt-0.5">Heir Shares</span>
        </button>

        <button
          onClick={() => setOpMode('mul')}
          className={`py-2 px-1 rounded-lg text-center flex flex-col items-center justify-center transition-colors ${
            opMode === 'mul'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-1">
            <X className="w-3.5 h-3.5" />
            <span>Multiply</span>
          </div>
          <span className="text-[10px] opacity-75 mt-0.5">Repeat Plots</span>
        </button>
      </div>

      {/* 2. MODE 1: ADD MULTIPLE PLOTS */}
      {opMode === 'add' && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Land Parcels List ({plots.length} Parcels)
            </span>
            <button
              onClick={handleAddPlot}
              className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 flex items-center gap-1 text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Plot</span>
            </button>
          </div>

          {plots.map((plot, idx) => {
            const sqft = getPlotSqFt(plot);
            return (
              <div
                key={plot.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono font-bold text-[11px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={plot.name}
                      onChange={(e) => updatePlot(plot.id, 'name', e.target.value)}
                      className="text-xs font-semibold text-slate-800 dark:text-slate-200 bg-transparent border-none outline-none focus:underline"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={plot.system}
                      onChange={(e) => updatePlot(plot.id, 'system', e.target.value)}
                      className="text-[11px] font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 text-slate-700 dark:text-slate-300 outline-none"
                    >
                      <option value="ropani">Ropani System</option>
                      <option value="bigha">Bigha System</option>
                      <option value="sqft">Sq Ft</option>
                    </select>

                    {plots.length > 1 && (
                      <button
                        onClick={() => handleRemovePlot(plot.id)}
                        className="text-slate-400 hover:text-rose-600 p-0.5"
                        title="Remove plot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Plot Inputs */}
                {plot.system === 'ropani' && (
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">Ropani</span>
                      <input
                        type="number"
                        min="0"
                        value={plot.r}
                        onChange={(e) => updatePlot(plot.id, 'r', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-center font-mono font-bold text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">Aana</span>
                      <input
                        type="number"
                        min="0"
                        max="15"
                        value={plot.a}
                        onChange={(e) => updatePlot(plot.id, 'a', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-center font-mono font-bold text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">Paisa</span>
                      <input
                        type="number"
                        min="0"
                        max="3"
                        value={plot.p}
                        onChange={(e) => updatePlot(plot.id, 'p', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-center font-mono font-bold text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">Daam</span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={plot.d}
                        onChange={(e) => updatePlot(plot.id, 'd', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-center font-mono font-bold text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                )}

                {plot.system === 'bigha' && (
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">Bigha</span>
                      <input
                        type="number"
                        min="0"
                        value={plot.b}
                        onChange={(e) => updatePlot(plot.id, 'b', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-center font-mono font-bold text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">Kattha</span>
                      <input
                        type="number"
                        min="0"
                        max="19"
                        value={plot.k}
                        onChange={(e) => updatePlot(plot.id, 'k', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-center font-mono font-bold text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">Dhur</span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={plot.dh}
                        onChange={(e) => updatePlot(plot.id, 'dh', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-center font-mono font-bold text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                )}

                {plot.system === 'sqft' && (
                  <div>
                    <input
                      type="number"
                      step="any"
                      placeholder="Enter Sq Ft"
                      value={plot.sqftVal}
                      onChange={(e) => updatePlot(plot.id, 'sqftVal', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-3 py-1.5 font-mono font-bold text-slate-900 dark:text-slate-100 text-xs"
                    />
                  </div>
                )}

                <div className="text-[11px] text-slate-500 text-right font-mono">
                  Parcel Area: {sqft.toLocaleString('en-US', { maximumFractionDigits: 1 })} sq ft
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. MODE 2: SUBTRACT LAND */}
      {opMode === 'sub' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Land Subtraction
            </span>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setSubSystem('ropani')}
                className={`px-2.5 py-0.5 rounded ${subSystem === 'ropani' ? 'bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Ropani
              </button>
              <button
                onClick={() => setSubSystem('bigha')}
                className={`px-2.5 py-0.5 rounded ${subSystem === 'bigha' ? 'bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Bigha
              </button>
            </div>
          </div>

          {/* Initial Land */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              1. Total Original Parcel:
            </label>
            {subSystem === 'ropani' ? (
              <div className="grid grid-cols-4 gap-2">
                <input
                  type="number"
                  placeholder="Ropani"
                  value={subR1}
                  onChange={(e) => setSubR1(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Aana"
                  value={subA1}
                  onChange={(e) => setSubA1(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Paisa"
                  value={subP1}
                  onChange={(e) => setSubP1(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Daam"
                  value={subD1}
                  onChange={(e) => setSubD1(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="Bigha"
                  value={subB1}
                  onChange={(e) => setSubB1(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Kattha"
                  value={subK1}
                  onChange={(e) => setSubK1(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Dhur"
                  value={subDh1}
                  onChange={(e) => setSubDh1(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
              </div>
            )}
          </div>

          {/* Deduct Portion */}
          <div>
            <label className="text-[11px] font-semibold text-rose-600 block mb-1">
              2. Portion to Deduct / Sold / Road (-):
            </label>
            {subSystem === 'ropani' ? (
              <div className="grid grid-cols-4 gap-2">
                <input
                  type="number"
                  placeholder="Ropani"
                  value={subR2}
                  onChange={(e) => setSubR2(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Aana"
                  value={subA2}
                  onChange={(e) => setSubA2(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Paisa"
                  value={subP2}
                  onChange={(e) => setSubP2(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Daam"
                  value={subD2}
                  onChange={(e) => setSubD2(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="Bigha"
                  value={subB2}
                  onChange={(e) => setSubB2(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Kattha"
                  value={subK2}
                  onChange={(e) => setSubK2(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Dhur"
                  value={subDh2}
                  onChange={(e) => setSubDh2(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. MODE 3: SPLIT / HEIRS DIVISION */}
      {opMode === 'split' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Inheritance Partition
            </span>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setSplitSystem('ropani')}
                className={`px-2.5 py-0.5 rounded ${splitSystem === 'ropani' ? 'bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Ropani
              </button>
              <button
                onClick={() => setSplitSystem('bigha')}
                className={`px-2.5 py-0.5 rounded ${splitSystem === 'bigha' ? 'bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Bigha
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Total Parcel to Partition:
            </label>
            {splitSystem === 'ropani' ? (
              <div className="grid grid-cols-4 gap-2">
                <input
                  type="number"
                  placeholder="Ropani"
                  value={splitR}
                  onChange={(e) => setSplitR(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Aana"
                  value={splitA}
                  onChange={(e) => setSplitA(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Paisa"
                  value={splitP}
                  onChange={(e) => setSplitP(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Daam"
                  value={splitD}
                  onChange={(e) => setSplitD(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="Bigha"
                  value={splitB}
                  onChange={(e) => setSplitB(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Kattha"
                  value={splitK}
                  onChange={(e) => setSplitK(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Dhur"
                  value={splitDh}
                  onChange={(e) => setSplitDh(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
              </div>
            )}
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 block mb-1">
              Number of Heirs / Equal Shares:
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={heirsCount}
                onChange={(e) => setHeirsCount(e.target.value)}
                className="w-24 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 font-mono font-bold text-sm text-slate-900 dark:text-slate-100"
              />
              <div className="flex gap-1.5 text-xs">
                {['2', '3', '4', '5'].map((num) => (
                  <button
                    key={num}
                    onClick={() => setHeirsCount(num)}
                    className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                  >
                    {num} Heirs
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODE 4: MULTIPLY */}
      {opMode === 'mul' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Multiply Standard Plots
            </span>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setMulSystem('ropani')}
                className={`px-2.5 py-0.5 rounded ${mulSystem === 'ropani' ? 'bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Ropani
              </button>
              <button
                onClick={() => setMulSystem('bigha')}
                className={`px-2.5 py-0.5 rounded ${mulSystem === 'bigha' ? 'bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Bigha
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Unit Plot Size:
            </label>
            {mulSystem === 'ropani' ? (
              <div className="grid grid-cols-4 gap-2">
                <input
                  type="number"
                  placeholder="Ropani"
                  value={mulR}
                  onChange={(e) => setMulR(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Aana"
                  value={mulA}
                  onChange={(e) => setMulA(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Paisa"
                  value={mulP}
                  onChange={(e) => setMulP(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Daam"
                  value={mulD}
                  onChange={(e) => setMulD(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="Bigha"
                  value={mulB}
                  onChange={(e) => setMulB(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Kattha"
                  value={mulK}
                  onChange={(e) => setMulK(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Dhur"
                  value={mulDh}
                  onChange={(e) => setMulDh(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono text-xs font-bold"
                />
              </div>
            )}
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 block mb-1">
              Quantity / Multiplier (×):
            </label>
            <input
              type="number"
              min="1"
              value={multiplier}
              onChange={(e) => setMultiplier(e.target.value)}
              className="w-24 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 font-mono font-bold text-sm text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
      )}

      {/* 6. Results Output Badge */}
      <UnitResultsBadge results={results} title={titleBadge} />
    </div>
  );
};
