import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {

  appId: 'com.jenixindia.gymaccess',
  appName: 'gym access',
  webDir: 'www',
  bundledWebRuntime: false,

  plugins: {
    // for push notification
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    LocalNotifications: {
      iconColor: "#FF7F50",
      sound: "beep.wav",
    },
// for splash screen
    SplashScreen: {
      launchShowDuration: 500,
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      // androidSpinnerStyle: "large",
      // iosSpinnerStyle: "small",
      // spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
      // layoutName: "launch_screen",
      // useDialog: true,
    },

  },


};

export default config;
