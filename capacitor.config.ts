import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.landsurveypro.app',
  appName: 'Land Survey Pro',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
