import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { formatDate, priorityLabel, sortTasks, todayISO, useTasks } from "@/lib/tasks";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Assistant — Meridian Productivity Assistant" },
      {
        name: "description",
        content: "Ask for help planning your day and ordering your tasks by priority.",
      },
      { property: "og:title", content: "Assistant — Meridian Productivity Assistant" },
      {
        property: "og:description",
        content: "Ask for help planning your day and ordering your tasks by priority.",
      },
    ],
  }),
  component: AssistantPage,
});

type Message = { id: string; from: "user" | "assistant"; text: string };

const prompts = ["Plan my afternoon", "What should I do first?", "Summarise my day"];

function AssistantPage() {
  const { tasks } = useTasks();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      from: "assistant",
      text: "I work from the tasks you've added. Ask me what to start with, how to plan your afternoon, or for a summary of your day.",
    },
  ]);

  function reply(question: string) {
    const today = tasks.filter((t) => t.dueDate === todayISO());
    const pending = sortTasks(today.filter((t) => !t.completed));
    const done = today.filter((t) => t.completed).length;
    const q = question.toLowerCase();

    if (pending.length === 0) {
      return today.length === 0
        ? "You have no tasks due today yet. Add one or two and I'll help you order them."
        : `All ${today.length} of today's tasks are complete. Good place to stop, or pull one task forward from tomorrow.`;
    }

    if (q.includes("summar") || q.includes("day so far") || q.includes("progress")) {
      return `So far today: ${done} done, ${pending.length} still open. The heaviest item left is "${pending[0].title}" (${priorityLabel[pending[0].priority]}, due ${formatDate(pending[0].dueDate)}).`;
    }

    if (q.includes("afternoon") || q.includes("plan") || q.includes("schedule")) {
      const blocks = pending
        .slice(0, 3)
        .map((t, i) => `${13 + i * 2}:00 — ${t.title} (${priorityLabel[t.priority]})`)
        .join("\n");
      return `Here's a simple afternoon plan:\n${blocks}\nKeep 15 minutes between blocks for a reset.`;
    }

    return `Start with "${pending[0].title}" — it's your highest priority item due ${formatDate(pending[0].dueDate)}. After that, ${pending[1] ? `"${pending[1].title}"` : "take a short break"}.`;
  }

  function send(text: string) {
    const question = text.trim();
    if (!question) return;
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), from: "user", text: question },
      { id: crypto.randomUUID(), from: "assistant", text: reply(question) },
    ]);
    setInput("");
  }

  return (
    <>
      <section className="rise glass-card p-5">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-base font-semibold tracking-tight">Assistant</h1>
          <span className="flex items-center gap-1.5 rounded-full border border-line bg-card/60 px-2.5 py-1 font-mono text-[10px] tracking-wide text-ink-soft">
            <span className="size-1.5 rounded-full bg-low" /> Ready
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {messages.map((m) =>
            m.from === "assistant" ? (
              <div key={m.id} className="flex items-end gap-2.5">
                <div className="grid size-9 shrink-0 place-items-center rounded-full bg-brand/12 font-display text-sm font-bold text-brand">
                  M
                </div>
                <div className="whitespace-pre-line rounded-2xl rounded-bl-md border border-line/70 bg-card/70 px-3.5 py-2.5 text-sm leading-snug text-ink">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex justify-end">
                <div className="rounded-2xl rounded-br-md bg-brand px-3.5 py-2.5 text-sm leading-snug text-primary-foreground">
                  {m.text}
                </div>
              </div>
            ),
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="mt-3 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Meridian to plan…"
            className="field flex-1"
          />
          <button
            type="submit"
            aria-label="Send"
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-primary-foreground transition-colors hover:bg-brand-deep"
          >
            <svg viewBox="0 0 12 12" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6h7M6.2 3 9.5 6l-3.3 3" />
            </svg>
          </button>
        </form>

        <div className="mt-3 flex flex-wrap gap-2">
          {prompts.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="rounded-full border border-line bg-card/50 px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-brand/40 hover:text-ink"
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-line bg-card/30 p-3.5 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
          Offline assistant
        </p>
        <p className="mt-1 text-xs leading-snug text-ink-soft">
          Replies are generated on your device from your own task list. No live AI service is
          connected yet.
        </p>
      </section>
    </>
  );
}
