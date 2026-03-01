export type AppTheme = {
  colors: {
    background: string;
    surface: string;
    text: string;
    mutedText: string;
    border: string;
    primary: string;
    primaryPressed: string;
    danger: string;
    dangerPressed: string;
    completedBg: string;
    completedText: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
  };
};

const shared = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 18,
  },
};

export const lightTheme: AppTheme = {
  ...shared,
  colors: {
    background: "#f5f6f8",
    surface: "#ffffff",
    text: "#111318",
    mutedText: "#6b7280",
    border: "#d9dee5",
    primary: "#0f766e",
    primaryPressed: "#0d635d",
    danger: "#c24141",
    dangerPressed: "#a73737",
    completedBg: "#ecfdf5",
    completedText: "#166534",
  },
};

export const darkTheme: AppTheme = {
  ...shared,
  colors: {
    background: "#101418",
    surface: "#171c22",
    text: "#e7eaee",
    mutedText: "#9aa3ae",
    border: "#2a323d",
    primary: "#34d399",
    primaryPressed: "#2fc18d",
    danger: "#e57373",
    dangerPressed: "#d96060",
    completedBg: "#123028",
    completedText: "#bbf7d0",
  },
};

export function getTheme(
  scheme: "light" | "dark" | null | undefined,
): AppTheme {
  return scheme === "dark" ? darkTheme : lightTheme;
}
