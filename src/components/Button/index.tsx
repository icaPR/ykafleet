import { TouchableOpacityProps } from "react-native";
import { Container, Loading, Title } from "./styles";

type Props = TouchableOpacityProps & {
  title: string;
  isLoading?: boolean;
};

export function Button({ isLoading = false, title, ...rest }: Props) {
  return (
    <Container activeOpacity={0.7} disabled={isLoading} {...rest}>
      {isLoading ? <Loading /> : <Title>{title}</Title>}
    </Container>
  );
}
