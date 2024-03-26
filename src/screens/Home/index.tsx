import { Container, Content, Label, Title } from "./styles";
import { HomeHeader } from "../../components/HomeHeader";
import { CarStatus } from "../../components/CarStatus";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useRealm } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";
import { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import { HistoricCard, HistoricCardProps } from "../../components/HistoricCard";
import dayjs from "dayjs";

export function Home() {
  const { navigate } = useNavigation();
  const realm = useRealm();

  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);
  const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>(
    []
  );

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

  function fetchHistoric() {
    try {
      const response = historic.filtered(
        "status = 'arrival' SORT(created_at DESC)"
      );

      const formattedHistoric = response.map((item) => {
        return {
          id: item._id!.toString(),
          licensePlate: item.license_plate!,
          created: dayjs(item.created_at).format(
            "[Saída em] DD/MM/YYYY  [ás] HH:mm"
          ),
          isSync: false,
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

  useEffect(() => {
    fetchVehicleInUse();
  }, []);

  useEffect(() => {
    realm.addListener("change", () => fetchVehicleInUse());

    return () => realm.removeListener("change", () => fetchVehicleInUse);
  }, []);

  useEffect(() => {
    fetchHistoric();
  }, [historic]);

  return (
    <Container>
      <HomeHeader />

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
