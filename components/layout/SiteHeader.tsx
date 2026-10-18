"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Seal } from "@/components/marks/Seal";
import { brand, primaryNav } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

/**
 * The masthead.
 *
 * A gazette nameplate, not an app bar: the seal, the name set in the display
 * serif at its single available weight, and the sections ruled out in small
 * caps. The only structure is the hairline underneath and the brass mark under
 * the current section — no shadow, no radius, no fill.
 */
export function SiteHeader() {
  const pathname = usePathname();

  // We store the route the menu was opened on and derive `open` from it, so a
  // route change closes the menu without an effect syncing state to state.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt !== null && openedAt === pathname;
  const setOpen = (next: boolean) => setOpenedAt(next ? pathname : null);

  // Escape closes it too.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenedAt(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="chrome-blur sticky top-0 z-50 border-b border-line">
      <div className="shell flex h-16 items-center gap-4 lg:h-20">
        <Link
          href="/"
          className="pressable flex shrink-0 items-center gap-2.5 no-underline"
          aria-label={`${brand.name} — home`}
        >
          <Seal size={26} className="shrink-0" />
          <span className="font-display text-[1.3125rem] leading-none tracking-[-0.015em] text-ink lg:text-[1.4375rem]">
            {brand.name}
          </span>
        </Link>

        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center">
            {primaryNav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "pressable relative flex min-h-11 items-center px-3.5",
                      "text-[0.75rem] uppercase tracking-[0.14em] no-underline",
                      active ? "text-ink" : "text-muted hover:text-ink",
                    )}
                  >
                    {item.label}
                    {active && (
                      <span
                        aria-hidden
                        className="absolute inset-x-3.5 bottom-0 h-[2px] bg-accent"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-6">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="pressable grid size-11 place-items-center border border-line-strong bg-transparent text-ink hover:bg-sunken lg:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg
              viewBox="0 0 20 20"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="square"
              aria-hidden
            >
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav enters and exits along the same path (from the top). */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line bg-bg lg:hidden"
      >
        <nav aria-label="Main (mobile)" className="shell py-2">
          <ul className="grid">
            {primaryNav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href} className="border-b border-line last:border-b-0">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "pressable relative flex min-h-13 items-center pl-4 pr-3 no-underline",
                      "text-[0.8125rem] uppercase tracking-[0.14em]",
                      active ? "text-ink" : "text-muted",
                    )}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="absolute inset-y-2 left-0 w-[3px] bg-accent"
                      />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
