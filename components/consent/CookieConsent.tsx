"use client";

import { useEffect } from "react";
import * as CookieConsentLib from "vanilla-cookieconsent";
import { brand } from "@/lib/brand";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import "./cookieconsent-theme.css";

/**
 * Cookie consent, wired to Google Consent Mode v2.
 *
 * WHAT ACTUALLY ENFORCES CONSENT IS NOT THIS FILE.
 * -----------------------------------------------
 * `app/layout.tsx` ships a beforeInteractive script that defines dataLayer and
 * gtag and pushes `consent / default / all denied` into the dataLayer BEFORE
 * gtag.js is ever requested. Consent Mode is ordering, not configuration: once
 * gtag.js has run its `config` command with no prior default, it has already
 * written _ga. This component only ever moves the state forward from that
 * denied baseline by pushing `consent / update`.
 *
 * So the failure mode to watch for is not "the banner did not render" — it is
 * "the default command stopped being first". If GA is ever moved earlier in
 * the document than the default script, consent silently stops working while
 * the banner keeps looking correct.
 *
 * Anything on the page can open the preferences dialog with
 * `data-cc="show-preferencesModal"` — the library binds those on init, which
 * is how the "Cookie preferences" control in /privacy works without this
 * component knowing about it.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Push the current analytics decision to Google Consent Mode. */
function syncGoogleConsent() {
  const granted = CookieConsentLib.acceptedCategory("analytics");
  window.gtag?.("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}

const config: CookieConsentLib.CookieConsentConfig = {
  /* Opt-in: nothing but `necessary` runs until the reader chooses. This is the
     default, restated because it is the entire point of the component. */
  mode: "opt-in",

  guiOptions: {
    consentModal: {
      layout: "box",
      position: "bottom left",
      /* Accept and reject carry the same visual weight. A reject button that
         is harder to find than the accept button is not a real choice. */
      equalWeightButtons: true,
      flipButtons: false,
    },
    preferencesModal: {
      layout: "box",
      equalWeightButtons: true,
    },
  },

  /* Deliberately NOT setting `disablePageInteraction`, which would drop an
     overlay and make the whole site unusable until the reader answers. A
     civic page should be readable before it asks for anything.

     Verified keyboard behaviour, since this is the part that is easy to get
     wrong and impossible to guess from the config:

     - The widget mounts at the end of <body>, so the skip-link, the header,
       the article and the footer all come BEFORE it in tab order. Nothing on
       the page is unreachable, and focus is never yanked into the notice on
       load.
     - Once focus is inside the notice, Tab and Shift+Tab cycle within it.
       That is a trap, and it is the correct one here: the library marks the
       notice role="dialog" aria-modal="true", so the cycle matches what it
       tells assistive tech. Both answers sit one Tab apart, so the way out is
       always a single keystroke.
     - The preferences dialog is a real modal, and the library returns focus
       to the control that opened it on close. */

  categories: {
    necessary: {
      enabled: true,
      readOnly: true,
    },
    analytics: {
      /* Off until chosen. `enabled` here is the pre-ticked state, and a
         pre-ticked analytics box is not consent. */
      enabled: false,
      autoClear: {
        cookies: [{ name: /^_ga/ }, { name: "_gid" }],
      },
    },
  },

  /* `onConsent` covers the first acceptance AND every later page load that
     reads a stored choice; `onChange` covers a later change of mind. Adding
     `onFirstConsent` here too would only push the same update twice. */
  onConsent: syncGoogleConsent,
  onChange: syncGoogleConsent,

  language: {
    default: "en",
    translations: {
      en: {
        consentModal: {
          title: "Cookies on this site",
          description:
            "A few cookies are needed for the site to work — your theme choice, and this consent record itself. " +
            "Separately, we would like to count visits with Google Analytics so we can see which pages actually " +
            "help people and which ones are wasting your time. That part is optional and it stays off unless you " +
            "turn it on. We set no advertising cookies, we run no ads, and we sell nothing.",
          acceptAllBtn: "Allow analytics",
          acceptNecessaryBtn: "Necessary only",
          showPreferencesBtn: "Choose what to allow",
          footer:
            '<a href="/privacy">Privacy notice</a>',
        },
        preferencesModal: {
          title: "Cookie preferences",
          acceptAllBtn: "Allow analytics",
          acceptNecessaryBtn: "Necessary only",
          savePreferencesBtn: "Save my choice",
          closeIconLabel: "Close",
          serviceCounterLabel: "Cookie|Cookies",
          sections: [
            {
              title: "What this site keeps",
              description:
                "Two kinds of cookies, and only two. The first kind is needed for the site to function. " +
                "The second is analytics, which is optional and off by default. You can change your mind " +
                "here at any time, and the choice takes effect immediately.",
            },
            {
              title: "Strictly necessary",
              description:
                "Remembers your light or dark setting and stores this consent choice so we do not ask again on " +
                "every page. No account, no profile, nothing sent anywhere. These cannot be switched off, " +
                "because without them the site cannot remember that you said no.",
              linkedCategory: "necessary",
            },
            {
              title: "Analytics — optional",
              description:
                "Google Analytics, used to count page views and see which pages people leave. It tells us how many " +
                "readers reached a page, not who they are. Until you allow it, Google Consent Mode holds " +
                "analytics storage denied and no analytics cookies are written.",
              linkedCategory: "analytics",
              cookieTable: {
                headers: {
                  name: "Cookie",
                  domain: "Set by",
                  desc: "Purpose",
                  exp: "Expires",
                },
                body: [
                  {
                    name: "_ga",
                    domain: "Google Analytics",
                    desc: "Distinguishes one browser from another so a return visit is not counted twice.",
                    exp: "2 years",
                  },
                  {
                    name: "_ga_*",
                    domain: "Google Analytics",
                    desc: "Keeps the state of the current visit for this property.",
                    exp: "2 years",
                  },
                ],
              },
            },
            {
              title: "Advertising — none",
              description:
                "We set no advertising cookies and share nothing with ad networks. Ad storage, ad personalisation " +
                "and ad user data are denied by default and there is no control here to turn them on, because " +
                "there is nothing to turn on.",
            },
            {
              title: "Questions",
              description:
                `Read the full <a href="/privacy">privacy notice</a>, or write to ` +
                `<a href="mailto:${brand.contactEmail}">${brand.contactEmail}</a>.`,
            },
          ],
        },
      },
    },
  },
};

export function CookieConsent() {
  useEffect(() => {
    /* `run` is idempotent across React 19 Strict Mode's double effect — it
       bails out if the widget is already mounted — so no cleanup is needed,
       and tearing it down on unmount would only make the banner flicker on
       route changes.

       The rejection handler is not decoration. `run` is async and rejects on a
       bad config; a bare `void run(config)` swallows that, and the failure mode
       is silent — GA stays correctly denied, so nothing looks broken, but the
       notice never renders and the reader can never consent. Log it loudly. */
    CookieConsentLib.run(config).catch((err: unknown) => {
      console.error(
        "[consent] cookie notice failed to initialise — analytics will stay " +
          "denied and no banner will render:",
        err,
      );
    });
  }, []);

  return null;
}
