import * as dotenv from "dotenv";

dotenv.config();

module.exports = {
  expo: {
    name: "ykafleet",
    slug: "ykafleet",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#202024",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#202024",
      },
      package: "com.ykapr.ykafleet",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API,
        },
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "expo-font",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow $(PRODUCT_NAME) to use your location.",
        },
      ],
    ],
  },
};
