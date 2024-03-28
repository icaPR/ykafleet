import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.GRAY_800};
`;

export const Content = styled.View`
  flex: 1;
  gap: 16px;
  padding: 32px;
`;

export const Label = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONT_SIZE.SM}px;

  color: ${({ theme }) => theme.COLORS.GRAY_300};
`;

export const LicensePlate = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.XXXL}px;

  color: ${({ theme }) => theme.COLORS.GRAY_100};
`;
export const Description = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;

  color: ${({ theme }) => theme.COLORS.GRAY_100};
  text-align: justify;
`;

export const Footer = styled.View`
  width: 100%;
  padding: 32px;
  flex-direction: row;
  gap: 16px;
  margin-top: 32px;
`;

export const AsyncMessage = styled.Text`
  flex: 1;
  margin: 32px;
  text-align: center;

  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONT_SIZE.SM}px;

  color: ${({ theme }) => theme.COLORS.GRAY_300};
`;
