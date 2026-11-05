"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CursorPointer } from "./CursorPointer";
import { SelectionBox } from "./SelectionBox";
import { useBuild } from "./BuildContext";

export function LiveCursors() {
  const { assignments, phase, selectedUnitId } = useBuild();
  const [selBox, setSelBox] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    label: string;
  } | null>(null);

  // Measure selected unit for Figma-style box (like in the video)
  useEffect(() => {
    if (!selectedUnitId || phase !== "building") {
      setSelBox(null);
      return;
    }
    const update = () => {
      const node = document.querySelector<HTMLElement>(
        `[data-build-unit="${selectedUnitId}"]`,
      );
      if (!node) return;
      const r = node.getBoundingClientRect();
      const agent = assignments.find((a) => a.unitId === selectedUnitId);
      setSelBox({
        x: r.left - 4,
        y: r.top - 4,
        w: r.width + 8,
        h: r.height + 8,
        color: agent?.color || "#22d3ee",
        label: node.dataset.buildLabel || "layer",
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [selectedUnitId, phase, assignments]);

  // Also draw mini selection on every actively selecting cursor's unit
  const [multiBoxes, setMultiBoxes] = useState<
    { id: string; x: number; y: number; w: number; h: number; color: string; label: string }[]
  >([]);

  useEffect(() => {
    if (phase !== "building") {
      setMultiBoxes([]);
      return;
    }
    const active = assignments.filter((a) => a.selecting && a.unitId);
    const boxes = active
      .map((a) => {
        const node = document.querySelector<HTMLElement>(
          `[data-build-unit="${a.unitId}"]`,
        );
        if (!node) return null;
        const word = node.closest<HTMLElement>("[data-build-word]");
        const target = node.dataset.buildKind === "char" && word ? word : node;
        const r = target.getBoundingClientRect();
        if (r.width < 2 && r.height < 2) return null;
        return {
          id: word?.dataset.buildWord || a.unitId!,
          x: r.left - 4,
          y: r.top - 4,
          w: r.width + 8,
          h: r.height + 8,
          color: a.color,
          label: a.name,
        };
      })
      .filter(Boolean) as typeof multiBoxes;
    const seen = new Set<string>();
    setMultiBoxes(boxes.filter((b) => (seen.has(b.id) ? false : (seen.add(b.id), true))));
  }, [assignments, phase]);

  const [trails, setTrails] = useState<Record<string, { x: number; y: number }[]>>({});

  useEffect(() => {
    if (phase === "boot" || phase === "done") {
      setTrails({});
      return;
    }
    setTrails((prev) => {
      const next: Record<string, { x: number; y: number }[]> = {};
      for (const a of assignments) {
        const list = [...(prev[a.cursorId] ?? []), { x: a.x, y: a.y }];
        next[a.cursorId] = list.slice(-6);
      }
      return next;
    });
  }, [assignments, phase]);

  // Skip / build complete → hide all cursors; Replay brings them back
  if (phase === "boot" || phase === "done") return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[55] overflow-hidden" aria-hidden>
      <AnimatePresence>
        {phase === "building" &&
          multiBoxes.map((b) => (
            <SelectionBox
              key={b.id}
              x={b.x}
              y={b.y}
              w={b.w}
              h={b.h}
              color={b.color}
              label={b.label}
            />
          ))}
      </AnimatePresence>

      {selBox && phase === "building" && multiBoxes.length === 0 && (
        <SelectionBox {...selBox} />
      )}

      {assignments.map((a) =>
        (trails[a.cursorId] ?? []).slice(0, -1).map((dot, i, arr) => (
          <span
            key={`${a.cursorId}-t-${i}`}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              left: dot.x,
              top: dot.y,
              backgroundColor: a.color,
              opacity: 0.18 + (i / Math.max(arr.length, 1)) * 0.55,
            }}
          />
        )),
      )}

      {assignments.map((a) => (
        <motion.div
          key={a.cursorId}
          className="absolute left-0 top-0"
          animate={{ x: a.x, y: a.y }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 26,
            mass: 0.6,
          }}
        >
          <CursorPointer color={a.color} name={a.name} />
          {a.placing && (
            <>
              <motion.span
                className="absolute left-3 top-5 rounded-sm px-1 py-[1px] text-[9px] font-bold uppercase text-black"
                style={{ backgroundColor: a.color }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {a.unitId?.includes("-ch-") ? "type" : "chunk"}
              </motion.span>
              <motion.span
                className="absolute left-1 top-1 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                style={{ borderColor: a.color }}
                initial={{ opacity: 0.95, scale: 0.3 }}
                animate={{ opacity: 0, scale: 2.4 }}
                transition={{ duration: 0.35 }}
              />
            </>
          )}
        </motion.div>
      ))}
    </div>
  );
}
