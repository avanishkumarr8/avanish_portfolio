"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type BuildPhase =
  | "boot"
  | "swarm"
  | "scrolling"
  | "building"
  | "done";

export type WorkUnit = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
};

export type CursorAssignment = {
  cursorId: string;
  name: string;
  color: string;
  unitId: string | null;
  x: number;
  y: number;
  placing: boolean;
  /** show Figma-like selection around this cursor's unit */
  selecting: boolean;
};

type BuildContextValue = {
  sectionOrder: string[];
  currentSection: string | null;
  builtSections: Set<string>;
  phase: BuildPhase;
  createdUnits: Set<string>;
  assignments: CursorAssignment[];
  /** unit currently wrapped in selection box */
  selectedUnitId: string | null;
  buildPercent: number;
  autoPlay: boolean;
  setAutoPlay: (v: boolean) => void;
  registerSection: (id: string, el: HTMLElement | null) => void;
  isSectionBuilt: (id: string) => boolean;
  isSectionActive: (id: string) => boolean;
  isUnitCreated: (unitId: string) => boolean;
  sectionProgress: (id: string) => number;
  skipToEnd: () => void;
  replay: () => void;
};

const BuildContext = createContext<BuildContextValue | null>(null);

export const SECTION_ORDER = [
  "home",
  "work",
  "impact",
  "about",
  "journey",
  "contact",
] as const;

export const AGENTS = [
  { id: "c0", name: "Ava", color: "#22d3ee" },
  { id: "c1", name: "Dev", color: "#f472b6" },
  { id: "c2", name: "UI", color: "#facc15" },
  { id: "c3", name: "Kai", color: "#a78bfa" },
  { id: "c4", name: "Mo", color: "#fb7185" },
  { id: "c5", name: "Type", color: "#34d399" },
  { id: "c6", name: "Grid", color: "#60a5fa" },
  { id: "c7", name: "Ship", color: "#e10600" },
  { id: "c8", name: "QA", color: "#f97316" },
  { id: "c9", name: "Copy", color: "#e879f9" },
  { id: "c10", name: "Lay", color: "#2dd4bf" },
  { id: "c11", name: "Pix", color: "#ffffff" },
  { id: "c12", name: "Ink", color: "#67e8f9" },
  { id: "c13", name: "Rex", color: "#fda4af" },
  { id: "c14", name: "Neo", color: "#bef264" },
  { id: "c15", name: "Zoe", color: "#c4b5fd" },
] as const;

/** Sequential: letters type fast; section chunks assemble slower */
const CHAR_MS = 75;
const CHUNK_MS = 280; // time to see tiles assemble into a block
const SECTION_PAUSE = 360;
const SWARM_MS = 700;

function measureUnits(sectionEl: HTMLElement): WorkUnit[] {
  const nodes = sectionEl.querySelectorAll<HTMLElement>("[data-build-unit]");
  return Array.from(nodes)
    .sort(
      (a, b) =>
        Number(a.dataset.buildOrder || 0) - Number(b.dataset.buildOrder || 0),
    )
    .map((node, i) => {
      const r = node.getBoundingClientRect();
      return {
        id: node.dataset.buildUnit || `unit-${i}`,
        x: r.left + r.width * 0.5,
        y: r.top + r.height * 0.55,
        w: Math.max(r.width, 10),
        h: Math.max(r.height, 10),
        label:
          node.dataset.buildLabel ||
          node.textContent?.trim().slice(0, 14) ||
          `u${i}`,
      };
    });
}

function idleAssignments(spread = true): CursorAssignment[] {
  return AGENTS.map((a, i) => ({
    cursorId: a.id,
    name: a.name,
    color: a.color,
    unitId: null,
    x: spread ? 60 + (i % 8) * 110 : 40 + (i % 4) * 30,
    y: spread ? 100 + Math.floor(i / 8) * 70 : 80 + Math.floor(i / 4) * 24,
    placing: false,
    selecting: false,
  }));
}

export function BuildProvider({ children }: { children: ReactNode }) {
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [builtSections, setBuiltSections] = useState<Set<string>>(new Set());
  const [phase, setPhase] = useState<BuildPhase>("boot");
  const [createdUnits, setCreatedUnits] = useState<Set<string>>(new Set());
  const [assignments, setAssignments] = useState<CursorAssignment[]>(idleAssignments);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [buildPercent, setBuildPercent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [runId, setRunId] = useState(0);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  const sectionEls = useRef<Map<string, HTMLElement>>(new Map());
  const cancelled = useRef(false);
  const createdRef = useRef<Set<string>>(new Set());
  const totalUnitsRef = useRef(0);
  const createdCountRef = useRef(0);

  const registerSection = useCallback((id: string, el: HTMLElement | null) => {
    if (el) sectionEls.current.set(id, el);
    else sectionEls.current.delete(id);
  }, []);

  const isSectionBuilt = useCallback(
    (id: string) => builtSections.has(id),
    [builtSections],
  );

  const isSectionActive = useCallback(
    (id: string) => currentSection === id && phase === "building",
    [currentSection, phase],
  );

  const isUnitCreated = useCallback(
    (unitId: string) => createdUnits.has(unitId) || phase === "done",
    [createdUnits, phase],
  );

  const sectionProgress = useCallback(
    (id: string) => {
      if (builtSections.has(id) || phase === "done") return 1;
      return progressMap[id] ?? 0;
    },
    [builtSections, phase, progressMap],
  );

  const markCreated = (ids: string[]) => {
    ids.forEach((id) => createdRef.current.add(id));
    createdCountRef.current += ids.length;
    setCreatedUnits(new Set(createdRef.current));
    if (totalUnitsRef.current > 0) {
      setBuildPercent(
        Math.min(99, Math.round((createdCountRef.current / totalUnitsRef.current) * 100)),
      );
    }
  };

  const skipToEnd = useCallback(() => {
    cancelled.current = true;
    const allUnits = new Set<string>();
    sectionEls.current.forEach((el) => {
      el.querySelectorAll<HTMLElement>("[data-build-unit]").forEach((n) => {
        if (n.dataset.buildUnit) allUnits.add(n.dataset.buildUnit);
      });
    });
    createdRef.current = allUnits;
    setCreatedUnits(allUnits);
    const full: Record<string, number> = {};
    SECTION_ORDER.forEach((id) => {
      full[id] = 1;
    });
    setProgressMap(full);
    setBuiltSections(new Set(SECTION_ORDER));
    setCurrentSection(null);
    setSelectedUnitId(null);
    setBuildPercent(100);
    setPhase("done");
    setAutoPlay(false);
    document.documentElement.style.overflow = "";
  }, []);

  const replay = useCallback(() => {
    cancelled.current = false;
    createdRef.current = new Set();
    createdCountRef.current = 0;
    setCreatedUnits(new Set());
    setBuiltSections(new Set());
    setProgressMap({});
    setCurrentSection(null);
    setSelectedUnitId(null);
    setBuildPercent(0);
    setAssignments(idleAssignments());
    setPhase("boot");
    setAutoPlay(true);
    setRunId((n) => n + 1);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const wait = (ms: number) =>
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, ms);
    });

  const countAllUnits = () => {
    let n = 0;
    sectionEls.current.forEach((el) => {
      n += el.querySelectorAll("[data-build-unit]").length;
    });
    totalUnitsRef.current = Math.max(n, 1);
  };

  /** Video open: cursors swarm from edges into center (blank page) */
  const runSwarmIntro = async () => {
    setPhase("swarm");
    const cx = window.innerWidth * 0.5;
    const cy = window.innerHeight * 0.42;

    // start at edges
    setAssignments(
      AGENTS.map((a, i) => {
        const edge = i % 4;
        const x =
          edge === 0
            ? -40
            : edge === 1
              ? window.innerWidth + 40
              : 40 + (i * 97) % window.innerWidth;
        const y =
          edge === 2
            ? -40
            : edge === 3
              ? window.innerHeight + 40
              : 40 + (i * 73) % window.innerHeight;
        return {
          cursorId: a.id,
          name: a.name,
          color: a.color,
          unitId: null,
          x,
          y,
          placing: false,
          selecting: false,
        };
      }),
    );
    await wait(80);

    // swarm to center cluster (like video opening on big letter)
    setAssignments(
      AGENTS.map((a, i) => {
        const ang = (i / AGENTS.length) * Math.PI * 2;
        const r = 40 + (i % 5) * 18;
        return {
          cursorId: a.id,
          name: a.name,
          color: a.color,
          unitId: null,
          x: cx + Math.cos(ang) * r,
          y: cy + Math.sin(ang) * r * 1.35,
          placing: true,
          selecting: false,
        };
      }),
    );
    setBuildPercent(2);
    await wait(SWARM_MS);
    setAssignments((prev) => prev.map((a) => ({ ...a, placing: false })));
  };

  const scrollToSectionStart = async (id: string) => {
    const el = sectionEls.current.get(id);
    if (!el) return;
    setPhase("scrolling");
    setSelectedUnitId(null);
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });

    const rect = el.getBoundingClientRect();
    // cursors spread across upcoming section (different spots, not one pack)
    setAssignments(
      AGENTS.map((a, i) => ({
        cursorId: a.id,
        name: a.name,
        color: a.color,
        unitId: null,
        x: rect.left + 30 + (i % 8) * ((Math.max(rect.width, 320) - 60) / 7),
        y: Math.max(88, rect.top + 10 + Math.floor(i / 8) * 36),
        placing: false,
        selecting: false,
      })),
    );
    await wait(480);
  };

  const buildSection = async (id: string) => {
    const el = sectionEls.current.get(id);
    if (!el) return;

    setCurrentSection(id);
    setPhase("building");
    await wait(40);

    const units = measureUnits(el);
    if (!units.length) return;

    const total = units.length;

    // Typewriter: ONE character/unit at a time, cursors take turns
    for (let i = 0; i < units.length; i++) {
      if (cancelled.current) return;

      // remasure so scroll doesn't desync positions
      const fresh = measureUnits(el);
      const unit = fresh.find((u) => u.id === units[i].id) ?? units[i];
      const typer = AGENTS[i % AGENTS.length];
      const node = el.querySelector<HTMLElement>(
        `[data-build-unit="${units[i].id}"]`,
      );
      const isChar =
        unit.id.includes("-ch-") || node?.dataset.buildKind === "char";

      // scroll follows whatever is being typed / chunked
      const docY = unit.y + window.scrollY;
      window.scrollTo({
        top: Math.max(0, docY - window.innerHeight * 0.5),
        behavior: "auto",
      });

      // one cursor creates this piece; others hang nearby
      setAssignments(
        AGENTS.map((agent, ai) => {
          const isTyper = agent.id === typer.id;
          const orbit = ((ai * 17) % 50) - 25;
          return {
            cursorId: agent.id,
            name: agent.name,
            color: agent.color,
            unitId: isTyper ? unit.id : null,
            x: unit.x + (isTyper ? unit.w * 0.15 : orbit),
            y: unit.y + (isTyper ? 0 : 20 + (ai % 4) * 8),
            placing: false,
            selecting: isTyper,
          };
        }),
      );
      setSelectedUnitId(unit.id);

      await wait(isChar ? 16 : 50);
      if (cancelled.current) return;

      setAssignments((prev) =>
        prev.map((a) =>
          a.cursorId === typer.id ? { ...a, placing: true } : a,
        ),
      );
      markCreated([unit.id]);
      setProgressMap((p) => ({ ...p, [id]: (i + 1) / total }));

      // chars: quick type · chunks: longer so tile assemble is visible
      await wait(isChar ? CHAR_MS : CHUNK_MS);
      if (cancelled.current) return;

      setAssignments((prev) =>
        prev.map((a) => ({ ...a, placing: false, selecting: false })),
      );
      setSelectedUnitId(null);
    }

    setProgressMap((p) => ({ ...p, [id]: 1 }));
    setBuiltSections((prev) => new Set(prev).add(id));
    await wait(SECTION_PAUSE);
  };

  useEffect(() => {
    if (!autoPlay) return;
    cancelled.current = false;
    let alive = true;

    (async () => {
      setPhase("boot");
      await wait(400);
      if (!alive || cancelled.current) return;

      // wait for DOM units
      for (let n = 0; n < 40; n++) {
        countAllUnits();
        if (totalUnitsRef.current > 10) break;
        await wait(50);
      }

      await runSwarmIntro();
      if (!alive || cancelled.current) return;

      for (const id of SECTION_ORDER) {
        if (!alive || cancelled.current) return;
        for (let n = 0; n < 25 && !sectionEls.current.get(id); n++) {
          await wait(40);
        }
        await scrollToSectionStart(id);
        if (!alive || cancelled.current) return;
        await buildSection(id);
      }

      if (!alive || cancelled.current) return;
      setCurrentSection(null);
      setSelectedUnitId(null);
      setBuildPercent(100);
      setPhase("done");
      setAutoPlay(false);
    })();

    return () => {
      alive = false;
      cancelled.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId, autoPlay]);

  const value = useMemo<BuildContextValue>(
    () => ({
      sectionOrder: [...SECTION_ORDER],
      currentSection,
      builtSections,
      phase,
      createdUnits,
      assignments,
      selectedUnitId,
      buildPercent,
      autoPlay,
      setAutoPlay,
      registerSection,
      isSectionBuilt,
      isSectionActive,
      isUnitCreated,
      sectionProgress,
      skipToEnd,
      replay,
    }),
    [
      currentSection,
      builtSections,
      phase,
      createdUnits,
      assignments,
      selectedUnitId,
      buildPercent,
      autoPlay,
      registerSection,
      isSectionBuilt,
      isSectionActive,
      isUnitCreated,
      sectionProgress,
      skipToEnd,
      replay,
    ],
  );

  return <BuildContext.Provider value={value}>{children}</BuildContext.Provider>;
}

export function useBuild() {
  const ctx = useContext(BuildContext);
  if (!ctx) throw new Error("useBuild must be used within BuildProvider");
  return ctx;
}
