import React, { useState, useEffect } from 'react';
import { Bluetooth, Server, Activity, Power } from 'lucide-react';

export const NtripConnector: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [host, setHost] = useState<string>('ntrip.survey.gov.np');
  const [port, setPort] = useState<string>('2101');
  const [mountpoint, setMountpoint] = useState<string>('KTM_VRS_RTCM32');
  const [username, setUsername] = useState<string>('survey_user_44');
  const [password, setPassword] = useState<string>('••••••••');
  const [bluetoothDevice] = useState<string>('CHCNAV i90 GNSS (BT-8842)');

  const [nmeaFeed, setNmeaFeed] = useState<string[]>([
    '$GNGGA,042419.00,2743.0321,N,08519.4402,E,4,24,0.8,1342.12,M,-41.2,M,1.0,0124*4E',
    '$GNRMC,042419.00,A,2743.0321,N,08519.4402,E,0.02,124.5,121026,,,D*76',
    '$GNGSA,A,3,04,09,16,26,27,31,,,,,,,1.4,0.8,1.1*1C',
  ]);

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
    }, 2500);

    return () => clearInterval(interval);
  }, [isConnected]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Bluetooth className="w-4 h-4 text-zinc-300" />
          <div>
            <h4 className="text-xs font-semibold text-zinc-200">GNSS & NTRIP RTK Client</h4>
            <p className="text-[10px] text-zinc-500">Differential GPS telemetry link</p>
          </div>
        </div>

        <button
          onClick={() => setIsConnected(!isConnected)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${
            isConnected
              ? 'bg-zinc-800 text-zinc-100 border-zinc-700'
              : 'bg-zinc-950 text-zinc-500 border-zinc-800'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          {isConnected ? 'Connected' : 'Disconnected'}
        </button>
      </div>

      {/* Paired receiver */}
      <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 flex items-center justify-between">
        <div>
          <div className="text-xs font-medium text-zinc-200">{bluetoothDevice}</div>
          <div className="text-[10px] text-zinc-500 font-mono">Status: Paired (BLE SPP Port)</div>
        </div>
        <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
          Active
        </span>
      </div>

      {/* NTRIP Caster Form */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
          <Server className="w-3.5 h-3.5 text-zinc-400" /> NTRIP Caster Configuration
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <label className="text-[10px] text-zinc-500 block mb-0.5">Caster Host</label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-xs text-zinc-200"
            />
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 block mb-0.5">Port</label>
            <input
              type="text"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-xs text-zinc-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] text-zinc-500 block mb-0.5">Mountpoint</label>
            <input
              type="text"
              value={mountpoint}
              onChange={(e) => setMountpoint(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-xs text-zinc-200"
            />
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 block mb-0.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-xs text-zinc-200"
            />
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 block mb-0.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-xs text-zinc-200"
            />
          </div>
        </div>
      </div>

      {/* Live NMEA 0183 Diagnostic Console */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span className="flex items-center gap-1 font-medium">
            <Activity className="w-3 h-3 text-zinc-400" /> NMEA-0183 Stream
          </span>
          <span className="font-mono text-zinc-400 text-[10px]">Latency: 0.8s</span>
        </div>
        <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-300 space-y-1 h-20 overflow-y-auto">
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
