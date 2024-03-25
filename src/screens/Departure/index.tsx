import { useRef } from "react";
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
} from "react-native";

export function Departure() {
  const keyboardAvoidingView =
    Platform.OS === "android" ? "height" : "position";
  const descriptionRef = useRef<TextInput>(null);

  return (
    <Container>
      <DepartureHeader title={"Saída"} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={keyboardAvoidingView}>
        <ScrollView>
          <Content>
            <LicensePlateInput
              label={"Placa do veículo"}
              placeholder={"BRA1234"}
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType={"next"}
            />
            <TextAreaInput
              ref={descriptionRef}
              label={"Finalidade"}
              placeholder={"Vou utilizar o veículo para..."}
              returnKeyType={"send"}
              blurOnSubmit
            />
            <Button title={"Registrar"} />
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
