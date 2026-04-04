// not-found.tsx
// 404 catch-all route — thin wrapper around ErrorDisplay.

import type { MetaFunction } from "react-router";
import { ErrorDisplay } from "~/components/common/error";

// ── Meta ──────────────────────────────────────────────────────────────────────

const META_TITLE = "404 — Page Not Found · Stephen Chiang";
const META_DESC = "The page you're looking for doesn't exist.";

export const meta: MetaFunction = () => [
  { title: META_TITLE },
  { name: "description", content: META_DESC },
  { name: "robots", content: "noindex, nofollow" },
];

// ── Route ─────────────────────────────────────────────────────────────────────

export default function NotFound() {
  return <ErrorDisplay code="404" />;
}
