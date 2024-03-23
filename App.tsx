import { ThemeProvider } from "styled-components/native";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

import { AppProvider, UserProvider } from "@realm/react";

import theme from "./src/theme";

import { SignIn } from "./src/screens/SignIn";
import { Loading } from "./src/components/Loading";
import { StatusBar } from "react-native";
import { REALM_APP_ID } from "@env";
import { Routes } from "./src/routes";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  const [fontLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  if (!fontLoaded) {
    return <Loading />;
  }

  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <StatusBar
            barStyle={"light-content"}
            backgroundColor={"transparent"}
            translucent
          />
          <UserProvider fallback={SignIn}>
            <Routes />
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
