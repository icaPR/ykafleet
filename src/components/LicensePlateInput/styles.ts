import { TextInput } from "react-native";
import styled from "styled-components/native";

export const Container = styled.View`
  width: 100%;
  padding: 16px;
  border-radius: 6px;

  background-color: ${({ theme }) => theme.COLORS.GRAY_700};
`;

export const Label = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONT_SIZE.SM}px;

  color: ${({ theme }) => theme.COLORS.GRAY_300};
`;

export const Input = styled(TextInput)`
  margin-top: 16px;
  text-align: center;

  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.XXL}px;

  color: ${({ theme }) => theme.COLORS.GRAY_200};
`;
