"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

/**
 * Theme toggle.
 *
 * The inline script in app/layout.tsx stamps [data-theme] on <html> before
 * first paint, so the DOM already holds the truth by the time this mounts.
 * We read it with useSyncExternalStore rather than syncing it into state in
 * an effect — no cascading render, no flash, no hydration mismatch.
 */

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  const stamped = document.documentElement.getAttribute("data-theme");
  if (stamped === "dark" || stamped === "light") return stamped;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** On the server we have no DOM; render the light-theme icon and let the client correct it. */
function getServerSnapshot(): Theme {
  return "light";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const next: Theme = theme === "dark" ? "light" : "dark";

  function toggle() {
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      // Private browsing can refuse storage; the toggle still works for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="pressable grid size-11 place-items-center border border-line-strong bg-transparent text-ink hover:bg-sunken"
    >
      <span className="sr-only">Switch to {next} theme</span>
      <svg
        viewBox="0 0 20 20"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        aria-hidden
      >
        {theme === "dark" ? (
          <>
            <circle cx="10" cy="10" r="3.6" />
            <path
              d="M10 1.5v2M10 16.5v2M18.5 10h-2M3.5 10h-2M16 4l-1.4 1.4M5.4 14.6L4 16M16 16l-1.4-1.4M5.4 5.4L4 4"
              strokeLinecap="round"
            />
          </>
        ) : (
          <path d="M16.5 11.8A7 7 0 018.2 3.5a7 7 0 108.3 8.3z" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}
