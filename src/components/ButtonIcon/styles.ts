import styled from "styled-components/native";

export const Container = styled.TouchableOpacity`
  width: 56px;
  height: 56px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
`;
