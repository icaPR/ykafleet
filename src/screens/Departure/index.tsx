import { useRef, useState } from "react";
import { Button } from "../../components/Button";
import { DepartureHeader } from "../../components/DepartureHeader";
import { LicensePlateInput } from "../../components/LicensePlateInput";
import { TextAreaInput } from "../../components/TextAreaInput";
import { Container, Content } from "./styles";
import {
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { licencePlateValidate } from "../../utils/licensePlateValidate";
import { useUser } from "@realm/react";
import { Historic } from "../../libs/realm/schemas/Historic";
import { useRealm } from "../../libs/realm";
import { useNavigation } from "@react-navigation/native";

export function Departure() {
  const [description, setDescription] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const realm = useRealm();
  const user = useUser();

  const { goBack } = useNavigation();

  const keyboardAvoidingView =
    Platform.OS === "android" ? "height" : "position";
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

  return (
    <Container>
      <DepartureHeader title={"Saída"} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={keyboardAvoidingView}>
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
      </KeyboardAvoidingView>
    </Container>
  );
}
