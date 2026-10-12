import React, { useState } from 'react';
import { CalculatorScreen } from './screens/CalculatorScreen';
import { PlotterScreen } from './screens/PlotterScreen';
import { ConverterScreen } from './screens/ConverterScreen';
import { ArithmeticScreen } from './screens/ArithmeticScreen';
import { TraverseScreen } from './screens/TraverseScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import {
  Calculator,
  PenTool,
  Scale,
  Divide,
  Compass,
  Settings,
  Smartphone,
  Maximize2,
} from 'lucide-react';

type Tab = 'calculator' | 'plotter' | 'converter' | 'arithmetic' | 'traverse' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('calculator');
  const [isMobileShell, setIsMobileShell] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-3xl mx-auto px-4 h-13 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <Calculator className="w-3.5 h-3.5 text-zinc-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-semibold tracking-tight text-zinc-100">
                  Land Survey Pro
                </h1>
                <span className="text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.2 rounded font-medium">
                  नापी क्यालकुलेटर
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileShell(!isMobileShell)}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              title={isMobileShell ? 'Full Width' : 'Mobile View'}
            >
              {isMobileShell ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-4 w-full">
        <div
          className={`w-full transition-all duration-200 ${
            isMobileShell
              ? 'max-w-[410px] bg-zinc-900/40 border border-zinc-800 rounded-2xl p-2.5 shadow-lg my-1'
              : 'max-w-2xl'
          }`}
        >
          <div className="min-h-[580px]">
            {activeTab === 'calculator' && <CalculatorScreen />}
            {activeTab === 'plotter' && <PlotterScreen />}
            {activeTab === 'converter' && <ConverterScreen />}
            {activeTab === 'arithmetic' && <ArithmeticScreen />}
            {activeTab === 'traverse' && <TraverseScreen />}
            {activeTab === 'settings' && <SettingsScreen />}
          </div>
        </div>
      </main>

      {/* Bottom 6-Tab Navigation Bar */}
      <nav className="sticky bottom-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800">
        <div className="max-w-2xl mx-auto px-1 py-1.5 grid grid-cols-6 gap-1">
          {/* 1. Calculate */}
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
              activeTab === 'calculator'
                ? 'bg-zinc-800 text-zinc-100 font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Calculator className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">नापी (Area)</span>
          </button>

          {/* 2. Plotter */}
          <button
            onClick={() => setActiveTab('plotter')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
              activeTab === 'plotter'
                ? 'bg-zinc-800 text-zinc-100 font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <PenTool className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">प्ल्टर (Plot)</span>
          </button>

          {/* 3. Converter */}
          <button
            onClick={() => setActiveTab('converter')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
              activeTab === 'converter'
                ? 'bg-zinc-800 text-zinc-100 font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Scale className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">रूपान्तरण</span>
          </button>

          {/* 4. Arithmetic */}
          <button
            onClick={() => setActiveTab('arithmetic')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
              activeTab === 'arithmetic'
                ? 'bg-zinc-800 text-zinc-100 font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Divide className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">हिसाब (Math)</span>
          </button>

          {/* 5. Traverse */}
          <button
            onClick={() => setActiveTab('traverse')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
              activeTab === 'traverse'
                ? 'bg-zinc-800 text-zinc-100 font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Compass className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">ट्राभर्स</span>
          </button>

          {/* 6. Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
              activeTab === 'settings'
                ? 'bg-zinc-800 text-zinc-100 font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Settings className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">सुविधा</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
