import { useEffect, useRef, useState } from "react";
import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { LicensePlateInput } from "../../components/LicensePlateInput";
import { TextAreaInput } from "../../components/TextAreaInput";
import { Container, Content, Message } from "./styles";
import { ScrollView, TextInput, Alert } from "react-native";
import { licencePlateValidate } from "../../utils/licensePlateValidate";
import { useUser } from "@realm/react";
import { Historic } from "../../libs/realm/schemas/Historic";
import { useRealm } from "../../libs/realm";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  LocationAccuracy,
  useForegroundPermissions,
  watchPositionAsync,
  LocationSubscription,
} from "expo-location";
import { getAddressLocation } from "../../utils/getAddressLocation";
import { Loading } from "../../components/Loading";

export function Departure() {
  const [description, setDescription] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const [locationForegroundPermission, requestLocationForegroundPermission] =
    useForegroundPermissions();

  const realm = useRealm();
  const user = useUser();

  const { goBack } = useNavigation();

  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  function handleDepartureRegister() {
    try {
      if (!licencePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus();
        return Alert.alert(
          "Placa inválida",
          "A placa é inválida. Por favor, informe a placa correta do veículo."
        );
      }

      if (description.trim().length === 0) {
        descriptionRef.current?.focus();
        return Alert.alert(
          "Finalidade",
          "Por favor, informe a finalidade do veículo."
        );
      }
      setIsRegistering(true);

      realm.write(() => {
        realm.create(
          "Historic",
          Historic.generate({
            user_id: user!.id,
            license_plate: licensePlate.toUpperCase(),
            description,
          })
        );
      });
      Alert.alert("Saída", "A Saída foi  registrar com sucesso!");
      goBack();
    } catch (error) {
      console.error(error);
      return Alert.alert("Error", "Não foi possível registrar.");
      setIsRegistering(false);
    }
  }

  useEffect(() => {
    requestLocationForegroundPermission();
  }, []);

  useEffect(() => {
    if (!locationForegroundPermission?.granted) {
      return;
    }

    let subscription: LocationSubscription;
    watchPositionAsync(
      { accuracy: LocationAccuracy.High, timeInterval: 1000 },
      (location) => {
        getAddressLocation(location.coords)
          .then((response) => console.log(response))
          .finally(() => setIsLoadingLocation(false));
      }
    ).then((response) => (subscription = response));

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [locationForegroundPermission]);

  if (!locationForegroundPermission?.granted) {
    return (
      <Container>
        <Header title={"Saída"} />
        <Message>
          Para registrar uma saida permita o acesso à sua localização. Permita o
          acesso à sua localização, por favor, vá até as configurações do seu
          dispositivo e ative a opção de localização para o nosso aplicativo.
          Obrigado!
        </Message>
      </Container>
    );
  }

  if (isLoadingLocation) {
    return <Loading />;
  }

  return (
    <Container>
      <Header title={"Saída"} />
      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          <Content>
            <LicensePlateInput
              ref={licensePlateRef}
              label={"Placa do veículo"}
              placeholder={"BRA1234"}
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType={"next"}
              onChangeText={setLicensePlate}
            />
            <TextAreaInput
              ref={descriptionRef}
              label={"Finalidade"}
              placeholder={"Vou utilizar o veículo para..."}
              returnKeyType={"send"}
              blurOnSubmit
              onChangeText={setDescription}
            />
            <Button
              title={"Registrar Saída"}
              onPress={handleDepartureRegister}
              isLoading={isRegistering}
            />
          </Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Container>
  );
}
