import { Dimensions } from "react-native";
import styled from "styled-components/native";

const dimensions = Dimensions.get("window");

export const Container = styled.View`
  width: ${dimensions.width}px;
  padding-bottom: 5px;
  flex-direction: row;

  position: absolute;
  z-index: 1;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.COLORS.GRAY_500};
`;

export const Title = styled.Text`
  margin-left: 4px;

  font-size: ${({ theme }) => theme.FONT_SIZE.SM}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  color: ${({ theme }) => theme.COLORS.GRAY_100};
`;
