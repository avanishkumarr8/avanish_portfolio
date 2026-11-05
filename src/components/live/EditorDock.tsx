"use client";

import { motion } from "framer-motion";
import { useBuild } from "./BuildContext";

const tools = ["↖", "▢", "T", "✦", "◎", "✂"];

export function EditorDock() {
  const {
    phase,
    currentSection,
    createdUnits,
    assignments,
    buildPercent,
    sectionOrder,
    builtSections,
    skipToEnd,
    replay,
  } = useBuild();

  const busy = assignments.filter((a) => a.unitId).length;
  const status =
    phase === "swarm"
      ? "Scanning page…"
      : phase === "boot"
        ? "Building page…"
      : phase === "done"
        ? "Build complete"
        : phase === "scrolling"
          ? `Scrolling → ${currentSection ?? ""}`
          : `Building ${currentSection ?? ""}`;

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.45 }}
      className="pointer-events-auto fixed inset-x-3 z-[60] flex max-w-[calc(100vw-1.5rem)] items-center gap-2 rounded-2xl border border-white/10 bg-[#0c0c0c]/95 px-2 py-2 shadow-[0_20px_60px_rgba(0,0,0,0.65)] backdrop-blur-xl bottom-[max(0.75rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:bottom-5 sm:left-1/2 sm:w-max sm:-translate-x-1/2 sm:px-3"
    >
      <div className="hidden items-center gap-1 border-r border-white/10 pr-3 sm:flex">
        {tools.map((tool, i) => (
          <button
            key={tool}
            type="button"
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs ${
              i === 0 ? "bg-[var(--accent)] text-white" : "text-white/55"
            }`}
          >
            {tool}
          </button>
        ))}
      </div>

      <div className="flex min-w-0 flex-col gap-1 px-2 sm:flex-row sm:items-center sm:gap-3">
        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-white/70">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {busy || assignments.length} agents
        </span>

        <div className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-white/10 sm:block">
          <motion.div
            className="h-full rounded-full bg-[var(--accent)]"
            animate={{ width: `${buildPercent}%` }}
            transition={{ duration: 0.25 }}
          />
        </div>

        <span className="truncate font-mono text-[10px] text-cyan-300/90">
          {status}
          {phase !== "done" && ` · ${buildPercent}%`}
        </span>

        <span className="hidden font-mono text-[10px] text-white/35 md:inline">
          {createdUnits.size} pcs · {builtSections.size}/{sectionOrder.length}
        </span>
      </div>

      <div className="border-l border-white/10 pl-3">
        {phase !== "done" ? (
          <button
            type="button"
            onClick={skipToEnd}
            className="px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-white/60 hover:text-white"
          >
            Skip
          </button>
        ) : (
          <button
            type="button"
            onClick={replay}
            className="px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]"
          >
            Replay
          </button>
        )}
      </div>
    </motion.div>
  );
}
