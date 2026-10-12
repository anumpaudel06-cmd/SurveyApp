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
  Smartphone,
  Maximize2,
} from 'lucide-react';

type Tab = 'calculator' | 'plotter' | 'converter' | 'arithmetic' | 'survey' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('calculator');
  const [plotterMode, setPlotterMode] = useState<'cad' | 'geo'>('cad');
  const [isMobileShell, setIsMobileShell] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-3xl mx-auto px-4 h-13 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <PenTool className="w-3.5 h-3.5 text-zinc-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-semibold tracking-tight text-zinc-100">
                  Land Survey Pro
                </h1>
                <span className="text-[10px] text-zinc-500 font-mono">v1.0</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-[11px] font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
              <span>RTK FIXED</span>
            </div>

            <button
              onClick={() => setIsMobileShell(!isMobileShell)}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              title={isMobileShell ? 'Full Width' : 'Mobile Frame'}
            >
              {isMobileShell ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-start p-2.5 sm:p-4 w-full">
        <div
          className={`w-full transition-all duration-200 ${
            isMobileShell
              ? 'max-w-[400px] bg-zinc-900/40 border border-zinc-800 rounded-2xl p-3 shadow-lg my-2'
              : 'max-w-3xl'
          }`}
        >
          {/* Sub Switch for Plotter */}
          {activeTab === 'plotter' && (
            <div className="flex justify-center mb-3">
              <div className="bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 flex items-center gap-1 text-xs">
                <button
                  onClick={() => setPlotterMode('cad')}
                  className={`px-3 py-1 rounded font-medium flex items-center gap-1.5 transition-colors ${
                    plotterMode === 'cad'
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" /> 2D CAD
                </button>
                <button
                  onClick={() => setPlotterMode('geo')}
                  className={`px-3 py-1 rounded font-medium flex items-center gap-1.5 transition-colors ${
                    plotterMode === 'geo'
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" /> Map View
                </button>
              </div>
            </div>
          )}

          {/* Active Screen View */}
          <div className="min-h-[560px]">
            {activeTab === 'calculator' && <CalculatorScreen />}
            {activeTab === 'plotter' && (plotterMode === 'cad' ? <PlotterScreen /> : <GeoPlotterScreen />)}
            {activeTab === 'converter' && <ConverterScreen />}
            {activeTab === 'arithmetic' && <ArithmeticScreen />}
            {activeTab === 'survey' && <SurveyToolsScreen />}
            {activeTab === 'settings' && <SettingsScreen />}
          </div>
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <nav className="sticky bottom-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800">
        <div className="max-w-3xl mx-auto px-2 py-1.5 grid grid-cols-6 gap-1">
          {/* 1. Calculator */}
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
              activeTab === 'calculator'
                ? 'bg-zinc-800 text-zinc-100 font-medium'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Calculator className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Calculate</span>
          </button>

          {/* 2. Plotter */}
          <button
            onClick={() => setActiveTab('plotter')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
              activeTab === 'plotter'
                ? 'bg-zinc-800 text-zinc-100 font-medium'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <PenTool className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Plotter</span>
          </button>

          {/* 3. Converter */}
          <button
            onClick={() => setActiveTab('converter')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
              activeTab === 'converter'
                ? 'bg-zinc-800 text-zinc-100 font-medium'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Scale className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Convert</span>
          </button>

          {/* 4. Arithmetic */}
          <button
            onClick={() => setActiveTab('arithmetic')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
              activeTab === 'arithmetic'
                ? 'bg-zinc-800 text-zinc-100 font-medium'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Divide className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Arithmetic</span>
          </button>

          {/* 5. Survey Tools */}
          <button
            onClick={() => setActiveTab('survey')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
              activeTab === 'survey'
                ? 'bg-zinc-800 text-zinc-100 font-medium'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Wrench className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Tools</span>
          </button>

          {/* 6. Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
              activeTab === 'settings'
                ? 'bg-zinc-800 text-zinc-100 font-medium'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Settings className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
