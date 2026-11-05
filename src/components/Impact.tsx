"use client";

import { site } from "@/data/site";
import { BuildText, BuildUnit } from "@/components/live/BuildUnit";

export function Impact() {
  return (
    <section id="impact" className="section-pad border-t border-white/10 py-16 sm:py-20 md:py-28">
      <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-14 lg:gap-20">
        <div>
          <BuildUnit id="impact-kicker" order={0} label="kicker" kind="chunk">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
              02 / The Impact
            </p>
          </BuildUnit>
          <h2 className="mt-4 max-w-full font-display text-4xl leading-[0.95] tracking-wide sm:text-5xl lg:text-7xl">
            <BuildText text="THE WORK." idPrefix="impact-h1" startOrder={1} />
            <br />
            <BuildText
              text="THE IMPACT."
              idPrefix="impact-h2"
              startOrder={15}
              letterClassName="text-[var(--accent)]"
            />
          </h2>

          <BuildUnit id="impact-years" order={40} label="3.10+" kind="chunk" className="mt-10">
            <div className="flex items-center gap-4">
              <span className="h-px w-8 bg-[var(--accent)]" />
              <p className="font-display text-6xl text-white sm:text-7xl md:text-8xl">3.10+</p>
              <span className="h-px w-8 bg-[var(--accent)]" />
            </div>
            <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-white/45 sm:tracking-[0.28em]">
              Years Shipping Product UI
            </p>
          </BuildUnit>
        </div>

        <div className="flex flex-col">
          {site.milestones.map((item, i) => (
            <BuildUnit
              key={item.title}
              id={`impact-ms-${i}`}
              order={50 + i}
              label={item.year}
              kind="chunk"
            >
              <div className="milestone-row flex flex-col gap-2 py-6 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="max-w-md">
                  <h3 className="text-base font-medium text-white md:text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/50">{item.detail}</p>
                </div>
                <span className="shrink-0 font-display text-2xl text-[var(--accent)] md:text-3xl">
                  {item.year}
                </span>
              </div>
            </BuildUnit>
          ))}
        </div>
      </div>
    </section>
  );
}
