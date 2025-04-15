import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yami_app.app',
  appName: 'Yami',
  webDir: 'build',
  android: {
    webContentsDebuggingEnabled: true
  }
};

export default config;
