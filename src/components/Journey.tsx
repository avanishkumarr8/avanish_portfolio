"use client";

import { site } from "@/data/site";
import { BuildText, BuildUnit } from "@/components/live/BuildUnit";

export function Journey() {
  return (
    <section id="journey" className="section-pad border-t border-white/10 py-20 md:py-28">
      <div className="mb-12 max-w-3xl">
        <BuildUnit id="journey-kicker" order={0} label="kicker">
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">04 / Journey</p>
        </BuildUnit>
        <h2 className="mt-4 max-w-full font-display text-4xl leading-[0.95] tracking-wide sm:text-5xl md:text-7xl">
          <BuildText text="KEEP MOVING." idPrefix="journey-h1" startOrder={1} />
          <br />
          <BuildText
            text="KEEP SHIPPING."
            idPrefix="journey-h2"
            startOrder={20}
            letterClassName="text-[var(--accent)]"
          />
        </h2>
      </div>

      <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-10">
          {site.experience.map((job, i) => (
            <BuildUnit key={job.company} id={`journey-job-${i}`} order={40 + i} label={job.role}>
              <article className="grid gap-3 border-t border-white/10 pt-8 md:grid-cols-[160px_1fr]">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
                  {job.period}
                </p>
                <div>
                  <h3 className="font-display text-2xl tracking-wide sm:text-3xl md:text-4xl">{job.role}</h3>
                  <p className="mt-1 text-sm text-white/65">
                    {job.company} · {job.place}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {job.points.map((point) => (
                      <li key={point} className="text-sm leading-relaxed text-white/55">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </BuildUnit>
          ))}
        </div>

        <BuildUnit id="journey-wins" order={50} label="wins" className="lg:pt-8">
          <h3 className="max-w-full font-display text-4xl leading-none tracking-wide md:text-5xl">
            <BuildText text="LITTLE WINS." idPrefix="journey-w1" startOrder={51} />
            <br />
            <BuildText
              text="BIG MEANING."
              idPrefix="journey-w2"
              startOrder={70}
              letterClassName="text-[var(--accent)]"
            />
          </h3>
          <ul className="mt-8 space-y-0 border-t border-white/10">
            {site.wins.map((win, i) => (
              <BuildUnit key={win.label} id={`journey-win-${i}`} order={90 + i} label={win.label}>
                <li className="flex flex-col gap-1 border-b border-white/10 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <span className="font-medium text-white">{win.label}</span>
                  <span className="text-xs uppercase tracking-[0.14em] text-white/40">
                    {win.note}
                  </span>
                </li>
              </BuildUnit>
            ))}
          </ul>
        </BuildUnit>
      </div>
    </section>
  );
}
