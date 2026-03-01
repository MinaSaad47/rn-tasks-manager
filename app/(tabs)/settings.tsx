import { SymbolView } from "expo-symbols";
import { useState } from "react";
import {
  Alert,
  Appearance,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { useTasksContext } from "@/contexts/tasks-context";
import { useAppTheme } from "@/hooks/use-app-theme";

type ThemeMode = "system" | "light" | "dark";

export default function SettingsScreen() {
  const theme = useAppTheme();
  const { seedTasks, clearTasks } = useTasksContext();
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const setMode = (mode: ThemeMode) => {
    setThemeMode(mode);
    Appearance.setColorScheme(
      (mode === "system" ? "unspecified" : mode) as never,
    );
  };

  const handleSeed = async () => {
    if (isSeeding) return;

    setIsSeeding(true);
    try {
      await seedTasks(20);
      Toast.show({ type: "success", text1: "20 demo tasks added" });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClear = () => {
    if (isClearing) return;

    Alert.alert(
      "Clear all tasks",
      "This will remove all tasks from the current session.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            setIsClearing(true);
            try {
              await clearTasks();
              Toast.show({ type: "success", text1: "All tasks cleared" });
            } finally {
              setIsClearing(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top"]}
    >
      <View style={styles.contentWrap}>
        <View style={styles.headerRow}>
          <SymbolView
            name={{
              ios: "slider.horizontal.3",
              android: "settings",
              web: "settings",
            }}
            size={18}
            tintColor={theme.colors.primary}
          />
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Settings
          </Text>
        </View>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Appearance
          </Text>
          <Text
            style={[styles.sectionSubtitle, { color: theme.colors.mutedText }]}
          >
            Choose how the app should look.
          </Text>

          <View style={styles.modeRow}>
            {(["system", "light", "dark"] as ThemeMode[]).map((mode) => {
              const active = themeMode === mode;
              return (
                <Pressable
                  key={mode}
                  style={[
                    styles.modeButton,
                    {
                      backgroundColor: active
                        ? theme.colors.primary
                        : theme.colors.background,
                      borderColor: active
                        ? theme.colors.primary
                        : theme.colors.border,
                    },
                  ]}
                  onPress={() => setMode(mode)}
                >
                  <Text
                    style={[
                      styles.modeText,
                      { color: active ? "#ffffff" : theme.colors.text },
                    ]}
                  >
                    {mode[0].toUpperCase() + mode.slice(1)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Demo Data
          </Text>
          <Text
            style={[styles.sectionSubtitle, { color: theme.colors.mutedText }]}
          >
            Quick actions for showcasing interactions.
          </Text>

          <View style={styles.demoActions}>
            <Pressable
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={handleSeed}
              disabled={isSeeding}
            >
              <View style={styles.actionContent}>
                <SymbolView
                  name={{
                    ios: "sparkles",
                    android: "auto_awesome",
                    web: "auto_awesome",
                  }}
                  size={14}
                  tintColor="#ffffff"
                />
                <Text style={styles.actionText}>
                  {isSeeding ? "Seeding..." : "Seed 20 Tasks"}
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.danger },
              ]}
              onPress={handleClear}
              disabled={isClearing}
            >
              <View style={styles.actionContent}>
                <SymbolView
                  name={{ ios: "trash", android: "delete", web: "delete" }}
                  size={14}
                  tintColor="#ffffff"
                />
                <Text style={styles.actionText}>
                  {isClearing ? "Clearing..." : "Clear All Tasks"}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrap: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  sectionSubtitle: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 10,
  },
  modeRow: {
    flexDirection: "row",
    gap: 8,
  },
  modeButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  modeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  demoActions: {
    gap: 8,
  },
  actionButton: {
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
