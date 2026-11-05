"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useBuild } from "./BuildContext";
import { BuildSectionScope } from "./BuildUnit";

type BuildSectionProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

export function BuildSection({ id, children, className = "" }: BuildSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { registerSection, isSectionBuilt, isSectionActive, phase, sectionProgress } =
    useBuild();

  const built = isSectionBuilt(id);
  const active = isSectionActive(id);
  const progress = sectionProgress(id);
  const dimmed = !built && !active && phase !== "done";

  useEffect(() => {
    registerSection(id, ref.current);
    return () => registerSection(id, null);
  }, [id, registerSection]);

  return (
    <BuildSectionScope id={id}>
      <div ref={ref} data-build-section={id} className={`relative overflow-x-clip ${className}`}>
        {/* unbuilt sections stay dark/empty like video blank canvas */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[15] bg-black"
          initial={false}
          animate={{
            opacity: built || phase === "done" ? 0 : active ? 0.05 : 0.85,
          }}
          transition={{ duration: 0.4 }}
        />

        <div className={dimmed ? "pointer-events-none" : undefined}>{children}</div>

        {active && (
          <div className="pointer-events-none absolute right-3 top-20 z-30 max-w-[68%] truncate rounded-sm bg-black/70 px-2 py-1 text-right font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent)] sm:right-5 sm:top-6 sm:max-w-none">
            agents creating · {Math.round(progress * 100)}%
          </div>
        )}
      </div>
    </BuildSectionScope>
  );
}
