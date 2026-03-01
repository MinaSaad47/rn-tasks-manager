import { router, useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { TaskNotFoundState } from "@/components/task-not-found-state";
import { useTasksContext } from "@/contexts/tasks-context";
import { useAppTheme } from "@/hooks/use-app-theme";
import type { Task } from "@/types/task";

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTaskById, toggleTask, deleteTask } = useTasksContext();
  const theme = useAppTheme();
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const task = useMemo(
    () => (id ? getTaskById(id) : undefined),
    [id, getTaskById],
  );

  const lastTaskRef = useRef<Task | undefined>(undefined);

  useEffect(() => {
    if (task) {
      lastTaskRef.current = task;
    }
  }, [task]);

  if (!task) {
    return (
      <TaskNotFoundState
        title="Task not found"
        message="It may have been removed or does not exist anymore."
        onBack={() => router.back()}
      />
    );
  }

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await toggleTask(task.id);
      Toast.show({
        type: "success",
        text1: task.completed ? "Marked as incomplete" : "Task completed",
      });
    } finally {
      setIsToggling(false);
    }
  };

  const runDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      Toast.show({ type: "success", text1: "Task deleted" });
      router.back();
    } catch {
      Toast.show({
        type: "error",
        text1: "Delete failed",
        text2: "Please try again.",
      });
      setIsDeleting(false);
    }
  };

  const handleDelete = () => {
    if (isDeleting || isToggling) return;

    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: runDelete },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.headerRow}>
        <SymbolView
          name={{ ios: "doc.text", android: "description", web: "description" }}
          size={18}
          tintColor={theme.colors.primary}
        />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {task.title}
        </Text>
      </View>

      <View
        style={[
          styles.statusChip,
          {
            backgroundColor: task.completed
              ? theme.colors.completedBg
              : theme.colors.background,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <SymbolView
          name={{
            ios: task.completed ? "checkmark.circle" : "clock",
            android: task.completed ? "check_circle" : "schedule",
            web: task.completed ? "check_circle" : "schedule",
          }}
          size={12}
          tintColor={
            task.completed ? theme.colors.completedText : theme.colors.mutedText
          }
        />
        <Text
          style={[
            styles.statusText,
            {
              color: task.completed
                ? theme.colors.completedText
                : theme.colors.mutedText,
            },
          ]}
        >
          {task.completed ? "Completed" : "In progress"}
        </Text>
      </View>

      <Text style={[styles.description, { color: theme.colors.text }]}>
        {task.description}
      </Text>

      <Text style={[styles.meta, { color: theme.colors.mutedText }]}>
        Created: {new Date(task.createdAt).toLocaleString()}
      </Text>

      <View style={styles.actions}>
        <Pressable
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() =>
            router.replace({
              pathname: "/tasks/[id]/edit",
              params: { id: task.id },
            })
          }
          disabled={isToggling || isDeleting}
        >
          <View style={styles.actionContent}>
            <SymbolView
              name={{ ios: "pencil", android: "edit", web: "edit" }}
              size={14}
              tintColor="#ffffff"
            />
            <Text style={styles.buttonText}>Edit</Text>
          </View>
        </Pressable>

        <Pressable
          style={[
            styles.button,
            { backgroundColor: theme.colors.primaryPressed },
          ]}
          onPress={handleToggle}
          disabled={isToggling || isDeleting}
        >
          {isToggling ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <View style={styles.actionContent}>
              <SymbolView
                name={{
                  ios: task.completed ? "arrow.uturn.backward" : "checkmark",
                  android: task.completed ? "undo" : "check",
                  web: task.completed ? "undo" : "check",
                }}
                size={14}
                tintColor="#ffffff"
              />
              <Text style={styles.buttonText}>
                {task.completed ? "Mark Incomplete" : "Mark Complete"}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <Pressable
        style={[styles.deleteButton, { backgroundColor: theme.colors.danger }]}
        onPress={handleDelete}
        disabled={isDeleting || isToggling}
      >
        {isDeleting ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <View style={styles.actionContent}>
            <SymbolView
              name={{ ios: "trash", android: "delete", web: "delete" }}
              size={14}
              tintColor="#ffffff"
            />
            <Text style={styles.buttonText}>Delete Task</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  statusChip: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  meta: {
    fontSize: 13,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 14,
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
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  deleteButton: {
    marginTop: 10,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
