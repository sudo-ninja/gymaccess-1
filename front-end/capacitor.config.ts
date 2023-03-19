import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
  appId: 'com.jenixindia.gymaccess',
  appName: 'gym-access',
  webDir: 'www',
  bundledWebRuntime: false
};

export default config;
