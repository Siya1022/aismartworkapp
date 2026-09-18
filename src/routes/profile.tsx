import { createFileRoute } from "@tanstack/react-router";
import { useTasks, useTaskStats } from "@/lib/tasks";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Meridian Productivity Assistant" },
      {
        name: "description",
        content: "Your productivity totals and app settings in Meridian.",
      },
      { property: "og:title", content: "Profile — Meridian Productivity Assistant" },
      {
        property: "og:description",
        content: "Your productivity totals and app settings in Meridian.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { tasks } = useTasks();
  const { percent } = useTaskStats();
  const completed = tasks.filter((t) => t.completed).length;

  function clearCompleted() {
    if (!confirm("Remove all completed tasks?")) return;
    localStorage.setItem(
      "meridian.tasks.v1",
      JSON.stringify(tasks.filter((t) => !t.completed)),
    );
    location.reload();
  }

  function resetAll() {
    if (!confirm("Delete every task and start fresh?")) return;
    localStorage.removeItem("meridian.tasks.v1");
    location.reload();
  }

  return (
    <>
      <section className="rise glass-card p-5">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-brand/12 font-display text-lg font-bold text-brand">
            AJ
          </div>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">Alex Jordan</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
              Personal workspace
            </p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <Stat label="Tasks" value={String(tasks.length)} />
          <Stat label="Completed" value={String(completed)} />
          <Stat label="Today" value={`${percent}%`} />
        </div>
      </section>

      <section className="rise glass-card p-5" style={{ animationDelay: "80ms" }}>
        <h2 className="font-display text-base font-semibold tracking-tight">Settings</h2>
        <div className="mt-3 space-y-2.5">
          <Row label="Data" value="Saved on this device" />
          <Row label="Assistant" value="Offline planning" />
          <Row label="Week starts" value="Monday" />
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={clearCompleted}
            className="flex-1 rounded-xl border border-line bg-card/50 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
          >
            Clear completed
          </button>
          <button
            onClick={resetAll}
            className="flex-1 rounded-xl border border-high/30 bg-high/10 py-2.5 text-sm font-medium text-high transition-colors hover:bg-high/15"
          >
            Reset all
          </button>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line/70 bg-card/45 p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold leading-none">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-line/70 bg-card/45 px-3.5 py-2.5">
      <span className="text-sm text-ink">{label}</span>
      <span className="font-mono text-[11px] text-ink-soft">{value}</span>
    </div>
  );
}
