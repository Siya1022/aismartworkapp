import { createFileRoute, Link } from "@tanstack/react-router";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { sortTasks, useTasks, useTaskStats } from "@/lib/tasks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today — Meridian Productivity Assistant" },
      {
        name: "description",
        content: "See today's tasks, your completed work and your daily progress at a glance.",
      },
      { property: "og:title", content: "Today — Meridian Productivity Assistant" },
      {
        property: "og:description",
        content: "See today's tasks, your completed work and your daily progress at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { addTask, toggleTask } = useTasks();
  const { todays, done, pending, highPending, percent, total } = useTaskStats();
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const focus = sortTasks(todays.filter((t) => !t.completed)).slice(0, 3);

  return (
    <>
      <section className="rise glass-card p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
              Today
            </p>
            <p className="mt-1 font-display text-xl font-semibold tracking-tight">
              Good day, Alex
            </p>
          </div>
          <span className="rounded-full border border-line bg-card/60 px-2.5 py-1 font-mono text-[10px] tracking-wide text-ink-soft">
            {today}
          </span>
        </div>
        <div className="mt-5 flex items-end justify-between">
          <p className="font-display text-5xl font-semibold leading-none tracking-tight">
            {percent}
            <span className="text-2xl text-ink-faint">%</span>
          </p>
          <p className="pb-1 font-mono text-[11px] text-ink-soft">
            {done} / {total} done
          </p>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand to-brand-light transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <Stat label="Done" value={done} tone="text-low" />
          <Stat label="Pending" value={pending} tone="text-ink" />
          <Stat label="High" value={highPending} tone="text-high" />
        </div>
      </section>

      <section className="rise glass-card p-5" style={{ animationDelay: "80ms" }}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold tracking-tight">Add a task</h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            New
          </span>
        </div>
        <TaskForm onSubmit={addTask} />
      </section>

      <section className="rise glass-card p-5" style={{ animationDelay: "160ms" }}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold tracking-tight">Focus first</h2>
          <Link to="/tasks" className="font-mono text-[10px] uppercase tracking-wide text-brand">
            All tasks
          </Link>
        </div>
        <div className="mt-3 space-y-2.5">
          {focus.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line bg-card/30 p-4 text-center text-xs text-ink-soft">
              Nothing pending for today. Add a task above to get going.
            </p>
          ) : (
            focus.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={() => toggleTask(task.id)} />
            ))
          )}
        </div>
      </section>
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-xl border border-line/70 bg-card/45 p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">{label}</p>
      <p className={`mt-1 font-display text-2xl font-semibold leading-none ${tone}`}>{value}</p>
    </div>
  );
}
