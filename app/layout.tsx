import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import {
  Geist_Mono,
  Instrument_Sans,
  Instrument_Serif,
  Newsreader,
} from "next/font/google";
import Script from "next/script";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AnalyticsBridge } from "@/components/analytics/AnalyticsBridge";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { brand, GA_ID } from "@/lib/brand";
import "./globals.css";

/* Display. Instrument Serif ships weight 400 ONLY — Google Fonts silently
   clamps anything heavier back to 400, and asking for a weight the file does
   not have invites a synthesised fake bold that smears its high-contrast
   strokes. Size carries the emphasis instead; see globals.css h1–h4. */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

/* Long-form legal copy. Variable, with the optical-size axis bound per
   context in globals.css (.article, .lede) — the reason for a second serif. */
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  axes: ["opsz"],
  style: ["normal", "italic"],
});

/* UI: nav, buttons, labels, form controls. */
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

/* Data: dates, amounts, ledger numerals, statuses. */
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const fontVariables = [
  instrumentSerif.variable,
  newsreader.variable,
  instrumentSans.variable,
  geistMono.variable,
].join(" ");

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: {
    default: `${brand.name} — ${brand.taglineEn}`,
    template: `%s · ${brand.name}`,
  },
  description: brand.description,
  applicationName: brand.name,
  openGraph: {
    type: "website",
    locale: brand.locale,
    siteName: brand.name,
    url: brand.url,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f3ec" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1020" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-PH" className={fontVariables}>
      <head>
        {/* Google Consent Mode v2 — the default-deny.

            This MUST execute before gtag.js is fetched, and it is the whole
            mechanism: Consent Mode is ordering, not configuration. Once
            gtag.js has run `config` with no prior default in the dataLayer,
            _ga is already written and no later `update` can un-write it.

            What guarantees the order is the STRATEGY, not the position.
            `beforeInteractive` serialises this into the `self.__next_s` queue
            in <head>, which Next's script loader drains during bootstrap —
            ahead of hydration. <GoogleAnalytics /> from @next/third-parties
            uses the default afterInteractive strategy, so gtag.js is only
            appended after hydration and cannot outrun this. The SSR HTML
            carries a preload link for gtag.js, but a preload fetches without
            executing, so it does not race the default.

            The two also fail together, which is the safe direction: if the
            Next bundle never loads, neither the default-deny nor GA runs.

            The dataLayer is a queue, so gtag.js replaying it later still sees
            `default` first and `update` second, in that order.

            The cookie read afterwards is the returning-reader case: consent
            was recorded on a previous visit, and re-granting it here rather
            than waiting for React to hydrate keeps the first pageview of the
            session measurable. It only ever moves state from the denied
            baseline set immediately above; it never sets a default. */}
        <Script
          id="consent-mode-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "window.dataLayer=window.dataLayer||[];" +
              "function gtag(){window.dataLayer.push(arguments)}" +
              "window.gtag=gtag;" +
              "gtag('consent','default',{" +
              "analytics_storage:'denied'," +
              "ad_storage:'denied'," +
              "ad_user_data:'denied'," +
              "ad_personalization:'denied'," +
              "wait_for_update:500});" +
              "try{var m=document.cookie.match(/(?:^|;\\s*)cc_cookie=([^;]*)/);" +
              "if(m){var s=JSON.parse(decodeURIComponent(m[1]));" +
              "if(s&&s.categories&&s.categories.indexOf('analytics')!==-1){" +
              "gtag('consent','update',{analytics_storage:'granted'})}}}catch(e){}",
          }}
        />
        {/* Apply the stored theme before first paint — no flash, no jump. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');if(t){document.documentElement.setAttribute('data-theme',t)}}catch(e){}",
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <AnalyticsBridge />
        {/* GA still loads for everyone, but the default-deny above means it
            writes no cookies and sends only cookieless pings until the reader
            allows analytics. CookieConsent is what pushes that `update`. */}
        <GoogleAnalytics gaId={GA_ID} />
        <CookieConsent />
      </body>
    </html>
  );
}
