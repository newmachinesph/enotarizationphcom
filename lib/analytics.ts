/**
 * Analytics: one helper, no-op by default.
 *
 * Plug any provider by assigning a sink once at app start:
 *
 *   import { setAnalyticsSink } from "@/lib/analytics";
 *   setAnalyticsSink((name, props) => window.plausible?.(name, { props }));
 *
 * The sink is installed by components/analytics/AnalyticsBridge, which
 * forwards events to Google Analytics. Nothing is sent from this module
 * itself, and with no bridge mounted it stays a no-op — which is what keeps
 * the rest of the app free of any vendor dependency.
 */

export type AnalyticsEvent =
  | "page_view"
  | "tool_started"
  | "tool_completed"
  | "outbound_official_link"
  | "checklist_printed";

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

type Sink = (event: AnalyticsEvent, props?: AnalyticsProps) => void;

const noop: Sink = () => {};

let sink: Sink = noop;

export function setAnalyticsSink(next: Sink): void {
  sink = next;
}

export function track(event: AnalyticsEvent, props?: AnalyticsProps): void {
  try {
    sink(event, props);
  } catch {
    // Analytics must never break the page.
  }
}
