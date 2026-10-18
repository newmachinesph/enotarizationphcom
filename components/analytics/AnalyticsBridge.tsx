"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { useEffect } from "react";
import { setAnalyticsSink } from "@/lib/analytics";

/**
 * Connects the app's own track() helper to Google Analytics.
 *
 * lib/analytics.ts is provider-agnostic and no-ops by default; this is the
 * one place that binds it to a vendor. Swapping analytics providers means
 * changing this file and nothing else.
 */
export function AnalyticsBridge() {
  useEffect(() => {
    setAnalyticsSink((event, props) => {
      sendGAEvent("event", event, props ?? {});
    });
  }, []);

  return null;
}
