import type { AppTheme } from "@/constants/theme";
import { getTheme } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function useAppTheme(): AppTheme {
  const colorScheme = useColorScheme();
  return getTheme(colorScheme);
}
