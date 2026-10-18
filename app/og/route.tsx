import { ImageResponse } from "next/og";
import { asOf, brand } from "@/lib/brand";

export const runtime = "nodejs";

/**
 * OG image template. /og?title=Something renders a branded card.
 *
 * "The Record", as a broadsheet front page: bone paper, a mono dateline, a
 * large serif title over a brass rule, and the seal struck into a navy panel.
 *
 * Two Satori constraints shape every value below.
 *
 * 1. No CSS custom properties. Satori resolves no cascade, so every colour is
 *    a literal hex lifted from app/globals.css. If the palette moves, these
 *    move by hand — there is no var() to follow.
 *
 * 2. No font loading here. Satori only sets type it has real font data for,
 *    and this route has never shipped a font file; it renders in next/og's
 *    bundled default. The `fontFamily` strings below therefore express intent
 *    and degrade to a system serif rather than making the card depend on a
 *    network fetch of Instrument Serif at render time. A card that renders in
 *    the wrong serif still previews; a card whose font fetch times out is a
 *    broken link in every share.
 *
 * The dateline still reads as a dateline without Geist Mono, because what
 * carries it is the uppercasing and the 0.16em tracking, not the face.
 */

/* --- Palette (mirror of app/globals.css) --------------------------------- */
const PAPER_100 = "#F6F3EC"; /* page */
const PAPER_300 = "#DFD8C8"; /* decorative hairline */
const NAVY_500 = "#3A4E7C"; /* muted text — 7.40:1 on paper */
const NAVY_800 = "#10182B"; /* ink — 15.96:1 on paper */
const NAVY_900 = "#0A1020"; /* seal navy */
const BRASS_300 = "#D9B978"; /* accent on navy — 10.07:1 */
const BRASS_500 = "#B8873A"; /* the accent */
const BRASS_700 = "#745022"; /* the only brass safe for text on paper */

const DISPLAY_SERIF = "Instrument Serif, Times New Roman, Georgia, serif";
const DATA_MONO = "Geist Mono, ui-monospace, SF Mono, Menlo, monospace";
const UI_SANS = "Instrument Sans, system-ui, Segoe UI, sans-serif";

/** The milled edge, as in components/marks/Seal.tsx. */
const TEETH = 48;

function teethPath(): string {
  let d = "";
  for (let i = 0; i < TEETH; i += 1) {
    const angle = (i / TEETH) * Math.PI * 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    d +=
      `M ${(50 + cos * 40.5).toFixed(2)} ${(50 + sin * 40.5).toFixed(2)} ` +
      `L ${(50 + cos * 45.5).toFixed(2)} ${(50 + sin * 45.5).toFixed(2)} `;
  }
  return d.trim();
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? brand.taglineEn).slice(0, 120);
  const section = (searchParams.get("section") ?? "").slice(0, 40);

  /* Instrument Serif is set at weight 400 only and leans on size for
     emphasis, so the title steps down rather than thinning out. */
  const titleSize = title.length > 78 ? 62 : title.length > 48 ? 76 : 92;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER_100,
          padding: 64,
          fontFamily: UI_SANS,
        }}
      >
        {/* --- Masthead -------------------------------------------------- */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: DISPLAY_SERIF,
                fontSize: 38,
                color: NAVY_800,
                letterSpacing: -0.8,
              }}
            >
              {brand.name}
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: DATA_MONO,
                fontSize: 20,
                letterSpacing: 3.2,
                textTransform: "uppercase",
                color: NAVY_500,
              }}
            >
              {`As of ${asOf.label}`}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              height: 1,
              background: PAPER_300,
              marginTop: 20,
            }}
          />
        </div>

        {/* --- The story ------------------------------------------------- */}
        <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {section && (
              <div
                style={{
                  display: "flex",
                  fontFamily: DATA_MONO,
                  fontSize: 20,
                  letterSpacing: 3.6,
                  textTransform: "uppercase",
                  color: BRASS_700,
                  marginBottom: 20,
                }}
              >
                {section}
              </div>
            )}

            {/* The brass rule: structure, not decoration. It marks the head. */}
            <div style={{ display: "flex", width: 180, height: 6, background: BRASS_500 }} />

            <div
              style={{
                display: "flex",
                marginTop: 26,
                fontFamily: DISPLAY_SERIF,
                fontSize: titleSize,
                lineHeight: 1.04,
                letterSpacing: -2,
                color: NAVY_800,
              }}
            >
              {title}
            </div>
          </div>

          {/* The seal, struck into the one inverse panel on the card. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 232,
              height: 232,
              background: NAVY_900,
            }}
          >
            <svg width={176} height={176} viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="38" stroke={BRASS_300} strokeWidth="1.6" />
              <circle
                cx="50"
                cy="50"
                r="34"
                stroke={BRASS_300}
                strokeWidth="0.9"
                opacity="0.7"
              />
              <circle cx="50" cy="50" r="25" stroke={BRASS_300} strokeWidth="1.6" />
              <path
                d={teethPath()}
                stroke={BRASS_300}
                strokeWidth="1.4"
                opacity="0.85"
              />
              <path
                d="M 38 46 L 62 46 M 38 54 L 54 54"
                stroke={BRASS_300}
                strokeWidth="3"
                strokeLinecap="butt"
              />
            </svg>
          </div>
        </div>

        {/* --- Footer ---------------------------------------------------- */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", height: 1, background: PAPER_300 }} />
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 22,
              color: NAVY_500,
            }}
          >
            Electronic notarization in the Philippines · civic education, not legal advice
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
