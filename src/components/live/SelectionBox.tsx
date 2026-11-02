"use client";

import { motion } from "framer-motion";

type SelectionBoxProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  label?: string;
};

export function SelectionBox({
  x,
  y,
  w,
  h,
  color = "#22d3ee",
  label,
}: SelectionBoxProps) {
  const handles = [
    { left: -4, top: -4 },
    { left: w / 2 - 4, top: -4 },
    { left: w - 4, top: -4 },
    { left: -4, top: h / 2 - 4 },
    { left: w - 4, top: h / 2 - 4 },
    { left: -4, top: h - 4 },
    { left: w / 2 - 4, top: h - 4 },
    { left: w - 4, top: h - 4 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="pointer-events-none absolute"
      style={{ left: x, top: y, width: w, height: h }}
    >
      <div className="absolute inset-0" style={{ border: `1.5px solid ${color}` }} />
      {handles.map((handle, i) => (
        <span
          key={i}
          className="absolute h-2 w-2 border border-black"
          style={{
            left: handle.left,
            top: handle.top,
            backgroundColor: color,
          }}
        />
      ))}
      {label && (
        <span
          className="absolute -top-5 left-0 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-black"
          style={{ backgroundColor: color }}
        >
          {label}
        </span>
      )}
      <span
        className="absolute -bottom-5 right-0 font-mono text-[9px] tabular-nums"
        style={{ color }}
      >
        {Math.round(w)} × {Math.round(h)}
      </span>
    </motion.div>
  );
}
