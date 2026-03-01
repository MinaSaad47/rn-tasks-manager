import { router, useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import
{
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { TaskNotFoundState } from "@/components/task-not-found-state";
import { useTasksContext } from "@/contexts/tasks-context";
import { useAppTheme } from "@/hooks/use-app-theme";
import { hasContent, normalizeInput } from "@/utils/validators";

export default function EditTaskScreen()
{
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTaskById, updateTask } = useTasksContext();
  const theme = useAppTheme();

  const task = useMemo(
    () => (id ? getTaskById(id) : undefined),
    [id, getTaskById],
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() =>
  {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
  }, [task]);

  const canSave = useMemo(
    () => hasContent(title) && hasContent(description) && !isSaving,
    [title, description, isSaving],
  );

  if (!id || !task)
  {
    return (
      <TaskNotFoundState
        title="Task not found"
        message="The task may have been deleted before editing."
        onBack={() => router.back()}
      />
    );
  }

  const handleSave = async () =>
  {
    const safeTitle = normalizeInput(title);
    const safeDescription = normalizeInput(description);

    if (!hasContent(safeTitle) || !hasContent(safeDescription))
    {
      setError("Title and description are required.");
      return;
    }

    setError("");
    setIsSaving(true);
    try
    {
      await updateTask(task.id, safeTitle, safeDescription);
      Toast.show({ type: "success", text1: "Task updated" });
      router.replace({ pathname: "/tasks/[id]", params: { id: task.id } });
    } finally
    {
      setIsSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.titleRow}>
        <SymbolView
          name={{ ios: "pencil", android: "edit", web: "edit" }}
          size={18}
          tintColor={theme.colors.primary}
        />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Edit Task
        </Text>
      </View>
      <Text style={[styles.subtitle, { color: theme.colors.mutedText }]}>
        Refine the task details and keep context clear.
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
          onPress={() =>
            router.replace({ pathname: "/tasks/[id]", params: { id: task.id } })
          }
          disabled={isSaving}
        >
          <Text style={[styles.buttonText, { color: theme.colors.text }]}>
            Cancel
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.button,
            {
              backgroundColor: canSave
                ? theme.colors.primary
                : theme.colors.mutedText,
            },
          ]}
          onPress={handleSave}
          disabled={!canSave}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <View style={styles.primaryActionContent}>
              <SymbolView
                name={{ ios: "checkmark", android: "check", web: "check" }}
                size={14}
                tintColor="#ffffff"
              />
              <Text style={styles.buttonText}>Save</Text>
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
