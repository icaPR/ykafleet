import { Container, Slogan, Title } from "./styles";

import backgroundImg from "../../assets/background.png";

import { Button } from "../../components/Button";

export function SignIn() {
  return (
    <Container source={backgroundImg}>
      <Title>Yka Fleet</Title>
      <Slogan>Gestão de uso de veículos</Slogan>
      <Button title={"Entrar com Google"} />
    </Container>
  );
}
