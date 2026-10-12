import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Smartphone,
  Download,
  Copy,
  Check,
  ExternalLink,
  X,
  Share2,
  PackageCheck,
  CheckCircle,
} from 'lucide-react';

interface InstallPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallPhoneModal: React.FC<InstallPhoneModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState<boolean>(false);

  // App URL for packaging or opening on phone
  const liveUrl = 'https://ais-pre-64xfx65mq75fitltjzn7vg-206384518714.asia-southeast1.run.app';

  if (!isOpen) return null;

  const copyUrl = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Install on Android Phone & .APK Guide
              </h3>
              <p className="text-[11px] text-slate-500">
                Choose the fastest way to install on your phone
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* METHOD 1: INSTANT INSTALL (RECOMMENDED - NO APK NEEDED) */}
        <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-blue-600" />
              Method 1: Instant Phone Install (Recommended)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-semibold">
              Fastest (5 sec)
            </span>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            You do <b>not</b> need to sideload a raw .apk file! This app is configured as a certified <b>Progressive Web App (PWA)</b>. You can install it directly to your phone screen:
          </p>

          {isInstallable && (
            <button
              onClick={handleNativeInstall}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Tap Here to Install App on Phone Now</span>
            </button>
          )}

          {isInstalled && (
            <div className="p-2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>App is already installed on this device!</span>
            </div>
          )}

          {!isInstallable && !isInstalled && !isIOS && (
            <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                How to install on Android Chrome:
              </span>
              <ol className="list-decimal list-inside space-y-1 text-[11px]">
                <li>Open the app URL in Google Chrome on your phone.</li>
                <li>Tap the <b>three dots menu (⋮)</b> in the top right corner.</li>
                <li>Tap <b>"Install app"</b> or <b>"Add to Home screen"</b>.</li>
                <li>The app icon will appear on your phone home screen and works 100% offline!</li>
              </ol>
            </div>
          )}

          {isIOS && (
            <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                How to install on iPhone (Safari):
              </span>
              <ol className="list-decimal list-inside space-y-1 text-[11px]">
                <li>Tap the <b>Share button</b> (box with arrow) at the bottom.</li>
                <li>Scroll down and tap <b>"Add to Home Screen"</b>.</li>
              </ol>
            </div>
          )}
        </div>

        {/* METHOD 2: BUILD / DOWNLOAD STANDALONE .APK FILE */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-emerald-600" />
              Method 2: Generate / Download Standalone .APK File
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
              For Play Store / APK Sideload
            </span>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            If you need an actual <b>.apk file</b> (to send via WhatsApp, bluetooth, or publish to the Google Play Store):
          </p>

          <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Step 1: Copy your App URL:
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={liveUrl}
                  className="w-full text-[10px] font-mono px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                />
                <button
                  onClick={copyUrl}
                  className="px-2 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded text-[10px] font-bold shrink-0 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Step 2: Free 1-Click APK Builder (PWABuilder):
              </span>
              <p className="text-[11px] text-slate-500">
                1. Go to <b>PWABuilder.com</b> (by Microsoft & Google).<br />
                2. Paste your copied App URL and click <b>Start</b>.<br />
                3. Click <b>"Package for Android"</b> &rarr; Download your signed <b>.apk</b> and <b>.aab</b> file!
              </p>
              <a
                href={`https://www.pwabuilder.com?url=${encodeURIComponent(liveUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline pt-0.5"
              >
                <span>Open PWABuilder to Download APK</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
