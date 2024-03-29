import styled, { css } from "styled-components/native";

export type SizeProps = "SMALL" | "NORMAL";

type Props = {
  size: SizeProps;
};

const variantSizeStyles = (size: SizeProps) => {
  return {
    SMALL: css`
      width: 32px;
      height: 32px;
    `,
    NORMAL: css`
      width: 46px;
      height: 46px;
    `,
  }[size];
};

export const Container = styled.View<Props>`
  border-radius: 6px;
  margin-right: 12px;
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.COLORS.GRAY_700};

  ${({ size }) => variantSizeStyles(size)}
`;
