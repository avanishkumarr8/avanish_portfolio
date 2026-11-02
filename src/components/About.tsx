"use client";

import { site } from "@/data/site";
import { BuildText, BuildUnit } from "@/components/live/BuildUnit";

export function About() {
  return (
    <section id="about" className="section-pad border-t border-white/10 py-20 md:py-28">
      <div className="mb-14 max-w-4xl">
        <BuildUnit id="about-kicker" order={0} label="kicker">
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">03 / About</p>
        </BuildUnit>
        <h2 className="mt-4 font-display text-4xl leading-[1.05] tracking-wide md:text-6xl lg:text-7xl">
          <BuildText text="NOT JUST UI." idPrefix="about-h1" startOrder={1} />
          <br />
          <BuildText text="BUT HOW YOU " idPrefix="about-h2" startOrder={20} />
          <BuildText
            text="SHIP."
            idPrefix="about-h3"
            startOrder={40}
            className="bg-[var(--accent)] px-1"
            letterClassName="text-white"
          />
        </h2>
        <BuildUnit id="about-summary" order={55} label="summary" className="mt-6 max-w-2xl">
          <p className="text-sm leading-relaxed text-white/60 md:text-base">{site.summary}</p>
        </BuildUnit>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr_0.85fr]">
        <BuildUnit id="about-edu" order={60} label="education">
          <h3 className="text-[11px] uppercase tracking-[0.24em] text-white/40">
            Education & Skills
          </h3>
          <div className="mt-5 border-l border-[var(--accent)] pl-4">
            <p className="font-display text-2xl tracking-wide">{site.education.degree}</p>
            <p className="mt-2 text-sm text-white/70">{site.education.school}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/40">
              {site.education.place} · {site.education.period}
            </p>
          </div>
          <h4 className="mt-10 text-[11px] uppercase tracking-[0.24em] text-white/40">
            Toolkit
          </h4>
          <ul className="mt-4 flex flex-wrap gap-2">
            {site.toolkit.map((skill, i) => (
              <BuildUnit
                key={skill}
                id={`about-skill-${i}`}
                order={70 + i}
                label={skill}
                as="span"
              >
                <span className="border border-white/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-white/70">
                  {skill}
                </span>
              </BuildUnit>
            ))}
          </ul>
        </BuildUnit>

        <BuildUnit id="about-process" order={90} label="process">
          <h3 className="text-[11px] uppercase tracking-[0.24em] text-white/40">
            From Idea To Ship
          </h3>
          <ol className="mt-6 space-y-0">
            {site.process.map((step) => (
              <li key={step.step} className="relative border-l border-white/15 py-4 pl-6">
                <span className="absolute -left-[5px] top-6 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                <p className="font-display text-xl tracking-wide">
                  <span className="text-[var(--accent)]">{step.step}</span> {step.title}
                </p>
                <p className="mt-1 text-sm text-white/50">{step.text}</p>
              </li>
            ))}
          </ol>
        </BuildUnit>

        <BuildUnit id="about-quote" order={100} label="quote">
          <aside className="flex min-h-[280px] flex-col justify-between bg-[var(--accent)] p-7 text-white md:p-8">
            <p className="font-display text-3xl leading-tight tracking-wide md:text-4xl">
              “{site.quote}”
            </p>
            <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-white/80">
              — {site.name}
            </p>
          </aside>
        </BuildUnit>
      </div>
    </section>
  );
}
