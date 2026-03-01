import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";

import { TaskList } from "@/components/task-list";
import { useTasksContext } from "@/contexts/tasks-context";
import { useAppTheme } from "@/hooks/use-app-theme";

function TasksScreenContent() {
  const theme = useAppTheme();
  const { tasks, completedCount, totalCount } = useTasksContext();
  const [filter, setFilter] = useState<"all" | "done" | "todo">("all");
  const pendingCount = totalCount - completedCount;

  const filteredTasks = useMemo(() => {
    if (filter === "done") {
      return tasks.filter((task) => task.completed);
    }

    if (filter === "todo") {
      return tasks.filter((task) => !task.completed);
    }

    return tasks;
  }, [filter, tasks]);

  const containerStyle = {
    ...styles.container,
    backgroundColor: theme.colors.background,
  };

  const fabStyle = { ...styles.fab, backgroundColor: theme.colors.primary };

  return (
    <SafeAreaView style={containerStyle} edges={["top"]}>
      <View style={styles.contentWrap}>
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View style={styles.titleRow}>
              <SymbolView
                name={{
                  ios: "sparkles",
                  android: "auto_awesome",
                  web: "auto_awesome",
                }}
                size={16}
                tintColor={theme.colors.primary}
              />
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Tasks
              </Text>
            </View>
            <View
              style={[
                styles.segmentGroup,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Pressable
                style={[
                  styles.segment,
                  {
                    backgroundColor:
                      filter === "all"
                        ? theme.colors.background
                        : "transparent",
                  },
                ]}
                onPress={() => setFilter("all")}
              >
                <View style={styles.segmentContent}>
                  <SymbolView
                    name={{ ios: "list.bullet", android: "list", web: "list" }}
                    size={12}
                    tintColor={
                      filter === "all"
                        ? theme.colors.text
                        : theme.colors.mutedText
                    }
                  />
                  <Text
                    style={[
                      styles.segmentText,
                      {
                        color:
                          filter === "all"
                            ? theme.colors.text
                            : theme.colors.mutedText,
                      },
                    ]}
                  >
                    All
                  </Text>
                  <Text
                    style={[
                      styles.segmentCount,
                      {
                        color:
                          filter === "all"
                            ? theme.colors.text
                            : theme.colors.mutedText,
                      },
                    ]}
                  >
                    {totalCount}
                  </Text>
                </View>
              </Pressable>

              <Pressable
                style={[
                  styles.segment,
                  {
                    backgroundColor:
                      filter === "todo"
                        ? theme.colors.background
                        : "transparent",
                  },
                ]}
                onPress={() => setFilter("todo")}
              >
                <View style={styles.segmentContent}>
                  <SymbolView
                    name={{
                      ios: "circle",
                      android: "radio_button_unchecked",
                      web: "radio_button_unchecked",
                    }}
                    size={12}
                    tintColor={
                      filter === "todo"
                        ? theme.colors.text
                        : theme.colors.mutedText
                    }
                  />
                  <Text
                    style={[
                      styles.segmentText,
                      {
                        color:
                          filter === "todo"
                            ? theme.colors.text
                            : theme.colors.mutedText,
                      },
                    ]}
                  >
                    Todo
                  </Text>
                  <Text
                    style={[
                      styles.segmentCount,
                      {
                        color:
                          filter === "todo"
                            ? theme.colors.text
                            : theme.colors.mutedText,
                      },
                    ]}
                  >
                    {pendingCount}
                  </Text>
                </View>
              </Pressable>

              <Pressable
                style={[
                  styles.segment,
                  {
                    backgroundColor:
                      filter === "done"
                        ? theme.colors.completedBg
                        : "transparent",
                  },
                ]}
                onPress={() => setFilter("done")}
              >
                <View style={styles.segmentContent}>
                  <SymbolView
                    name={{
                      ios: "checkmark.circle",
                      android: "check_circle",
                      web: "check_circle",
                    }}
                    size={12}
                    tintColor={
                      filter === "done"
                        ? theme.colors.completedText
                        : theme.colors.mutedText
                    }
                  />
                  <Text
                    style={[
                      styles.segmentText,
                      {
                        color:
                          filter === "done"
                            ? theme.colors.completedText
                            : theme.colors.mutedText,
                      },
                    ]}
                  >
                    Done
                  </Text>
                  <Text
                    style={[
                      styles.segmentCount,
                      {
                        color:
                          filter === "done"
                            ? theme.colors.completedText
                            : theme.colors.mutedText,
                      },
                    ]}
                  >
                    {completedCount}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>

        {filteredTasks.length === 0 ? (
          <View style={styles.emptyWrap}>
            <View
              style={[
                styles.emptyCard,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                },
              ]}
            >
              <SymbolView
                name={{
                  ios: "checklist.checked",
                  android: "checklist",
                  web: "checklist",
                }}
                size={30}
                tintColor={theme.colors.primary}
              />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                {filter === "done"
                  ? "No completed tasks"
                  : filter === "todo"
                    ? "Nothing pending"
                    : "No tasks yet"}
              </Text>
              <Text
                style={[styles.emptyText, { color: theme.colors.mutedText }]}
              >
                {filter === "done"
                  ? "Complete a task and it will appear here."
                  : filter === "todo"
                    ? "All tasks are completed. Great job!"
                    : "Tap the plus button to create your first task."}
              </Text>
            </View>
          </View>
        ) : (
          <TaskList tasks={filteredTasks} />
        )}
      </View>

      <Pressable
        style={styles.fabContainer}
        onPress={() => router.push("/tasks/create")}
        testID="add-task-fab"
      >
        <View style={fabStyle}>
          <SymbolView
            name={{ ios: "plus", android: "add", web: "add" }}
            size={24}
            tintColor="#ffffff"
          />
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

export default function TasksScreen() {
  return <TasksScreenContent />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrap: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    marginBottom: 12,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  segmentGroup: {
    flexDirection: "row",
    borderRadius: 999,
    paddingHorizontal: 4,
    paddingVertical: 4,
    width: 258,
    gap: 4,
  },
  segment: {
    flex: 1,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 6,
    alignItems: "center",
  },
  segmentContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: "600",
  },
  segmentCount: {
    fontSize: 12,
    fontWeight: "700",
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 18,
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    paddingVertical: 36,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  fabContainer: {
    position: "absolute",
    bottom: 28,
    right: 24,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.24,
    shadowRadius: 8,
    elevation: 6,
  },
});
