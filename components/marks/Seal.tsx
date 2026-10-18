/**
 * The Seal — the site's signature mark.
 *
 * A notarial seal is the one object every reader of this site is trying to
 * end up with, so it carries the identity: concentric rings, a milled outer
 * edge, and a ruled centre. It appears as the favicon, the app icon, the OG
 * card mark, the hero device and the article reading-progress ring.
 *
 * Pure SVG with no dependencies, because it also has to render inside
 * `next/og` (Satori), which supports neither CSS animation nor <use>.
 * `animate` is therefore opt-in and stays off wherever Satori renders it.
 */

import type { CSSProperties } from "react";

type SealProps = {
  /** Rendered size in px. The geometry is a 100x100 viewBox, so it scales. */
  size?: number;
  /** Draw the rings on mount. Never enable inside next/og — Satori is static. */
  animate?: boolean;
  /** Ring/tooth colour. Defaults to the brass accent for the current theme. */
  color?: string;
  /** Colour of the two centre bars. Defaults to `color`. */
  barColor?: string;
  className?: string;
  /** Decorative by default; pass a label when the seal is the only content. */
  title?: string;
};

/** Teeth around the outer ring — the milled edge that reads as "official". */
const TEETH = 48;
const TEETH_INNER = 40.5;
const TEETH_OUTER = 45.5;

function teethPath(): string {
  let d = "";
  for (let i = 0; i < TEETH; i += 1) {
    const angle = (i / TEETH) * Math.PI * 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    d +=
      `M ${(50 + cos * TEETH_INNER).toFixed(2)} ${(50 + sin * TEETH_INNER).toFixed(2)} ` +
      `L ${(50 + cos * TEETH_OUTER).toFixed(2)} ${(50 + sin * TEETH_OUTER).toFixed(2)} `;
  }
  return d.trim();
}

export function Seal({
  size = 96,
  animate = false,
  color = "var(--accent)",
  barColor,
  className,
  title,
}: SealProps) {
  const bars = barColor ?? color;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* Outer ring. Its circumference (2*pi*38 = 238.8) seeds the draw-on
          animation, so the dash offset is exact rather than a guessed round
          number that would leave a visible gap or a pause. */}
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke={color}
        strokeWidth="1.5"
        className={animate ? "seal-draw" : undefined}
        style={animate ? ({ "--seal-len": 238.8 } as CSSProperties) : undefined}
      />
      <circle cx="50" cy="50" r="34" stroke={color} strokeWidth="0.75" opacity="0.7" />
      <circle cx="50" cy="50" r="25" stroke={color} strokeWidth="1.5" />

      <path d={teethPath()} stroke={color} strokeWidth="1.25" opacity="0.85" />

      {/* The ruled centre — two bars standing in for the notarial inscription,
          set at the same 3px rule weight the rest of the system uses. */}
      <path
        d="M 38 46 L 62 46 M 38 54 L 54 54"
        stroke={bars}
        strokeWidth="3"
        strokeLinecap="butt"
      />
    </svg>
  );
}
