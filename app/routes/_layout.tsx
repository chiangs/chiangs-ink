// _layout.tsx
// Root layout — wires Nav, Footer, both easter egg drawers, and the toast system.
// All drawer + toast state lives here so it persists across route changes.

import { useEffect, useRef, useState } from "react";
import { isRouteErrorResponse, Outlet, useLocation, useRouteError } from "react-router";
import { ErrorDisplay } from "~/components/common/error";
import { CursorFollower } from "~/components/CursorFollower";
import { Toast } from "~/components/common";
import {
  CurrentlyDrawer,
  Footer,
  Nav,
  StyleGuideDrawer,
} from "~/components/layout";
import { useToast } from "~/hooks/useToast";
import {
  HINT_CLOCK_COPY,
  HINT_CLOCK_THRESHOLD,
  HINT_MONOGRAM_COPY,
  HINT_MONOGRAM_THRESHOLD,
  STORAGE_HINT_CLOCK_SEEN,
  STORAGE_HINT_MONOGRAM_SEEN,
  STORAGE_NAV_COUNT,
  STYLEGUIDE_UNLOCK_KEY,
} from "~/lib/constants";
import { storage } from "~/lib/storage";
import { ToastProvider } from "~/lib/toast";

// Inner layout — has access to ToastProvider context
function LayoutInner() {
  const [currentlyOpen, setCurrentlyOpen] = useState(false);
  const [styleGuideOpen, setStyleGuideOpen] = useState(false);
  const location = useLocation();
  const { isVisible, content, show, dismiss } = useToast();

  // Skip hint check on the very first render (page load counts as nav #1)
  const isFirstRender = useRef(true);

  const openCurrently = () => setCurrentlyOpen(true);
  const closeCurrently = () => setCurrentlyOpen(false);
  const openStyleGuide = () => setStyleGuideOpen(true);
  const closeStyleGuide = () => setStyleGuideOpen(false);

  const handleFirstUnlock = () => {
    window.dispatchEvent(new Event(STYLEGUIDE_UNLOCK_KEY));
  };

  // Track navigation count and fire easter egg hints at thresholds
  useEffect(() => {
    const raw = storage.get(STORAGE_NAV_COUNT);
    const count = raw ? parseInt(raw, 10) + 1 : 1;
    storage.set(STORAGE_NAV_COUNT, String(count));

    // Skip the initial mount — only react to actual navigations
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const clockSeen = storage.get(STORAGE_HINT_CLOCK_SEEN);
    const monogramSeen = storage.get(STORAGE_HINT_MONOGRAM_SEEN);

    if (count >= HINT_CLOCK_THRESHOLD && !clockSeen) {
      storage.set(STORAGE_HINT_CLOCK_SEEN, "1");
      show(HINT_CLOCK_COPY);
    } else if (count >= HINT_MONOGRAM_THRESHOLD && !monogramSeen) {
      storage.set(STORAGE_HINT_MONOGRAM_SEEN, "1");
      show(HINT_MONOGRAM_COPY);
    }
  }, [location.pathname, show]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0c0c0c",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CursorFollower />

      {/* Navigation */}
      <Nav onOpenStyleGuide={openStyleGuide} onOpenCurrently={openCurrently} />

      {/* Page content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer onOpenStyleGuide={openStyleGuide} />

      {/* Easter egg drawers */}
      <CurrentlyDrawer isOpen={currentlyOpen} onClose={closeCurrently} />
      <StyleGuideDrawer
        isOpen={styleGuideOpen}
        onClose={closeStyleGuide}
        onFirstUnlock={handleFirstUnlock}
      />

      {/* Toast notifications */}
      <Toast isVisible={isVisible} onDismiss={dismiss}>
        {content}
      </Toast>
    </div>
  );
}

export default function Layout() {
  return (
    <ToastProvider>
      <LayoutInner />
    </ToastProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const code = isRouteErrorResponse(error) && error.status === 404 ? "404" : "500";
  return <ErrorDisplay code={code} />;
}
