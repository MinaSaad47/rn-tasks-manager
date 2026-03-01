import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

import { getTheme } from "@/constants/theme";
import { TasksProvider } from "@/contexts/tasks-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: theme.colors.primary,
          backgroundColor: theme.colors.surface,
        }}
        contentContainerStyle={{ paddingHorizontal: 14 }}
        text1Style={{
          color: theme.colors.text,
          fontSize: 14,
          fontWeight: "700",
        }}
        text2Style={{
          color: theme.colors.mutedText,
          fontSize: 13,
        }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: theme.colors.danger,
          backgroundColor: theme.colors.surface,
        }}
        contentContainerStyle={{ paddingHorizontal: 14 }}
        text1Style={{
          color: theme.colors.text,
          fontSize: 14,
          fontWeight: "700",
        }}
        text2Style={{
          color: theme.colors.mutedText,
          fontSize: 13,
        }}
      />
    ),
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <TasksProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="tasks/create"
              options={{
                title: "Create Task",
                presentation: "formSheet",
                sheetAllowedDetents: [0.55, 0.9],
                sheetInitialDetentIndex: 0,
                sheetGrabberVisible: true,
                sheetCornerRadius: 20,
              }}
            />
            <Stack.Screen
              name="tasks/[id]"
              options={{
                title: "Task Details",
                presentation: "formSheet",
                sheetAllowedDetents: [0.55, 0.9],
                sheetInitialDetentIndex: 0,
                sheetGrabberVisible: true,
                sheetCornerRadius: 20,
              }}
            />
            <Stack.Screen
              name="tasks/[id]/edit"
              options={{
                title: "Edit Task",
                presentation: "formSheet",
                sheetAllowedDetents: [0.55, 0.9],
                sheetInitialDetentIndex: 0,
                sheetGrabberVisible: true,
                sheetCornerRadius: 20,
              }}
            />
          </Stack>
          <Toast config={toastConfig} />
        </TasksProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
