import { useState } from "react";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SymbolView } from "expo-symbols";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Toast from "react-native-toast-message";

import { useTasksContext } from "@/contexts/tasks-context";
import { useAppTheme } from "@/hooks/use-app-theme";
import type { Task } from "@/types/task";

type TaskItemProps = {
  task: Task;
};

export function TaskItem({ task }: TaskItemProps) {
  const theme = useAppTheme();
  const { toggleTask, deleteTask } = useTasksContext();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isBusy = isCompleting || isDeleting;

  const handleToggle = async () => {
    if (isBusy) return;

    setIsCompleting(true);
    try {
      await toggleTask(task.id);
      Toast.show({
        type: "success",
        text1: task.completed ? "Marked as incomplete" : "Task completed",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const runDelete = async () => {
    if (isBusy) return;

    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      Toast.show({ type: "success", text1: "Task deleted" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: runDelete },
    ]);
  };

  const containerStyle = StyleSheet.flatten([
    styles.container,
    {
      backgroundColor: task.completed
        ? theme.colors.completedBg
        : theme.colors.surface,
      borderColor: theme.colors.border,
    },
  ]);

  const checkboxStyle = StyleSheet.flatten([
    styles.checkbox,
    {
      borderColor: task.completed ? theme.colors.primary : theme.colors.border,
    },
    task.completed && { backgroundColor: theme.colors.primary },
  ]);

  const titleStyle = StyleSheet.flatten([
    styles.title,
    { color: task.completed ? theme.colors.completedText : theme.colors.text },
    task.completed && styles.titleCompleted,
  ]);

  const descriptionStyle = StyleSheet.flatten([
    styles.description,
    { color: theme.colors.mutedText },
  ]);

  const shortDescription =
    task.description.length > 96
      ? `${task.description.slice(0, 96).trimEnd()}...`
      : task.description;

  const rightActions = () => (
    <Pressable
      style={({ pressed }) => [
        styles.deleteButton,
        {
          backgroundColor: pressed
            ? theme.colors.dangerPressed
            : theme.colors.danger,
        },
      ]}
      onPress={handleDelete}
      disabled={isBusy}
      testID={`delete-action-${task.id}`}
    >
      {isDeleting ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <View style={styles.deleteContent}>
          <SymbolView
            name={{ ios: "trash", android: "delete", web: "delete" }}
            size={14}
            tintColor="#ffffff"
          />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </View>
      )}
    </Pressable>
  );

  const openDetails = () => {
    if (isBusy) return;

    router.push({
      pathname: "/tasks/[id]",
      params: { id: task.id },
    });
  };

  return (
    <Swipeable
      renderRightActions={rightActions}
      rightThreshold={24}
      overshootRight={false}
    >
      <View style={containerStyle}>
        {task.completed && (
          <View
            style={[styles.ribbon, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.ribbonText}>COMPLETED</Text>
          </View>
        )}
        <View style={styles.content} testID={`task-item-${task.id}`}>
          <Pressable
            style={checkboxStyle}
            onPress={handleToggle}
            disabled={isBusy}
            hitSlop={8}
            testID={`task-toggle-${task.id}`}
          >
            {isCompleting ? (
              <ActivityIndicator
                size="small"
                color={task.completed ? "#ffffff" : theme.colors.primary}
              />
            ) : task.completed ? (
              <View style={styles.checkboxInner} />
            ) : null}
          </Pressable>

          <Pressable
            style={styles.textContainer}
            onPress={openDetails}
            disabled={isBusy}
            hitSlop={6}
            testID={`task-view-${task.id}`}
          >
            <View style={styles.titleRow}>
              <Text style={titleStyle}>{task.title}</Text>
              <SymbolView
                name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
                size={14}
                tintColor={theme.colors.mutedText}
              />
            </View>
            <Text style={descriptionStyle} numberOfLines={2}>
              {shortDescription}
            </Text>
          </Pressable>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  ribbon: {
    position: "absolute",
    right: -28,
    top: 10,
    width: 110,
    alignItems: "center",
    paddingVertical: 2,
    transform: [{ rotate: "35deg" }],
    zIndex: 2,
  },
  ribbonText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 7,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: "#ffffff",
    borderRadius: 2,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 3,
  },
  titleCompleted: {
    textDecorationLine: "line-through",
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    minHeight: 38,
  },
  deleteButton: {
    width: 88,
    borderRadius: 14,
    marginLeft: 8,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  deleteButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
});
