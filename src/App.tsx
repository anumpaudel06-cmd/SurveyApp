import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
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

function MainApp() {
  const [activeTab, setActiveTab] = useState<Tab>('calculator');
  const [isMobileShell, setIsMobileShell] = useState<boolean>(false);
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      {/* 1. Minimal Clean Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-2xl mx-auto px-4 h-13 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center shadow-xs">
              <Calculator className="w-3.5 h-3.5" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Land Calculator
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileShell(!isMobileShell)}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title={isMobileShell ? 'Full Width View' : 'Mobile Phone View'}
            >
              {isMobileShell ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Canvas */}
      <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-4 w-full">
        <div
          className={`w-full transition-all duration-200 ${
            isMobileShell
              ? 'max-w-[420px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-md my-1'
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

      {/* 3. Fixed Bottom 6-Tab Navigation Bar */}
      <nav className="sticky bottom-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-2xl mx-auto px-1 py-1.5 grid grid-cols-6 gap-1">
          {/* Tab 1: Calculate */}
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors ${
              activeTab === 'calculator'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Calculate</span>
          </button>

          {/* Tab 2: Plotter */}
          <button
            onClick={() => setActiveTab('plotter')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors ${
              activeTab === 'plotter'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <PenTool className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Plotter</span>
          </button>

          {/* Tab 3: Converter */}
          <button
            onClick={() => setActiveTab('converter')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors ${
              activeTab === 'converter'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Scale className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Converter</span>
          </button>

          {/* Tab 4: Arithmetic */}
          <button
            onClick={() => setActiveTab('arithmetic')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors ${
              activeTab === 'arithmetic'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Divide className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Arithmetic</span>
          </button>

          {/* Tab 5: Traverse */}
          <button
            onClick={() => setActiveTab('traverse')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors ${
              activeTab === 'traverse'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Traverse</span>
          </button>

          {/* Tab 6: Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors ${
              activeTab === 'settings'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
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

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
