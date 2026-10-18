import { ImageResponse } from "next/og";

// Next file convention: this generates /icon and is served as the favicon.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * The Seal at 32px — brass on seal navy.
 *
 * The geometry is components/marks/Seal.tsx, but the weights are NOT a linear
 * scale of it. At 32px a 1.5-unit stroke on a 100-unit viewBox lands at 0.48
 * device pixels and disappears, so this variant thickens every stroke, drops
 * the two inner hairline rings, and cuts the milled edge from 48 teeth to 16.
 * Fewer, fatter marks survive; a faithful reduction turns to grey mud.
 *
 * 16 is not an arbitrary reduction. At 32px the 48-tooth edge closes into a
 * solid brass annulus and stops reading as milling at all, and 24 still
 * merges once the browser downsamples the tab icon to 16px. 16 teeth keep a
 * visible gap between them at both sizes, which is the only thing that makes
 * the edge legible as an edge.
 *
 * The SVG is inlined rather than imported for exactly that reason — Satori
 * renders it statically, so nothing here may animate.
 *
 * Note for content people: the *legal* Electronic Notarial Seal is rectangular
 * (1.5 x 3 in, Rule IX, Sec. 1[b]). This is a brand mark, not a depiction of
 * that seal, and a circle is what survives 16px.
 */

const NAVY_900 = "#0A1020";
const BRASS_300 = "#D9B978";

/** The milled edge. Radii are in viewBox units on the shared 100x100 field. */
function teethPath(count: number, inner: number, outer: number): string {
  let d = "";
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    d +=
      `M ${(50 + cos * inner).toFixed(2)} ${(50 + sin * inner).toFixed(2)} ` +
      `L ${(50 + cos * outer).toFixed(2)} ${(50 + sin * outer).toFixed(2)} `;
  }
  return d.trim();
}

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // Squared, like everything else in the system — a record has edges.
          background: NAVY_900,
        }}
      >
        <svg width={32} height={32} viewBox="0 0 100 100" fill="none">
          {/* Milled edge: 16 teeth, pushed out to r=41–49 so a clear gap of
              paper-free navy separates them from the ring below. */}
          <path d={teethPath(16, 41, 49)} stroke={BRASS_300} strokeWidth="5.5" />
          {/* One ring only. The r=34 hairline and the r=25 inner ring from the
              full mark collapse into each other below ~64px. */}
          <circle cx="50" cy="50" r="33" stroke={BRASS_300} strokeWidth="6" />
          {/* The ruled centre — the notarial inscription, reduced to two bars.
              The second is short, so the pair reads as ruled lines of text
              rather than as an equals sign. */}
          <path
            d="M 34 42 L 66 42 M 34 60 L 56 60"
            stroke={BRASS_300}
            strokeWidth="9"
            strokeLinecap="butt"
          />
        </svg>
      </div>
    ),
    size,
  );
}
