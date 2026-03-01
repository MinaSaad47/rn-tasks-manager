import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/hooks/use-app-theme";

type TaskNotFoundStateProps = {
  title?: string;
  message?: string;
  backLabel?: string;
  onBack: () => void;
};

export function TaskNotFoundState({
  title = "Task not found",
  message = "This task is no longer available.",
  backLabel = "Back",
  onBack,
}: TaskNotFoundStateProps) {
  const theme = useAppTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      testID="task-not-found-state"
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <SymbolView
          name={{
            ios: "exclamationmark.circle",
            android: "error_outline",
            web: "error_outline",
          }}
          size={22}
          tintColor={theme.colors.mutedText}
        />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.message, { color: theme.colors.mutedText }]}>
          {message}
        </Text>

        <Pressable
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={onBack}
        >
          <Text style={styles.buttonText}>{backLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 22,
  },
  title: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  message: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  button: {
    marginTop: 16,
    minWidth: 120,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
