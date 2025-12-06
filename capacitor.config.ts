import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yami_app.app',
  appName: 'Yami',
  webDir: 'build',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      backgroundColor: "#888888",
      style: "DARK"
    }
  }
};

export default config;
