import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Priority = "high" | "medium" | "low";

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string; // yyyy-mm-dd
  completed: boolean;
  createdAt: string;
  completedAt?: string;
};

export type TaskDraft = Omit<Task, "id" | "completed" | "createdAt" | "completedAt">;

const STORAGE_KEY = "meridian.tasks.v1";

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function seedTasks(): Task[] {
  const today = todayISO();
  const now = new Date().toISOString();
  return [
    {
      id: "seed-1",
      title: "Finalise the client proposal",
      description: "Tighten the pricing section and send for review.",
      priority: "high",
      dueDate: today,
      completed: false,
      createdAt: now,
    },
    {
      id: "seed-2",
      title: "Reply to interview email",
      description: "Confirm availability for Thursday.",
      priority: "medium",
      dueDate: today,
      completed: false,
      createdAt: now,
    },
    {
      id: "seed-3",
      title: "Morning planning session",
      description: "Set the top three outcomes for the day.",
      priority: "low",
      dueDate: today,
      completed: true,
      createdAt: now,
      completedAt: now,
    },
  ];
}

type TaskContextValue = {
  tasks: Task[];
  ready: boolean;
  addTask: (draft: TaskDraft) => void;
  updateTask: (id: string, draft: TaskDraft) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
};

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setTasks(raw ? (JSON.parse(raw) as Task[]) : seedTasks());
    } catch {
      setTasks(seedTasks());
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, ready]);

  const addTask = useCallback((draft: TaskDraft) => {
    setTasks((prev) => [
      {
        ...draft,
        id: crypto.randomUUID(),
        completed: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  const updateTask = useCallback((id: string, draft: TaskDraft) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...draft } : t)));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next: Task = { ...t, completed: !t.completed };
        if (next.completed) next.completedAt = new Date().toISOString();
        else delete next.completedAt;
        return next;
      }),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(
    () => ({ tasks, ready, addTask, updateTask, toggleTask, deleteTask }),
    [tasks, ready, addTask, updateTask, toggleTask, deleteTask],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used inside TaskProvider");
  return ctx;
}

export function useTaskStats() {
  const { tasks } = useTasks();
  return useMemo(() => {
    const today = todayISO();
    const todays = tasks.filter((t) => t.dueDate === today);
    const done = todays.filter((t) => t.completed).length;
    const pending = todays.length - done;
    const highPending = todays.filter((t) => !t.completed && t.priority === "high").length;
    const percent = todays.length === 0 ? 0 : Math.round((done / todays.length) * 100);
    return { todays, done, pending, highPending, percent, total: todays.length };
  }, [tasks]);
}

export const priorityLabel: Record<Priority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const priorityRank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export function sortTasks(tasks: Task[]) {
  return [...tasks].sort(
    (a, b) =>
      Number(a.completed) - Number(b.completed) ||
      priorityRank[a.priority] - priorityRank[b.priority] ||
      a.dueDate.localeCompare(b.dueDate),
  );
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
