"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/data/site";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[80] transition-colors duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="section-pad flex h-16 items-center justify-between md:h-20">
        <a href="#home" className="font-display text-2xl tracking-wide md:text-3xl">
          {site.brand}
          <span className="text-[var(--accent)]"> +</span>
        </a>

        <nav className="hidden items-center gap-4 md:flex lg:gap-7">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link text-[11px] font-medium uppercase tracking-[0.18em] text-white/75 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-px w-6 bg-white transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span className={`h-px w-6 bg-white transition ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-px w-6 bg-white transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-white/10 bg-black/95 px-6 py-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {site.nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-3xl tracking-wide text-white/90"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
