import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    LocalNotifications: {
      iconColor: "#FF7F50",
      sound: "beep.wav",
    },
  },
  appId: 'com.jenixindia.gymaccess',
  appName: 'gym access',
  webDir: 'www',
  bundledWebRuntime: false
};

export default config;
