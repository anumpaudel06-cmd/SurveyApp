import React, { useState } from 'react';
import { CalculatorScreen } from './screens/CalculatorScreen';
import { PlotterScreen } from './screens/PlotterScreen';
import { GeoPlotterScreen } from './screens/GeoPlotterScreen';
import { ConverterScreen } from './screens/ConverterScreen';
import { ArithmeticScreen } from './screens/ArithmeticScreen';
import { SurveyToolsScreen } from './screens/SurveyToolsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import {
  Calculator,
  PenTool,
  Scale,
  Divide,
  Wrench,
  Settings,
  Globe,
  Radio,
  Smartphone,
  Maximize2,
  Share2,
  HelpCircle,
} from 'lucide-react';

type Tab = 'calculator' | 'plotter' | 'converter' | 'arithmetic' | 'survey' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('calculator');
  const [plotterMode, setPlotterMode] = useState<'cad' | 'geo'>('cad');
  const [isMobileShell, setIsMobileShell] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <PenTool className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-extrabold tracking-tight text-white">
                  Land Survey <span className="text-emerald-400">Pro</span>
                </h1>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-1.5 py-0.2 rounded font-mono font-bold">
                  v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5">
                Cadastral Engineering & Multi-Unit Geomatics
              </p>
            </div>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-2">
            {/* GNSS Fix Status Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-emerald-300 font-bold">RTK FIXED</span>
              <span className="text-slate-500 text-[10px]">±0.012m</span>
            </div>

            {/* Phone Bezel Viewport Toggle */}
            <button
              onClick={() => setIsMobileShell(!isMobileShell)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
              title={isMobileShell ? 'Switch to Fullscreen' : 'Switch to Mobile Frame'}
            >
              {isMobileShell ? <Maximize2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container / Mobile Shell Wrapper */}
      <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 w-full">
        <div
          className={`w-full transition-all duration-300 ${
            isMobileShell
              ? 'max-w-[420px] bg-slate-900/40 border-4 border-slate-800 rounded-[38px] p-3 shadow-2xl my-2'
              : 'max-w-4xl'
          }`}
        >
          {/* Sub-Switch for Plotter Screen (2D CAD vs Satellite Geo-Map) */}
          {activeTab === 'plotter' && (
            <div className="flex justify-center mb-4">
              <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
                <button
                  onClick={() => setPlotterMode('cad')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    plotterMode === 'cad'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" /> 2D CAD Shoelace
                </button>
                <button
                  onClick={() => setPlotterMode('geo')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    plotterMode === 'geo'
                      ? 'bg-sky-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" /> Satellite Geo-Plotter
                </button>
              </div>
            </div>
          )}

          {/* Active Screen View */}
          <div className="min-h-[600px]">
            {activeTab === 'calculator' && <CalculatorScreen />}
            {activeTab === 'plotter' && (plotterMode === 'cad' ? <PlotterScreen /> : <GeoPlotterScreen />)}
            {activeTab === 'converter' && <ConverterScreen />}
            {activeTab === 'arithmetic' && <ArithmeticScreen />}
            {activeTab === 'survey' && <SurveyToolsScreen />}
            {activeTab === 'settings' && <SettingsScreen />}
          </div>
        </div>
      </main>

      {/* Bottom Sticky Tab Navigation Bar (6 Tabs) */}
      <nav className="sticky bottom-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 pb-safe">
        <div className="max-w-4xl mx-auto px-2 py-1.5 grid grid-cols-6 gap-1">
          {/* 1. Calculator */}
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === 'calculator'
                ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Calculator</span>
          </button>

          {/* 2. Plotter */}
          <button
            onClick={() => setActiveTab('plotter')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === 'plotter'
                ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PenTool className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Plotter</span>
          </button>

          {/* 3. Converter */}
          <button
            onClick={() => setActiveTab('converter')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === 'converter'
                ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Converter</span>
          </button>

          {/* 4. Arithmetic */}
          <button
            onClick={() => setActiveTab('arithmetic')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === 'arithmetic'
                ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Divide className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Arithmetic</span>
          </button>

          {/* 5. Survey Tools */}
          <button
            onClick={() => setActiveTab('survey')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === 'survey'
                ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Survey</span>
          </button>

          {/* 6. Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === 'settings'
                ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
