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
import { stopLocationTask } from "../../tasks/backgroundLocarionTask";
import { getStorageLocations } from "../../libs/asyncStorage/locationStorage";
import { Map } from "../../components/Map";
import { LatLng } from "react-native-maps";
import { getAddressLocation } from "../../utils/getAddressLocation";
import { LocationInfoProps } from "../../components/LocationInfo";
import dayjs from "dayjs";
import { Locations } from "../../components/Locations";

type RoutePropsProps = {
  id: string;
};

export function Arrival() {
  const [dataNotSynced, setDataNotSynced] = useState(false);
  const [coordinates, setCoordinates] = useState<LatLng[]>([]);
  const [departure, setDeparture] = useState<LocationInfoProps>(
    {} as LocationInfoProps
  );
  const [arrival, setArrival] = useState<LocationInfoProps | null>(null);

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

  async function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(historic);
    });
    await stopLocationTask();
    goBack();
  }

  async function handleArrivalRegister() {
    try {
      if (!historic) {
        return Alert.alert(
          "Error",
          "Não foi possível obter os dados para registrar a chegada do veículo."
        );
      }
      const locations = await getStorageLocations();

      realm.write(() => {
        historic.status = "arrival";
        historic.updated_at = new Date();
        historic.coords.push(...locations);
      });

      await stopLocationTask();

      Alert.alert("Chegada", "Chegada foi registrada com sucesso!");
      goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Não foi possível registrar a chegada do veículo.");
    }
  }

  async function getLocationInfo() {
    if (!historic) {
      return;
    }
    const lastSync = await getLastSyncTimestamp();
    const updateAt = historic!.updated_at.getTime();
    setDataNotSynced(updateAt > lastSync);

    if (historic?.status === "departure") {
      const locationsStorage = await getStorageLocations();
      setCoordinates(locationsStorage);
    } else {
      const coords = historic?.coords.map((coord) => {
        return {
          latitude: coord.latitude,
          longitude: coord.longitude,
        };
      });
      setCoordinates(coords ?? []);
    }
    if (historic?.coords[0]) {
      const departureStreetName = await getAddressLocation(historic?.coords[0]);
      setDeparture({
        label: `Saindo em ${departureStreetName ?? ""}`,
        description: dayjs(new Date(historic.coords[0].timestamp)).format(
          "DD/MM/YYYY [ás] HH:mm"
        ),
      });
    }

    if (historic?.status === "arrival") {
      const arrivalStreetName = await getAddressLocation(
        historic.coords[historic.coords.length - 1]
      );
      setArrival({
        label: `Chegando em ${arrivalStreetName ?? ""}`,
        description: dayjs(
          new Date(historic.coords[historic.coords.length - 1].timestamp)
        ).format("DD/MM/YYYY [ás] HH:mm"),
      });
    }
  }

  useEffect(() => {
    getLocationInfo();
  }, [historic]);

  return (
    <Container>
      <Header title={title} />
      {coordinates.length > 0 && <Map coordinates={coordinates} />}
      <Content>
        <Locations departure={departure} arrival={arrival} />
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
