import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * The Seal at 180px — brass on seal navy, for iOS home screens.
 *
 * At this size the mark is drawn in full: all three concentric rings, the
 * complete 48-tooth milled edge, and the ruled centre. The geometry matches
 * components/marks/Seal.tsx exactly; only the stroke weights are nudged up,
 * because 1.5 viewBox units at this scale reads thinner on a physical home
 * screen than it does in the browser.
 *
 * Inlined rather than imported: Satori renders statically and the shared
 * component carries an `animate` path that must never reach it.
 */

const NAVY_900 = "#0A1020";
const BRASS_300 = "#D9B978";

/** Matches Seal.tsx: 48 teeth, 40.5 -> 45.5 on the 100x100 field. */
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

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: NAVY_900,
        }}
      >
        {/* 148 of 180 — iOS rounds the corners itself, so the mark keeps a
            margin wide enough that the milled edge never gets clipped. */}
        <svg width={148} height={148} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="38" stroke={BRASS_300} strokeWidth="2" />
          <circle
            cx="50"
            cy="50"
            r="34"
            stroke={BRASS_300}
            strokeWidth="1.1"
            opacity="0.7"
          />
          <circle cx="50" cy="50" r="25" stroke={BRASS_300} strokeWidth="2" />

          <path
            d={teethPath()}
            stroke={BRASS_300}
            strokeWidth="1.75"
            opacity="0.85"
          />

          {/* The ruled centre — two bars standing in for the notarial
              inscription, at the same 3-unit rule weight the system uses. */}
          <path
            d="M 38 46 L 62 46 M 38 54 L 54 54"
            stroke={BRASS_300}
            strokeWidth="3"
            strokeLinecap="butt"
          />
        </svg>
      </div>
    ),
    size,
  );
}
