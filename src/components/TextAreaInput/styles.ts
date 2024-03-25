import styled from "styled-components/native";

export const Container = styled.View`
  width: 100%;
  height: 150px;
  padding: 16px;
  border-radius: 6px;

  background-color: ${({ theme }) => theme.COLORS.GRAY_700};
`;

export const Label = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONT_SIZE.SM}px;

  color: ${({ theme }) => theme.COLORS.GRAY_300};
`;

export const Input = styled.TextInput`
  vertical-align: top;
  margin-top: 16px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;

  color: ${({ theme }) => theme.COLORS.GRAY_100};
`;
