import { useEffect } from "react";
import { Header } from "../../components/Header";
import {
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
} from "./styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button } from "../../components/Button";
import { ButtonIcon } from "../../components/ButtonIcon";
import { X } from "phosphor-react-native";
import { Historic } from "../../libs/realm/schemas/Historic";
import { useObject, useRealm } from "../../libs/realm";
import { BSON } from "realm";
import { Alert } from "react-native";

type RoutePropsProps = {
  id: string;
};

export function Arrival() {
  const route = useRoute();
  const { goBack } = useNavigation();

  const { id } = route.params as RoutePropsProps;

  const realm = useRealm();
  const histotic = useObject(Historic, new BSON.UUID(id) as unknown as string);

  function handleRemoveVehicleUsage() {
    Alert.alert("Cancelar", "Cancelar a utilização veículo?", [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: () => removeVehicleUsage(),
      },
    ]);
  }

  function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(histotic);
    });
    goBack();
  }

  function handleArrivalRegister() {
    try {
      if (!histotic) {
        return Alert.alert(
          "Error",
          "Não foi possível obter os dados para registrar a chegada do veículo."
        );
      }
      realm.write(() => {
        histotic.status = "arrival";
        histotic.updated_at = new Date();
      });
      Alert.alert("Chegada", "Chegada foi registrada com sucesso!");
      goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Não foi possível registrar a chegada do veículo.");
    }
  }

  return (
    <Container>
      <Header title={"Chegada"} />
      <Content>
        <Label>Placa do veículo</Label>
        <LicensePlate>{histotic?.license_plate}</LicensePlate>

        <Label>Finalidade</Label>
        <Description>{histotic?.description}</Description>
        <Footer>
          <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage} />
          <Button title={"Registrar Chegada"} onPress={handleArrivalRegister} />
        </Footer>
      </Content>
    </Container>
  );
}
