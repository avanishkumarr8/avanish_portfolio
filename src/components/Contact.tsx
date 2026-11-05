"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { BuildText, BuildUnit } from "@/components/live/BuildUnit";

const contacts = [
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
  { label: "Phone", value: site.phone, href: `tel:${site.phone.replace(/\s|-/g, "")}` },
  { label: "Location", value: site.location, href: "#contact" },
  { label: "GitHub", value: "github.com/avanishkumarr8", href: site.links.github },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/avanish-a257131ab",
    href: site.links.linkedin,
  },
];

export function Contact() {
  return (
    <section id="contact" className="section-pad border-t border-white/10 py-20 md:py-28">
      <div className="grid items-end gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <BuildUnit id="contact-kicker" order={0} label="kicker">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
              05 / Contact
            </p>
          </BuildUnit>
          <h2 className="mt-4 max-w-full font-display text-4xl leading-[0.95] tracking-wide sm:text-5xl md:text-7xl lg:text-8xl">
            <BuildText text="LET'S WORK" idPrefix="contact-h1" startOrder={1} />
            <br />
            <BuildText
              text="TOGETHER."
              idPrefix="contact-h2"
              startOrder={20}
              letterClassName="text-[var(--accent)]"
            />
          </h2>

          <BuildUnit id="contact-blurb" order={40} label="blurb" className="mt-6 max-w-md">
            <p className="text-sm leading-relaxed text-white/60">
              Building product UI, dashboards, or a marketing system that needs
              React / Next.js ownership? Start a conversation.
            </p>
          </BuildUnit>

          <BuildUnit id="contact-cta" order={45} label="cta" className="mt-8">
            <a
              href={`mailto:${site.email}`}
              className="inline-flex max-w-full items-center gap-3 border border-white/20 px-2 py-2 pr-4 transition hover:border-[var(--accent)] sm:pr-6"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-[var(--accent)] text-lg">
                →
              </span>
              <span className="text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.22em]">
                Start a Conversation
              </span>
            </a>
          </BuildUnit>

          <ul className="mt-12 space-y-4">
            {contacts.map((item, i) => (
              <BuildUnit key={item.label} id={`contact-row-${i}`} order={50 + i} label={item.label}>
                <li className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
                  <span className="w-24 text-[10px] uppercase tracking-[0.2em] text-white/35">
                    {item.label}
                  </span>
                  <a
                    href={item.href}
                    className="min-w-0 break-all text-sm text-white/80 transition hover:text-[var(--accent)] sm:break-normal"
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    {item.value}
                  </a>
                </li>
              </BuildUnit>
            ))}
          </ul>
        </div>

        <BuildUnit id="contact-card" order={70} label="showreel">
          <div className="relative aspect-[4/3] overflow-hidden border border-white/10 bg-zinc-950">
            <Image
              src={site.portrait}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-[center_15%] opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/30" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(225,6,0,0.35),transparent_50%)]" />
            <div className="absolute inset-0 flex flex-col justify-between p-7 md:p-9">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Profile</p>
              <div>
                <p className="font-display text-4xl tracking-wide md:text-5xl">
                  <BuildText text="MAKE IT" idPrefix="contact-m1" startOrder={80} />
                  <br />
                  <BuildText
                    text="FEEL REAL."
                    idPrefix="contact-m2"
                    startOrder={95}
                    letterClassName="text-[var(--accent)]"
                  />
                </p>
              </div>
            </div>
          </div>
        </BuildUnit>
      </div>

      <BuildUnit id="contact-footer" order={120} label="footer" className="mt-20">
        <footer className="flex flex-col gap-3 border-t border-white/10 pt-8 text-[11px] uppercase tracking-[0.18em] text-white/35 md:flex-row md:items-center md:justify-between">
          <p>© 2026 {site.name}</p>
          <p>Frontend Engineer · React · Next.js · TypeScript</p>
        </footer>
      </BuildUnit>
    </section>
  );
}
