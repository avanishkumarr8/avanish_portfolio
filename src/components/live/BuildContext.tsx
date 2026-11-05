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
const CHAR_MS = 62;
const CHUNK_MS = 280; // time to see tiles assemble into a block
const SECTION_PAUSE = 360;

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
    const fresh = ids.filter((id) => !createdRef.current.has(id));
    if (!fresh.length) return 0;
    fresh.forEach((id) => createdRef.current.add(id));
    createdCountRef.current += fresh.length;
    setCreatedUnits(new Set(createdRef.current));
    if (totalUnitsRef.current > 0) {
      setBuildPercent(
        Math.min(99, Math.round((createdCountRef.current / totalUnitsRef.current) * 100)),
      );
    }
    return fresh.length;
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

  /** Cursors fly in from the edges and orbit one node — “Scanning page…” */
  const runSwarmIntro = async () => {
    setPhase("swarm");
    const cx = window.innerWidth * 0.5;
    const cy = window.innerHeight * 0.46;
    const reach = Math.min(window.innerWidth, window.innerHeight);

    setAssignments(
      AGENTS.map((a, i) => {
        const edge = i % 4;
        const x =
          edge === 0
            ? -30
            : edge === 1
              ? window.innerWidth + 30
              : 24 + ((i * 97) % Math.max(window.innerWidth - 48, 48));
        const y =
          edge === 2
            ? -30
            : edge === 3
              ? window.innerHeight + 30
              : 24 + ((i * 73) % Math.max(window.innerHeight - 48, 48));
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
    await wait(90);

    const frames = 16;
    for (let frame = 0; frame < frames; frame++) {
      if (cancelled.current) return;
      setAssignments(
        AGENTS.map((a, i) => {
          const ang = (i / AGENTS.length) * Math.PI * 2 + frame * 0.42;
          const r = reach * (0.16 + (i % 3) * 0.045);
          return {
            cursorId: a.id,
            name: a.name,
            color: a.color,
            unitId: null,
            x: cx + Math.cos(ang) * r,
            y: cy + Math.sin(ang) * r * 0.72,
            placing: frame > 2 && i % 3 === frame % 3,
            selecting: false,
          };
        }),
      );
      await wait(85);
    }
    setBuildPercent(2);
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
    const cx = rect.left + rect.width * 0.5;
    const cy = Math.min(window.innerHeight * 0.55, Math.max(120, rect.top + 160));
    const reach = Math.min(rect.width, window.innerWidth) * 0.28;
    setAssignments(
      AGENTS.map((a, i) => {
        const ang = (i / AGENTS.length) * Math.PI * 2;
        const r = reach * (0.55 + (i % 3) * 0.22);
        return {
          cursorId: a.id,
          name: a.name,
          color: a.color,
          unitId: null,
          x: cx + Math.cos(ang) * r,
          y: cy + Math.sin(ang) * r * 0.65,
          placing: false,
          selecting: false,
        };
      }),
    );
    await wait(480);
  };

  const locateUnit = (sectionEl: HTMLElement, id: string): WorkUnit | null => {
    const node = sectionEl.querySelector<HTMLElement>(`[data-build-unit="${id}"]`);
    if (!node) return null;
    const r = node.getBoundingClientRect();
    return {
      id,
      x: r.left + Math.min(18, r.width * 0.35),
      y: r.top + r.height * 0.72,
      w: Math.max(r.width, 10),
      h: Math.max(r.height, 10),
      label: node.dataset.buildLabel || id,
    };
  };

  /**
   * Several agents work at once. Each owns a different word or chunk,
   * so the page fills like a swarm instead of one cursor typing the whole screen.
   */
  const buildSection = async (id: string) => {
    const el = sectionEls.current.get(id);
    if (!el) return;

    setCurrentSection(id);
    setPhase("building");
    await wait(40);
    if (cancelled.current) return;

    const units = measureUnits(el);
    if (!units.length) return;

    type Job = { units: WorkUnit[]; kind: "char" | "chunk" };
    const jobs: Job[] = [];
    let word: WorkUnit[] = [];
    const flushWord = () => {
      if (!word.length) return;
      jobs.push({ units: word, kind: "char" });
      word = [];
    };

    for (const unit of units) {
      const node = el.querySelector<HTMLElement>(`[data-build-unit="${unit.id}"]`);
      const isChar = unit.id.includes("-ch-") || node?.dataset.buildKind === "char";
      if (!isChar) {
        flushWord();
        jobs.push({ units: [unit], kind: "chunk" });
        continue;
      }
      if (unit.label === "·") {
        if (word.length) word.push(unit);
        flushWord();
        continue;
      }
      word.push(unit);
    }
    flushWord();

    const total = units.length;
    let createdInSection = 0;
    let cursor = 0;
    const takeJob = () => {
      if (cancelled.current || cursor >= jobs.length) return null;
      const job = jobs[cursor];
      cursor += 1;
      return job;
    };

    const place = (
      agentId: string,
      unit: WorkUnit | null,
      selecting: boolean,
      placing: boolean,
    ) => {
      setAssignments((prev) =>
        prev.map((a) =>
          a.cursorId === agentId
            ? {
                ...a,
                unitId: unit?.id ?? null,
                x: unit ? unit.x : a.x,
                y: unit ? unit.y : a.y,
                selecting,
                placing,
              }
            : a,
        ),
      );
      if (unit && selecting) setSelectedUnitId(unit.id);
    };

    const maybeScroll = (viewportY: number) => {
      const docY = viewportY + window.scrollY;
      const target = Math.max(0, docY - window.innerHeight * 0.42);
      if (Math.abs(target - window.scrollY) < 110) return;
      window.scrollTo({ top: target, behavior: "auto" });
    };

    let tick = 0;
    const drift = window.setInterval(() => {
      if (cancelled.current) return;
      tick += 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      setAssignments((prev) =>
        prev.map((a, i) => {
          if (a.unitId) return a;
          const col = i % 5;
          const row = Math.floor(i / 5);
          const x = 24 + col * Math.max(48, (w - 70) / 5) + Math.sin(tick * 0.65 + i) * 18;
          const y = 92 + row * Math.max(70, (h - 220) / 3) + Math.cos(tick * 0.5 + i) * 16;
          return {
            ...a,
            x: Math.min(w - 28, Math.max(8, x)),
            y: Math.min(h - 96, Math.max(72, y)),
            placing: false,
            selecting: false,
          };
        }),
      );
    }, 110);

    const runWorker = async (agent: (typeof AGENTS)[number]) => {
      while (!cancelled.current) {
        const job = takeJob();
        if (!job) return;

        if (job.kind === "chunk") {
          const unit = locateUnit(el, job.units[0].id) ?? job.units[0];
          maybeScroll(unit.y);
          place(agent.id, unit, true, false);
          await wait(150);
          if (cancelled.current) return;
          const landed = locateUnit(el, unit.id) ?? unit;
          place(agent.id, landed, true, true);
          createdInSection += markCreated([landed.id]);
          setProgressMap((p) => ({ ...p, [id]: createdInSection / total }));
          await wait(CHUNK_MS);
          place(agent.id, null, false, false);
          continue;
        }

        for (let i = 0; i < job.units.length; i++) {
          if (cancelled.current) return;
          const live = locateUnit(el, job.units[i].id) ?? job.units[i];
          if (i === 0) maybeScroll(live.y);
          place(agent.id, live, true, true);
          createdInSection += markCreated([live.id]);
          setProgressMap((p) => ({ ...p, [id]: createdInSection / total }));
          await wait(CHAR_MS);
        }
        place(agent.id, null, false, false);
      }
    };

    const swarmSize = Math.min(4, Math.max(jobs.length, 1));
    try {
      await Promise.all(AGENTS.slice(0, swarmSize).map((agent) => runWorker(agent)));
    } finally {
      window.clearInterval(drift);
    }
    if (cancelled.current) return;

    // leftover spaces between words
    const missed = units
      .map((u) => u.id)
      .filter((unitId) => !createdRef.current.has(unitId));
    if (missed.length) markCreated(missed);

    setProgressMap((p) => ({ ...p, [id]: 1 }));
    setBuiltSections((prev) => new Set(prev).add(id));
    setSelectedUnitId(null);
    setAssignments((prev) =>
      prev.map((a) => ({ ...a, unitId: null, selecting: false, placing: false })),
    );
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
