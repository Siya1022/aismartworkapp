import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

function DashboardIcon() {
  return (
    <span className="relative grid size-5 place-items-center">
      <span className="absolute inset-0 rounded-md border-[1.5px] border-current" />
      <span className="size-1.5 rounded-full bg-current" />
    </span>
  );
}

function TasksIcon() {
  return (
    <span className="relative grid size-5 place-items-center">
      <span className="absolute left-0 top-1 h-[1.5px] w-4 rounded-full bg-current" />
      <span className="absolute left-0 top-3 h-[1.5px] w-3 rounded-full bg-current" />
      <span className="absolute left-0 top-[1.15rem] h-[1.5px] w-4 rounded-full bg-current" />
    </span>
  );
}

function AssistantIcon() {
  return (
    <span className="grid size-5 place-items-center">
      <span className="block h-3.5 w-4 rounded-md rounded-bl-sm border-[1.5px] border-current" />
    </span>
  );
}

function ProfileIcon() {
  return (
    <span className="relative grid size-5 place-items-center">
      <span className="absolute top-0 size-2 rounded-full border-[1.5px] border-current" />
      <span className="absolute bottom-0 h-2 w-4 rounded-t-full border-[1.5px] border-b-0 border-current" />
    </span>
  );
}

const tabs = [
  { to: "/", label: "Dashboard", icon: <DashboardIcon /> },
  { to: "/tasks", label: "Tasks", icon: <TasksIcon /> },
  { to: "/assistant", label: "Assistant", icon: <AssistantIcon /> },
  { to: "/profile", label: "Profile", icon: <ProfileIcon /> },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[oklch(0.91_0.032_257)] via-[oklch(0.94_0.02_256)] to-[oklch(0.97_0.008_255)] font-sans text-ink">
      <div className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-brand/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-44 size-80 rounded-full bg-brand-light/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-24 left-1/3 size-72 rounded-full bg-low/25 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col">
        <header className="px-5 pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-xl bg-brand font-display text-base font-bold text-primary-foreground shadow-sm">
                M
              </div>
              <div>
                <p className="font-display text-[15px] font-semibold leading-none tracking-tight">
                  Meridian
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                  Calm focus
                </p>
              </div>
            </div>
            <Link
              to="/profile"
              className="grid h-9 w-9 place-items-center rounded-full border border-line bg-card/50 font-display text-sm font-semibold text-ink backdrop-blur"
            >
              AJ
            </Link>
          </div>
        </header>

        <main className="flex-1 space-y-3 px-5 pb-8 pt-5">{children}</main>

        <nav className="sticky bottom-0 z-20 border-t border-white/60 bg-card/65 px-3 py-2 backdrop-blur-xl">
          <div className="flex items-center justify-around">
            {tabs.map((tab) => (
              <Link
                key={tab.to}
                to={tab.to}
                activeOptions={{ exact: tab.to === "/" }}
                className="flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-ink-faint transition-colors hover:text-ink"
                activeProps={{ className: "!text-brand" }}
              >
                {tab.icon}
                <span className="font-mono text-[10px] tracking-wide">{tab.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
