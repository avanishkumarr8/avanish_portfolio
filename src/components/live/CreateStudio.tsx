"use client";

import { useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LiveCursors } from "./LiveCursors";
import { EditorDock } from "./EditorDock";
import { BuildProvider, useBuild } from "./BuildContext";

function StudioChrome() {
  const { phase, skipToEnd, replay, autoPlay, buildPercent } = useBuild();

  useEffect(() => {
    const lock = autoPlay && phase !== "done";
    if (lock) document.documentElement.style.overflow = "hidden";
    else document.documentElement.style.overflow = "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [autoPlay, phase]);

  return (
    <>
      <LiveCursors />
      <EditorDock />

      <AnimatePresence>
        {(phase === "boot" || phase === "swarm") && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[45] flex items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <p className="font-display text-7xl text-white/10 md:text-9xl">A</p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">
                Building page… {buildPercent}%
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => (phase === "done" ? replay() : skipToEnd())}
        className="pointer-events-auto fixed bottom-5 right-5 z-[70] border border-white/15 bg-black/80 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-white/70 backdrop-blur-md transition hover:border-white/40 hover:text-white"
      >
        {phase === "done" ? "Replay Build" : "Skip Build"}
      </button>
    </>
  );
}

export function CreateStudio({ children }: { children: ReactNode }) {
  return (
    <BuildProvider>
      <StudioChrome />
      {children}
    </BuildProvider>
  );
}
