import React from "react";
import { StyleSheet, FlatList } from "react-native";

import { TaskItem } from "./task-item";
import type { Task } from "../types/task";

type TaskListProps = {
  tasks: Task[];
};

export function TaskList({ tasks }: TaskListProps) {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TaskItem task={item} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      testID="task-list"
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 108,
  },
});
