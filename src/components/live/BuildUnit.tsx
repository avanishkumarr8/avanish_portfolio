"use client";

import { createContext, useContext, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBuild } from "./BuildContext";

const SectionIdContext = createContext<string>("");

export function BuildSectionScope({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return <SectionIdContext.Provider value={id}>{children}</SectionIdContext.Provider>;
}

type BuildUnitProps = {
  id: string;
  order: number;
  label?: string;
  children: ReactNode;
  className?: string;
  as?: "span" | "div";
  /** char = typewriter letter; chunk = section block assembling from tiles */
  kind?: "char" | "chunk";
};

const CHUNK_COLS = 3;
const CHUNK_ROWS = 2;
const CHUNK_TILES = CHUNK_COLS * CHUNK_ROWS;

/** One piece — letter types in, or section chunk assembles from tiles */
export function BuildUnit({
  id,
  order,
  label,
  children,
  className = "",
  as = "div",
  kind = "chunk",
}: BuildUnitProps) {
  const { isUnitCreated, phase, isSectionBuilt } = useBuild();
  const sectionId = useContext(SectionIdContext);
  const created =
    isUnitCreated(id) || isSectionBuilt(sectionId) || phase === "done";

  const isChar = kind === "char" || as === "span";

  if (isChar) {
    return (
      <motion.span
        data-build-unit={id}
        data-build-order={order}
        data-build-label={label || id}
        data-build-kind="char"
        className={`inline-block ${className}`}
        initial={false}
        animate={
          created
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 8, scale: 0.92 }
        }
        transition={{ duration: 0.1, ease: "easeOut" }}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <div
      data-build-unit={id}
      data-build-order={order}
      data-build-label={label || id}
      data-build-kind="chunk"
      className={`relative ${className}`}
    >
      {/* actual content — fades in after tiles assemble */}
      <motion.div
        initial={false}
        animate={
          created
            ? { opacity: 1, y: 0, scale: 1, filter: "none" }
            : { opacity: 0, y: 16, scale: 0.97, filter: "blur(4px)" }
        }
        transition={{ duration: 0.28, delay: created ? 0.12 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>

      {/* chunk tiles assembling into the block */}
      <AnimatePresence>
        {created && (
          <motion.div
            key={`tiles-${id}`}
            className="pointer-events-none absolute inset-0 z-10 grid overflow-hidden"
            style={{
              gridTemplateColumns: `repeat(${CHUNK_COLS}, 1fr)`,
              gridTemplateRows: `repeat(${CHUNK_ROWS}, 1fr)`,
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: CHUNK_TILES }).map((_, i) => (
              <motion.div
                key={i}
                className="border border-cyan-400/30 bg-gradient-to-br from-white/15 to-cyan-500/10"
                initial={{ opacity: 0.95, scale: 0.7 }}
                animate={{ opacity: 0, scale: 1 }}
                transition={{
                  duration: 0.35,
                  delay: i * 0.045,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* wireframe placeholder before create — faint chunk outline */}
      {!created && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[5] grid opacity-20"
          style={{
            gridTemplateColumns: `repeat(${CHUNK_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${CHUNK_ROWS}, 1fr)`,
          }}
        >
          {Array.from({ length: CHUNK_TILES }).map((_, i) => (
            <div key={i} className="border border-dashed border-white/20" />
          ))}
        </div>
      )}
    </div>
  );
}

type BuildTextProps = {
  text: string;
  idPrefix: string;
  startOrder?: number;
  className?: string;
  letterClassName?: string;
  accentAt?: number;
  accentClassName?: string;
};

/** Big titles — each letter types one by one */
export function BuildText({
  text,
  idPrefix,
  startOrder = 0,
  className = "",
  letterClassName = "",
  accentAt,
  accentClassName = "text-[var(--accent)]",
}: BuildTextProps) {
  const chars = Array.from(text);

  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {chars.map((ch, i) => {
        const unitId = `${idPrefix}-ch-${i}`;
        if (ch === " ") {
          return (
            <BuildUnit
              key={unitId}
              id={unitId}
              order={startOrder + i}
              label="·"
              as="span"
              kind="char"
              className="w-[0.35em]"
            >
              {"\u00A0"}
            </BuildUnit>
          );
        }
        return (
          <BuildUnit
            key={unitId}
            id={unitId}
            order={startOrder + i}
            label={ch}
            as="span"
            kind="char"
            className={`${letterClassName} ${accentAt === i ? accentClassName : ""}`}
          >
            {ch}
          </BuildUnit>
        );
      })}
    </span>
  );
}
