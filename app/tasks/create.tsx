import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SymbolView } from "expo-symbols";
import Toast from "react-native-toast-message";

import { useTasksContext } from "@/contexts/tasks-context";
import { useAppTheme } from "@/hooks/use-app-theme";
import { hasContent, normalizeInput } from "@/utils/validators";

export default function CreateTaskScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addTask } = useTasksContext();
  const theme = useAppTheme();

  const canSubmit =
    hasContent(title) && hasContent(description) && !isSubmitting;

  const handleCreate = async () => {
    const safeTitle = normalizeInput(title);
    const safeDescription = normalizeInput(description);

    if (!hasContent(safeTitle) || !hasContent(safeDescription)) {
      setError("Title and description are required.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await addTask(safeTitle, safeDescription);
      Toast.show({ type: "success", text1: "Task created" });
      Keyboard.dismiss();
      router.back();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.titleRow}>
        <SymbolView
          name={{ ios: "square.and.pencil", android: "edit", web: "edit" }}
          size={18}
          tintColor={theme.colors.primary}
        />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Create New Task
        </Text>
      </View>
      <Text style={[styles.subtitle, { color: theme.colors.mutedText }]}>
        Capture a concise title and useful context.
      </Text>

      {!!error && (
        <Text style={[styles.error, { color: theme.colors.danger }]}>
          {error}
        </Text>
      )}

      <Text style={[styles.label, { color: theme.colors.mutedText }]}>
        Title
      </Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Task title"
        placeholderTextColor={theme.colors.mutedText}
        autoFocus
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          },
        ]}
      />

      <Text style={[styles.label, { color: theme.colors.mutedText }]}>
        Description
      </Text>

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Task description"
        placeholderTextColor={theme.colors.mutedText}
        multiline
        numberOfLines={4}
        style={[
          styles.input,
          styles.description,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          },
        ]}
      />

      <View style={styles.actions}>
        <Pressable
          style={[
            styles.button,
            styles.cancelButton,
            { borderColor: theme.colors.border },
          ]}
          onPress={() => router.back()}
          disabled={isSubmitting}
        >
          <Text style={[styles.buttonText, { color: theme.colors.text }]}>
            Cancel
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.button,
            {
              backgroundColor: canSubmit
                ? theme.colors.primary
                : theme.colors.mutedText,
            },
          ]}
          onPress={handleCreate}
          disabled={!canSubmit}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <View style={styles.primaryActionContent}>
              <SymbolView
                name={{ ios: "plus", android: "add", web: "add" }}
                size={14}
                tintColor="#ffffff"
              />
              <Text style={styles.buttonText}>Add Task</Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 14,
  },
  error: {
    fontSize: 14,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  description: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  button: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#9ca3af",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  primaryActionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
