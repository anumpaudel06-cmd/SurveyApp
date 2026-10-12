import React, { useState, useEffect } from 'react';
import { Bluetooth, Radio, Server, Activity, ShieldCheck, RefreshCw, Power } from 'lucide-react';

export const NtripConnector: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [host, setHost] = useState<string>('ntrip.survey.gov.np');
  const [port, setPort] = useState<string>('2101');
  const [mountpoint, setMountpoint] = useState<string>('KTM_VRS_RTCM32');
  const [username, setUsername] = useState<string>('survey_user_44');
  const [password, setPassword] = useState<string>('••••••••');
  const [bluetoothDevice, setBluetoothDevice] = useState<string>('CHCNAV i90 GNSS (BT-8842)');

  const [nmeaFeed, setNmeaFeed] = useState<string[]>([
    '$GNGGA,042419.00,2743.0321,N,08519.4402,E,4,24,0.8,1342.12,M,-41.2,M,1.0,0124*4E',
    '$GNRMC,042419.00,A,2743.0321,N,08519.4402,E,0.02,124.5,121026,,,D*76',
    '$GNGSA,A,3,04,09,16,26,27,31,,,,,,,1.4,0.8,1.1*1C',
  ]);

  // Simulate real-time NMEA streaming
  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getUTCHours()).padStart(2, '0')}${String(
        now.getUTCMinutes()
      ).padStart(2, '0')}${String(now.getUTCSeconds()).padStart(2, '0')}.00`;
      const gga = `$GNGGA,${timeStr},2743.032${Math.floor(
        Math.random() * 9
      )},N,08519.440${Math.floor(
        Math.random() * 9
      )},E,4,28,0.7,1342.15,M,-41.2,M,0.8,0124*7A`;
      setNmeaFeed((prev) => [gga, ...prev.slice(0, 4)]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isConnected]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Bluetooth className="w-5 h-5 text-sky-400" />
          <div>
            <h4 className="text-sm font-bold text-white">Bluetooth GNSS & NTRIP RTK Client</h4>
            <p className="text-[10px] text-slate-400">External Rover Receiver Connection</p>
          </div>
        </div>

        <button
          onClick={() => setIsConnected(!isConnected)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            isConnected
              ? 'bg-emerald-950 text-emerald-300 border-emerald-600 hover:bg-emerald-900'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          {isConnected ? 'RTK Active' : 'Disconnected'}
        </button>
      </div>

      {/* Bluetooth Receiver Status */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-sky-400 animate-ping' : 'bg-slate-600'}`} />
          <div>
            <div className="text-xs font-semibold text-slate-200">{bluetoothDevice}</div>
            <div className="text-[10px] text-slate-400">BLE UUID: 0000180d-0000-1000-8000-00805f9b34fb</div>
          </div>
        </div>
        <span className="text-[10px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800 font-mono">
          Paired
        </span>
      </div>

      {/* NTRIP Caster Form */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Server className="w-3.5 h-3.5 text-amber-400" /> NTRIP Caster Settings
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <label className="text-[10px] text-slate-400 block mb-0.5">Caster Host IP/Domain</label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Port</label>
            <input
              type="text"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-xs text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Mountpoint</label>
            <input
              type="text"
              value={mountpoint}
              onChange={(e) => setMountpoint(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* Live NMEA 0183 Diagnostic Console */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 font-medium">
            <Activity className="w-3 h-3 text-emerald-400" /> Live NMEA-0183 GGA Log
          </span>
          <span className="font-mono text-emerald-400 text-[10px]">Correction Age: 0.8s</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-[10.5px] text-emerald-400/90 space-y-1 h-20 overflow-y-auto">
          {nmeaFeed.map((line, i) => (
            <div key={i} className="truncate">
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
