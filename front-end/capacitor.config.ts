import { CapacitorConfig } from '@capacitor/cli';
// import { environment } from 'src/environments/environment.prod';

const config: CapacitorConfig = {

  appId: 'com.jenixindia.qrunlock',
  appName: 'qrunlock',
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
      launchFadeOutDuration: 50,
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

    // // google login 
    GoogleAuth: {
      scopes: ['profile', 'email'],
      // androidClientId: ' ',
      // iosClientId:' ',
      serverClientId: '651915982135-kjtianuhb3r7ftbpa426jujm559v5l9d.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },

     
  },


};

export default config;
