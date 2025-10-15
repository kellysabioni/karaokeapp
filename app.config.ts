import { ExpoConfig, ConfigContext } from "expo/config";
import "dotenv/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "karaokeapp",
  slug: "karaokeapp",
  scheme: "karaokeapp",
  version: "1.0.0",
  orientation: "portrait",
  icon: "../assets/images/icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,

  splash: {
    image: "../assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },

  ios: {
    supportsTablet: true,
  },

  android: {
    adaptiveIcon: {
      foregroundImage: "../assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },

  web: {
    favicon: "../assets/images/favicon.png",
  },

  plugins: ["expo-router", "expo-audio"],

  extra: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  },
});
