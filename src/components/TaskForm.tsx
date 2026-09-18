import { useEffect, useState } from "react";
import { todayISO, type Priority, type Task, type TaskDraft } from "@/lib/tasks";

const priorities: { value: Priority; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Med" },
  { value: "low", label: "Low" },
];

const activeChip: Record<Priority, string> = {
  high: "bg-high/12 text-high ring-high/30 font-medium",
  medium: "bg-med/15 text-med ring-med/30 font-medium",
  low: "bg-low/12 text-low ring-low/30 font-medium",
};

export function TaskForm({
  task,
  onSubmit,
  onCancel,
  submitLabel = "Add to today",
}: {
  task?: Task;
  onSubmit: (draft: TaskDraft) => void;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState(todayISO());

  useEffect(() => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setPriority(task?.priority ?? "medium");
    setDueDate(task?.dueDate ?? todayISO());
  }, [task]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim(), priority, dueDate });
    if (!task) {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate(todayISO());
    }
  }

  return (
    <form onSubmit={submit} className="mt-3 space-y-2.5">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="field"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        placeholder="Add a short description"
        className="field resize-none"
      />
      <div className="grid grid-cols-2 gap-2.5">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="field font-mono text-xs"
        />
        <div className="flex gap-1.5">
          {priorities.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPriority(p.value)}
              className={`flex-1 rounded-xl px-2 py-2.5 font-mono text-[11px] ring-1 transition-colors ${
                priority === p.value
                  ? activeChip[p.value]
                  : "bg-card/50 text-ink-soft ring-line"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-line bg-card/50 py-3 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="flex-1 rounded-xl bg-brand py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-brand-deep"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
