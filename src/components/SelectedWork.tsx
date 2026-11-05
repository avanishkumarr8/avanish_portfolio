"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { site, type ProjectFilter } from "@/data/site";
import { BuildText, BuildUnit } from "@/components/live/BuildUnit";

export function SelectedWork() {
  const [filter, setFilter] = useState<ProjectFilter>("All");
  const projects = useMemo(
    () => site.projects.filter((p) => p.filter.includes(filter)),
    [filter],
  );

  return (
    <section id="work" className="section-pad border-t border-white/10 py-16 sm:py-20 md:py-28">
      <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div>
          <BuildUnit id="work-kicker" order={0} label="kicker" kind="chunk">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
              01 / Selected Work
            </p>
          </BuildUnit>
          <h2 className="mt-3 max-w-full font-display text-4xl tracking-wide sm:text-5xl lg:text-7xl">
            <BuildText text="WORK THAT " idPrefix="work-h1" startOrder={1} />
            <BuildText
              text="SPEAKS"
              idPrefix="work-h2"
              startOrder={20}
              letterClassName="text-[var(--accent)]"
            />
          </h2>
        </div>
        <BuildUnit id="work-desc" order={40} label="desc" kind="chunk" className="max-w-sm">
          <p className="text-sm leading-relaxed text-white/55">
            Product surfaces, dashboards, and marketing systems shipped with React,
            Next.js, and TypeScript.
          </p>
        </BuildUnit>
      </div>

      <BuildUnit id="work-filters" order={45} label="filters" kind="chunk" className="mb-10">
        <div className="flex flex-wrap gap-2 md:gap-3">
          {site.filters.map((item) => {
            const active = filter === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition ${
                  active
                    ? "bg-[var(--accent)] text-white"
                    : "border border-white/15 text-white/60 hover:border-white/40 hover:text-white"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </BuildUnit>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <article key={project.id} className="group space-y-4">
            {/* media chunk */}
            <BuildUnit
              id={`work-media-${project.id}`}
              order={50 + index * 3}
              label={`media-${project.id}`}
              kind="chunk"
            >
              <a
                href={project.href}
                target={project.href.startsWith("http") ? "_blank" : undefined}
                rel={project.href.startsWith("http") ? "noreferrer" : undefined}
                className="block"
              >
                <div
                  className={`project-media relative aspect-[16/11] overflow-hidden border border-white/10 bg-gradient-to-br ${project.accent}`}
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : null}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
                  <span className="absolute right-3 top-3 z-10 max-w-[70%] bg-black/55 px-2 py-1 text-right text-[10px] uppercase leading-tight tracking-[0.12em] text-white/80 backdrop-blur-sm sm:right-4 sm:top-4 sm:tracking-[0.2em]">
                    {project.period}
                  </span>
                </div>
              </a>
            </BuildUnit>

            {/* index + title chunk */}
            <BuildUnit
              id={`work-title-${project.id}`}
              order={51 + index * 3}
              label={project.title.slice(0, 12)}
              kind="chunk"
            >
              <div className="flex items-start gap-4">
                <span className="font-display text-3xl text-[var(--accent)] md:text-4xl">
                  {project.id}
                </span>
                <div>
                  <h3 className="font-display text-xl leading-none tracking-wide sm:text-2xl md:text-3xl">
                    {project.title}
                  </h3>
                </div>
              </div>
            </BuildUnit>

            {/* meta chunk */}
            <BuildUnit
              id={`work-meta-${project.id}`}
              order={52 + index * 3}
              label="meta"
              kind="chunk"
            >
              <p className="pl-14 text-[11px] uppercase tracking-[0.12em] text-white/45 sm:tracking-[0.16em]">
                {project.category} · {project.tags.slice(0, 3).join(" · ")}
              </p>
            </BuildUnit>
          </article>
        ))}
      </div>
    </section>
  );
}
