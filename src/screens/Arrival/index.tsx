import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import {
  AsyncMessage,
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
import { getLastSyncTimestamp } from "../../libs/asyncStorage/syncStorage";

type RoutePropsProps = {
  id: string;
};

export function Arrival() {
  const [dataNotSynced, setDataNotSynced] = useState(false);

  const route = useRoute();
  const { goBack } = useNavigation();

  const { id } = route.params as RoutePropsProps;

  const realm = useRealm();
  const historic = useObject(Historic, new BSON.UUID(id) as unknown as string);
  const title = historic?.status === "departute" ? "Chegada" : "Detalhes";

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
      realm.delete(historic);
    });
    goBack();
  }

  function handleArrivalRegister() {
    try {
      if (!historic) {
        return Alert.alert(
          "Error",
          "Não foi possível obter os dados para registrar a chegada do veículo."
        );
      }
      realm.write(() => {
        historic.status = "arrival";
        historic.updated_at = new Date();
      });
      Alert.alert("Chegada", "Chegada foi registrada com sucesso!");
      goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Não foi possível registrar a chegada do veículo.");
    }
  }

  useEffect(() => {
    getLastSyncTimestamp().then((response) =>
      setDataNotSynced(historic!.updated_at.getTime() > response)
    );
  }, []);

  return (
    <Container>
      <Header title={title} />
      <Content>
        <Label>Placa do veículo</Label>
        <LicensePlate>{historic?.license_plate}</LicensePlate>

        <Label>Finalidade</Label>
        <Description>{historic?.description}</Description>
        {historic?.status === "departure" && (
          <Footer>
            <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage} />
            <Button
              title={"Registrar Chegada"}
              onPress={handleArrivalRegister}
            />
          </Footer>
        )}
      </Content>
      {dataNotSynced && (
        <AsyncMessage>
          Sincronização da
          {historic?.status === "departure" ? " partida " : " chegada "} pedente
        </AsyncMessage>
      )}
    </Container>
  );
}
