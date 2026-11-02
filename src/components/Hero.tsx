"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { BuildText, BuildUnit } from "@/components/live/BuildUnit";

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-10 pt-28 md:justify-center md:pb-16 md:pt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(225,6,0,0.18),transparent_55%)]"
      />

      <div className="pointer-events-none absolute left-0 top-[18%] z-0 w-full md:top-[12%] md:pl-[4vw]">
        <BuildText
          text="PORTFOLIO"
          idPrefix="home-portfolio"
          startOrder={0}
          className="hero-bg-word font-display justify-center text-[var(--accent)] md:justify-start"
        />
      </div>

      <div className="section-pad relative z-10 grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div className="max-w-xl space-y-4">
          <BuildUnit id="home-eyebrow" order={20} label="eyebrow" kind="chunk">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/50">
              Delhi NCR · Available for work
            </p>
          </BuildUnit>

          <h1 className="font-display text-[clamp(3.5rem,12vw,7rem)] leading-[0.9]">
            <BuildText
              text={site.brand}
              idPrefix="home-brand"
              startOrder={30}
              letterClassName="leading-[0.9]"
            />
            <BuildUnit
              id="home-brand-dot"
              order={30 + site.brand.length}
              label="."
              as="span"
              kind="char"
              className="text-[var(--accent)]"
            >
              .
            </BuildUnit>
          </h1>

          <p className="font-display text-2xl tracking-wide text-[var(--accent)] md:text-3xl">
            <BuildText
              text={site.title}
              idPrefix="home-title"
              startOrder={50}
              letterClassName="text-[var(--accent)]"
            />
          </p>

          <BuildUnit id="home-bio" order={80} label="bio" kind="chunk">
            <p className="max-w-md text-sm leading-relaxed text-white/70 md:text-base">
              {site.heroLine}
            </p>
          </BuildUnit>

          <div className="flex flex-wrap items-center gap-4 pt-3">
            <BuildUnit id="home-cta-1" order={90} label="cta" kind="chunk">
              <a
                href="#work"
                className="inline-flex items-center bg-[var(--accent)] px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[var(--accent-soft)]"
              >
                View Work
              </a>
            </BuildUnit>
            <BuildUnit id="home-cta-2" order={91} label="cta2" kind="chunk">
              <a
                href="#contact"
                className="inline-flex items-center border border-white/25 px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 transition hover:border-white/60"
              >
                Hire Me
              </a>
            </BuildUnit>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md space-y-6 lg:mr-0">
          <BuildUnit id="home-portrait" order={100} label="portrait" kind="chunk">
            <div className="relative aspect-[4/5] overflow-hidden border border-white/10 bg-zinc-950">
              <Image
                src={site.portrait}
                alt={site.name}
                fill
                priority
                sizes="(max-width: 768px) 90vw, 420px"
                className="object-cover object-[center_20%]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(225,6,0,0.18),transparent_50%)]" />
            </div>
          </BuildUnit>

          <div className="flex justify-between gap-4 border-t border-white/10 pt-5">
            {site.stats.map((stat, i) => (
              <BuildUnit
                key={stat.label}
                id={`home-stat-${i}`}
                order={110 + i}
                label={stat.label}
                kind="chunk"
                className="text-center"
              >
                <p className="font-display text-3xl text-[var(--accent)] md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/45">
                  {stat.label}
                </p>
              </BuildUnit>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
