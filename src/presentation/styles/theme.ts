import type { Theme } from "@react-navigation/native";

export const colors = {
  background: "#f7f3e8",
  border: "#d8d0bf",
  danger: "#b3261e",
  muted: "#6f6a5f",
  primary: "#176b87",
  primaryPressed: "#0f5268",
  surface: "#fffdf8",
  text: "#1d1b16"
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
} as const;

export const theme = {
  navigation: {
    dark: false,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.danger
    },
    fonts: {
      regular: { fontFamily: "System", fontWeight: "400" },
      medium: { fontFamily: "System", fontWeight: "500" },
      bold: { fontFamily: "System", fontWeight: "700" },
      heavy: { fontFamily: "System", fontWeight: "800" }
    }
  } satisfies Theme
} as const;
