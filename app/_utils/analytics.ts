import { track } from "@vercel/analytics"

export const AnalyticsEvent = {
  CopyDocument: "copy_document",
  ExportDocument: "export_document",
  AddToDocument: "add_to_document",
} as const
export type AnalyticsEvent = (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent]

export function trackEvent(event: AnalyticsEvent, props?: Record<string, string>) {
  track(event, props)
}
