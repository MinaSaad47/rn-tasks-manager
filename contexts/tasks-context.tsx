import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Task } from "@/types/task";
import { normalizeInput } from "@/utils/validators";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type TasksContextValue = {
  tasks: Task[];
  addTask: (title: string, description: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, title: string, description: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
  seedTasks: (count?: number) => Promise<void>;
  clearTasks: () => Promise<void>;
  completedCount: number;
  totalCount: number;
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = useCallback(async (title: string, description: string) => {
    const safeTitle = normalizeInput(title);
    const safeDescription = normalizeInput(description);

    if (!safeTitle || !safeDescription) {
      return;
    }

    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: safeTitle,
      description: safeDescription,
      completed: false,
      createdAt: Date.now(),
    };

    await delay(300);
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  }, []);

  const toggleTask = useCallback(async (id: string) => {
    await delay(300);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await delay(300);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }, []);

  const updateTask = useCallback(
    async (id: string, title: string, description: string) => {
      const safeTitle = normalizeInput(title);
      const safeDescription = normalizeInput(description);

      if (!safeTitle || !safeDescription) {
        return;
      }

      await delay(300);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id
            ? { ...task, title: safeTitle, description: safeDescription }
            : task,
        ),
      );
    },
    [],
  );

  const getTaskById = useCallback(
    (id: string) => tasks.find((task) => task.id === id),
    [tasks],
  );

  const seedTasks = useCallback(async (count = 20) => {
    const titles = [
      "Refine onboarding flow",
      "Review API contract",
      "Fix checkout edge case",
      "Prepare sprint notes",
      "Improve loading states",
      "Update test coverage",
      "Optimize list rendering",
      "Audit accessibility labels",
      "Plan release checklist",
      "Document task behavior",
    ];

    const descriptions = [
      "Align behavior with product expectations and keep implementation concise.",
      "Validate edge cases and ensure the UI gives clear user feedback.",
      "Coordinate with design to match spacing, hierarchy, and icon usage.",
      "Capture follow-ups and risks before closing the task.",
      "Verify interaction polish on both light and dark themes.",
    ];

    const safeCount = Math.max(1, Math.min(count, 100));

    const seeded: Task[] = Array.from({ length: safeCount }, (_, index) => {
      const title = titles[index % titles.length];
      const description = descriptions[index % descriptions.length];
      const now = Date.now() - index * 60000;

      return {
        id: `${now}-${Math.random().toString(16).slice(2)}`,
        title,
        description,
        completed: index % 3 === 0,
        createdAt: now,
      };
    });

    await delay(250);
    setTasks((prevTasks) => [...seeded, ...prevTasks]);
  }, []);

  const clearTasks = useCallback(async () => {
    await delay(150);
    setTasks([]);
  }, []);

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks],
  );

  const value = useMemo(
    () => ({
      tasks,
      addTask,
      toggleTask,
      deleteTask,
      updateTask,
      getTaskById,
      seedTasks,
      clearTasks,
      completedCount,
      totalCount: tasks.length,
    }),
    [
      tasks,
      addTask,
      toggleTask,
      deleteTask,
      updateTask,
      getTaskById,
      seedTasks,
      clearTasks,
      completedCount,
    ],
  );

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export function useTasksContext() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasksContext must be used within TasksProvider");
  }
  return context;
}
