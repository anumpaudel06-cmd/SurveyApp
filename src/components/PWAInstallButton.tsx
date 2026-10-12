import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { InstallPhoneModal } from './InstallPhoneModal';
import { Smartphone, Download } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { isInstallable } = usePWAInstall();

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
        title="Install on Android Phone / Download APK"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>Install App / APK</span>
      </button>

      <InstallPhoneModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
