/**
 * WCAG 2.2 contrast gate for the Court Navy palette.
 *
 * The palette is only allowed to ship if every pair below clears its target.
 * Run with `npm run check:contrast`. Exits non-zero on any failure, so this
 * can gate CI — colour decisions are asserted here, never eyeballed.
 *
 * Targets: 4.5:1 normal text, 3:1 large text (>=24px, or >=18.66px bold) and
 * non-text UI boundaries such as borders and focus rings.
 */

const PALETTE = {
  paper50: "#FBFAF6",
  paper100: "#F6F3EC",
  paper200: "#EDE9DE",
  paper300: "#DFD8C8",
  paper400: "#C6BDA8",
  /* Control boundaries only. WCAG 1.4.11 wants 3:1 for anything that is the
     SOLE indicator of a control's edge — inputs, checkboxes, outlined buttons.
     Decorative hairlines are exempt and use paper-300 instead. */
  paper500: "#7D7460",

  navy50: "#EFF2F8",
  navy100: "#DBE2F0",
  navy200: "#B8C5DF",
  navy300: "#8B9CC4",
  navy400: "#5C71A0",
  navy500: "#3A4E7C",
  navy600: "#26375F",
  navy700: "#1A2848",
  navy800: "#10182B",
  navy900: "#0A1020",
  navy950: "#060A15",

  brass50: "#FBF7EF",
  brass100: "#F4EAD4",
  brass200: "#E8D3A8",
  brass300: "#D9B978",
  brass400: "#C99E4E",
  brass500: "#B8873A",
  brass600: "#96692B",
  brass700: "#745022",
  brass800: "#573C1D",
  brass900: "#3F2C17",

  civic300: "#8FA9D6",
  civic600: "#1B4A8F",

  white: "#FFFFFF",

  infoSoft: "#E9EEF8",
  infoSoftNight: "#142244",

  success: "#16643F",
  successSoft: "#E7F3EC",
  successNight: "#5FCE9B",
  successSoftNight: "#0B2A1E",
  warning: "#8A5200",
  warningSoft: "#FBF1E0",
  warningNight: "#EFB65E",
  warningSoftNight: "#2C1F09",
  danger: "#A32017",
  dangerSoft: "#FBEBE9",
  dangerNight: "#F0938B",
  dangerSoftNight: "#2C1210",
};

/** sRGB channel -> linear light. */
function linearize(channel) {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrast(fgHex, bgHex) {
  const a = relativeLuminance(fgHex);
  const b = relativeLuminance(bgHex);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

const p = PALETTE;

/** [label, foreground, background, target] */
const PAIRS = [
  // ---- Day edition -------------------------------------------------------
  ["ink on paper", p.navy800, p.paper100, 4.5],
  ["ink on surface", p.navy800, p.paper50, 4.5],
  ["ink on sunken", p.navy800, p.paper200, 4.5],
  ["muted on paper", p.navy500, p.paper100, 4.5],
  ["muted on surface", p.navy500, p.paper50, 4.5],
  ["link on paper", p.civic600, p.paper100, 4.5],
  ["link on surface", p.civic600, p.paper50, 4.5],
  ["brass text on paper", p.brass700, p.paper100, 4.5],
  ["brass text on brass-50", p.brass700, p.brass50, 4.5],
  ["display serif on paper (large)", p.navy800, p.paper100, 3],
  ["control border on paper", p.paper500, p.paper100, 3],
  ["control border on surface", p.paper500, p.paper50, 3],
  ["focus ring on paper (non-text)", p.civic600, p.paper100, 3],

  // Buttons, day.
  // These assert the tokens Button.tsx actually resolves to, not an idealised
  // palette. An earlier revision asserted a night-primary pairing that no
  // component rendered, so the gate reported green while the shipped button
  // failed 1.4.11 at 2.19:1. Border pairs are included precisely because the
  // border IS the control's edge.
  ["primary button label", p.navy50, p.civic600, 4.5],
  ["primary button border on paper", p.civic600, p.paper100, 3],
  ["primary button hover label", p.paper100, p.navy800, 4.5],
  ["brass button label", p.navy900, p.brass300, 4.5],
  ["brass button border on paper", p.brass700, p.paper100, 3],
  ["secondary button label", p.navy800, p.paper50, 4.5],
  ["secondary button border", p.paper500, p.paper50, 3],

  // Inverse surfaces, day (footer, seal panels)
  ["on-inverse text", p.navy50, p.navy900, 4.5],
  ["on-inverse muted", p.navy200, p.navy900, 4.5],
  ["brass accent on navy", p.brass300, p.navy900, 4.5],
  ["brass accent on navy-800", p.brass300, p.navy800, 4.5],

  // Semantic, day
  ["success on paper", p.success, p.paper100, 4.5],
  ["success on soft", p.success, p.successSoft, 4.5],
  ["warning on paper", p.warning, p.paper100, 4.5],
  ["warning on soft", p.warning, p.warningSoft, 4.5],
  ["danger on paper", p.danger, p.paper100, 4.5],
  ["danger on soft", p.danger, p.dangerSoft, 4.5],
  ["white on success", p.white, p.success, 4.5],
  ["white on danger", p.white, p.danger, 4.5],

  // Pairs the components actually ship that the first pass missed.
  // globals.css claims every pair here is asserted, so these close that gap:
  // Callout tone="info" sets info on info-soft; tone="neutral" and the
  // Disclaimer set muted on sunken; ledger numerals sit on sunken panels.
  ["info on info-soft", p.civic600, p.infoSoft, 4.5],
  ["muted on sunken", p.navy500, p.paper200, 4.5],
  ["accent text on sunken", p.brass700, p.paper200, 4.5],
  ["ink on info-soft", p.navy800, p.infoSoft, 4.5],

  // ---- Night edition -----------------------------------------------------
  ["night ink on night bg", p.navy50, p.navy900, 4.5],
  ["night ink on night surface", p.navy50, p.navy800, 4.5],
  ["night ink on night sunken", p.navy50, p.navy950, 4.5],
  ["night muted on night bg", p.navy200, p.navy900, 4.5],
  ["night muted on night surface", p.navy200, p.navy800, 4.5],
  ["night link on night bg", p.civic300, p.navy900, 4.5],
  ["night link on night surface", p.civic300, p.navy800, 4.5],
  ["night brass on night bg", p.brass300, p.navy900, 4.5],
  ["night control border on bg", p.navy400, p.navy900, 3],
  ["night control border on surface", p.navy400, p.navy800, 3],
  ["night focus ring (non-text)", p.civic300, p.navy900, 3],

  // Buttons, night
  ["night primary button label", p.navy800, p.civic300, 4.5],
  ["night primary button border", p.civic300, p.navy900, 3],
  ["night primary button hover label", p.navy900, p.navy50, 4.5],
  ["night brass button label", p.navy900, p.brass300, 4.5],
  ["night brass button border", p.brass300, p.navy900, 3],
  ["night secondary button border", p.navy400, p.navy800, 3],

  // Inverse surfaces, night (footer inverts to paper)
  ["night on-inverse text", p.navy800, p.paper100, 4.5],
  ["night on-inverse muted", p.navy600, p.paper100, 4.5],

  // Semantic, night
  ["night success on bg", p.successNight, p.navy900, 4.5],
  ["night success on soft", p.successNight, p.successSoftNight, 4.5],
  ["night warning on bg", p.warningNight, p.navy900, 4.5],
  ["night warning on soft", p.warningNight, p.warningSoftNight, 4.5],
  ["night danger on bg", p.dangerNight, p.navy900, 4.5],
  ["night danger on soft", p.dangerNight, p.dangerSoftNight, 4.5],
  ["night info on info-soft", p.civic300, p.infoSoftNight, 4.5],
  ["night muted on sunken", p.navy200, p.navy950, 4.5],
  ["night accent text on sunken", p.brass300, p.navy950, 4.5],
  ["night ink on info-soft", p.navy50, p.infoSoftNight, 4.5],
];

let failed = 0;
const rows = PAIRS.map(([label, fg, bg, target]) => {
  const ratio = contrast(fg, bg);
  const pass = ratio >= target;
  if (!pass) failed += 1;
  return { label, fg, bg, target, ratio, pass };
});

const width = Math.max(...rows.map((r) => r.label.length));
for (const r of rows) {
  const mark = r.pass ? "PASS" : "FAIL";
  console.log(
    `${mark}  ${r.label.padEnd(width)}  ${r.ratio.toFixed(2).padStart(6)}:1  ` +
      `(need ${r.target}:1)  ${r.fg} on ${r.bg}`,
  );
}

console.log(`\n${rows.length - failed}/${rows.length} pairs pass.`);

if (failed > 0) {
  console.error(`\n${failed} contrast failure(s). The palette cannot ship.`);
  process.exit(1);
}
