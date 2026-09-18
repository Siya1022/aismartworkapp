import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { sortTasks, todayISO, useTasks, type Task } from "@/lib/tasks";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — Meridian Productivity Assistant" },
      {
        name: "description",
        content: "View, complete, edit and delete every task, sorted by priority.",
      },
      { property: "og:title", content: "Tasks — Meridian Productivity Assistant" },
      {
        property: "og:description",
        content: "View, complete, edit and delete every task, sorted by priority.",
      },
    ],
  }),
  component: TasksPage,
});

type Filter = "today" | "pending" | "completed" | "all";

const filters: { value: Filter; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Done" },
  { value: "all", label: "All" },
];

function TasksPage() {
  const { tasks, toggleTask, deleteTask, updateTask } = useTasks();
  const [filter, setFilter] = useState<Filter>("today");
  const [editing, setEditing] = useState<Task | null>(null);

  const visible = sortTasks(
    tasks.filter((t) => {
      if (filter === "today") return t.dueDate === todayISO();
      if (filter === "pending") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    }),
  );

  return (
    <>
      <section className="rise glass-card p-5">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-semibold tracking-tight">Your tasks</h1>
          <span className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">
            {visible.length} shown
          </span>
        </div>
        <div className="mt-4 flex gap-1.5">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex-1 rounded-xl px-2 py-2 font-mono text-[11px] ring-1 transition-colors ${
                filter === f.value
                  ? "bg-brand text-primary-foreground ring-brand"
                  : "bg-card/50 text-ink-soft ring-line"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {editing && (
        <section className="rise glass-card p-5">
          <h2 className="font-display text-base font-semibold tracking-tight">Edit task</h2>
          <TaskForm
            task={editing}
            submitLabel="Save changes"
            onCancel={() => setEditing(null)}
            onSubmit={(draft) => {
              updateTask(editing.id, draft);
              setEditing(null);
            }}
          />
        </section>
      )}

      <section className="rise glass-card space-y-2.5 p-5" style={{ animationDelay: "80ms" }}>
        {visible.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-card/30 p-6 text-center text-xs text-ink-soft">
            No tasks here yet.
          </p>
        ) : (
          visible.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onEdit={() => setEditing(task)}
              onDelete={() => {
                deleteTask(task.id);
                if (editing?.id === task.id) setEditing(null);
              }}
            />
          ))
        )}
      </section>
    </>
  );
}
