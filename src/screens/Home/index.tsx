import { Container, Content, Label, Title } from "./styles";
import { HomeHeader } from "../../components/HomeHeader";
import { CarStatus } from "../../components/CarStatus";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useRealm } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";
import { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import { HistoricCard, HistoricCardProps } from "../../components/HistoricCard";
import { useUser } from "@realm/react";
import dayjs from "dayjs";
import { ProgressDirection, ProgressMode } from "realm";
import {
  getLastSyncTimestamp,
  saveLastSyncTimestamp,
} from "../../libs/asyncStorage/syncStorage";
import Toast from "react-native-toast-message";
import { TopMessage } from "../../components/TopMessage";
import { CloudArrowUp } from "phosphor-react-native";

export function Home() {
  const { navigate } = useNavigation();
  const realm = useRealm();
  const user = useUser();

  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);
  const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>(
    []
  );
  const [percentageToSync, setPercentageToSync] = useState<string | null>(null);

  const historic = useQuery(Historic);

  function handleRegister() {
    if (vehicleInUse?._id) {
      return navigate("arrival", { id: vehicleInUse._id.toString() });
    } else {
      navigate("departure");
    }
  }

  function fetchVehicleInUse() {
    try {
      const vehicle = historic.filtered("status = 'departure'")[0];
      setVehicleInUse(vehicle);
    } catch (error) {
      Alert.alert(
        "Veículo em uso",
        "Não foi possível carregar veículo em uso.	"
      );
    }
  }

  async function fetchHistoric() {
    try {
      const response = historic.filtered(
        "status = 'arrival' SORT(created_at DESC)"
      );
      const lastSync = await getLastSyncTimestamp();

      const formattedHistoric = response.map((item) => {
        return {
          id: item._id!.toString(),
          licensePlate: item.license_plate!,
          created: dayjs(item.created_at).format(
            "[Saída em] DD/MM/YYYY  [ás] HH:mm"
          ),
          isSync: lastSync > item.updated_at!.getTime(),
        };
      });
      setVehicleHistoric(formattedHistoric);
    } catch (error) {
      Alert.alert("Histórico", "Não foi possível carregar o histórico.");
    }
  }

  function handleHistoricDetails(id: string) {
    navigate("arrival", { id });
  }

  async function progressNotification(
    transferred: number,
    transferable: number
  ) {
    const percentage = (transferred / transferable) * 100;

    if (percentage === 100) {
      await saveLastSyncTimestamp();
      await fetchHistoric();
      setPercentageToSync(null);
      Toast.show({
        type: "info",
        text1: "Todos os dados estão sincronizado",
      });
    }

    if (percentage < 100) {
      setPercentageToSync(`${percentage.toFixed(0)}% sincronizado.`);
    }
  }

  useEffect(() => {
    fetchVehicleInUse();
  }, []);

  useEffect(() => {
    realm.addListener("change", () => fetchVehicleInUse());

    return () => {
      if (realm && !realm.isClosed) {
        realm.removeListener("change", () => fetchVehicleInUse);
      }
    };
  }, []);

  useEffect(() => {
    fetchHistoric();
  }, [historic]);

  useEffect(() => {
    realm.subscriptions.update((mutableSubs, realm) => {
      const historicByUserQuery = realm
        .objects("Historic")
        .filtered(`user_id = '${user!.id}'`);

      mutableSubs.add(historicByUserQuery, { name: "historic_by_user" });
    });
  }, [realm]);

  useEffect(() => {
    const syncSession = realm.syncSession;
    if (!syncSession) {
      return;
    } else {
      syncSession.addProgressNotification(
        ProgressDirection.Upload,
        ProgressMode.ReportIndefinitely,
        progressNotification
      );
    }

    return () => syncSession.removeProgressNotification(progressNotification);
  }, [historic]);

  return (
    <Container>
      <HomeHeader />
      {percentageToSync && (
        <TopMessage title={percentageToSync} icon={CloudArrowUp} />
      )}
      <Content>
        <CarStatus
          onPress={handleRegister}
          licensePlate={vehicleInUse?.license_plate}
        />
        <Title>Histório</Title>
        <FlatList
          data={vehicleHistoric}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoricCard
              data={item}
              onPress={() => handleHistoricDetails(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={<Label>Nehum veículo utilizado.</Label>}
        />
      </Content>
    </Container>
  );
}
