import { Container, Slogan, Title } from "./styles";

import backgroundImg from "../../assets/background.png";

import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { Button } from "../../components/Button";

import { WEB_CLIENT_ID, IOS_CLIENT_ID } from "@env";
import { useState } from "react";
import { Alert } from "react-native";

import { useApp, Realm } from "@realm/react";

GoogleSignin.configure({
  offlineAccess: true,
  scopes: ["email", "profile"],
  webClientId: WEB_CLIENT_ID,
  //iosClientId: IOS_CLIENT_ID,
});

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const app = useApp();

  async function handleGoogleSignIn() {
    try {
      setIsAuthenticating(true);

      const { idToken } = await GoogleSignin.signIn();

      if (idToken) {
        const credentials = Realm.Credentials.jwt(idToken);
        await app.logIn(credentials);
      } else {
        Alert.alert("Entrar", "Não foi possível conectar-se");
        setIsAuthenticating(false);
      }
    } catch (error) {
      setIsAuthenticating(false);
      console.log(error);
      Alert.alert("Entrar", "Não foi possível conectar-se");
    }
  }

  return (
    <Container source={backgroundImg}>
      <Title>Yka Fleet</Title>
      <Slogan>Gestão de uso de veículos</Slogan>
      <Button
        title={"Entrar com Google"}
        isLoading={isAuthenticating}
        onPress={handleGoogleSignIn}
      />
    </Container>
  );
}
