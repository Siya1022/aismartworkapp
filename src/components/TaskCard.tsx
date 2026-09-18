import { formatDate, priorityLabel, type Task } from "@/lib/tasks";

const barColor: Record<Task["priority"], string> = {
  high: "bg-high",
  medium: "bg-med",
  low: "bg-low",
};

const chipColor: Record<Task["priority"], string> = {
  high: "bg-high/12 text-high ring-high/30",
  medium: "bg-med/15 text-med ring-med/30",
  low: "bg-low/12 text-low ring-low/30",
};

export function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-line/70 bg-card/55 p-3 backdrop-blur">
      <span className={`mt-0.5 h-10 w-1 shrink-0 rounded-full ${barColor[task.priority]}`} />

      <button
        onClick={onToggle}
        aria-label={task.completed ? "Mark as pending" : "Mark as complete"}
        className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border transition-colors ${
          task.completed ? "border-low bg-low text-primary-foreground" : "border-line bg-card/60 text-transparent"
        }`}
      >
        <svg viewBox="0 0 12 12" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 6.2 4.8 8.5 9.5 3.5" />
        </svg>
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-medium leading-snug ${
            task.completed ? "text-ink-faint line-through" : "text-ink"
          }`}
        >
          {task.title}
        </p>
        {task.description ? (
          <p className="mt-0.5 text-xs leading-snug text-ink-soft">{task.description}</p>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] font-medium ring-1 ${chipColor[task.priority]}`}
          >
            {priorityLabel[task.priority]}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">
            {formatDate(task.dueDate)}
          </span>
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex shrink-0 flex-col gap-1.5">
          {onEdit && (
            <button
              onClick={onEdit}
              className="rounded-lg border border-line bg-card/60 px-2 py-1 font-mono text-[10px] text-ink-soft transition-colors hover:border-brand/40 hover:text-ink"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="rounded-lg border border-high/30 bg-high/10 px-2 py-1 font-mono text-[10px] text-high transition-colors hover:bg-high/15"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
