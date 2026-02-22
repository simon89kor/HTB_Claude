import { ScrollViewStyleReset } from 'expo-router/html';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: htbWebStyles }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const htbWebStyles = `
/* ============================================================
   HTB Design System — Web Global Styles
   ============================================================ */

/* ----- CSS Custom Properties (Design Tokens) ----- */
:root {
  /* Colors — Primary */
  --htb-primary: #2dd4a8;
  --htb-primary-dark: #1ab894;
  --htb-primary-light: rgba(45, 212, 168, 0.15);

  /* Colors — Background */
  --htb-bg: #FFFFFF;
  --htb-bg-secondary: #F5F5F5;
  --htb-bg-dark: #1A1A1A;
  --htb-bg-dark-alt: #2A2A2A;

  /* Colors — Text */
  --htb-text: #1A1A1A;
  --htb-text-secondary: #888888;
  --htb-text-tertiary: #BBBBBB;
  --htb-text-white: #FFFFFF;

  /* Colors — Misc */
  --htb-border: #E5E5E5;
  --htb-error: #FF4444;
  --htb-success: #2dd4a8;
  --htb-warning: #FFD93D;

  /* Spacing */
  --htb-space-xs: 4px;
  --htb-space-sm: 8px;
  --htb-space-md: 16px;
  --htb-space-lg: 24px;
  --htb-space-xl: 32px;
  --htb-space-xxl: 48px;

  /* Border Radius */
  --htb-radius-sm: 8px;
  --htb-radius-md: 12px;
  --htb-radius-lg: 16px;
  --htb-radius-xl: 20px;
  --htb-radius-full: 9999px;

  /* Typography */
  --htb-font-display: 28px;
  --htb-font-h1: 22px;
  --htb-font-h2: 18px;
  --htb-font-h3: 16px;
  --htb-font-body1: 15px;
  --htb-font-body2: 13px;
  --htb-font-caption: 11px;

  /* Layout */
  --htb-nav-height: 60px;
  --htb-max-width: 480px;
}

/* ----- Base Reset ----- */
*, *::before, *::after {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html {
  height: 100%;
  height: 100dvh;
}

body {
  height: 100%;
  height: 100dvh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: var(--htb-bg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

#root {
  display: flex;
  flex-direction: column;
  height: 100%;
  height: 100dvh;
  overflow: hidden;
}

/* ----- CRITICAL FIX: React Native Web pointer-events ----- */
/*
 * RN Web generates CSS like: .r-xxx { pointer-events: none !important; }
 * with child restoration: .r-xxx > * { pointer-events: auto; }
 * This breaks nested interactive elements (grandchildren+).
 * We force pointer-events: auto on all elements inside the app root.
 */
#root div,
#root span,
#root a,
#root img {
  pointer-events: auto !important;
}

/* Ensure all interactive roles are clickable */
[role="button"],
[role="link"],
[role="checkbox"],
[role="switch"],
[role="tab"],
[role="menuitem"],
button,
a,
input,
textarea,
select,
[tabindex]:not([tabindex="-1"]) {
  pointer-events: auto !important;
}

/* Cursor styles for interactive elements */
[role="button"],
[role="link"],
[role="checkbox"],
[role="switch"],
[role="tab"],
[role="menuitem"],
button,
a {
  cursor: pointer;
}

input, textarea {
  cursor: text;
}

[aria-disabled="true"],
[disabled] {
  cursor: not-allowed;
}

/* ----- Mobile-like container on desktop ----- */
@media (min-width: 481px) {
  body {
    background-color: #E8E8E8;
  }
  #root {
    max-width: var(--htb-max-width);
    margin: 0 auto;
    background-color: var(--htb-bg);
    box-shadow: 0 0 24px rgba(0, 0, 0, 0.08);
    position: relative;
  }
}

/* ----- Scrollbar ----- */
::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--htb-text-tertiary);
  border-radius: var(--htb-radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--htb-text-secondary);
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--htb-text-tertiary) transparent;
}

/* ----- Selection ----- */
::selection {
  background-color: var(--htb-primary-light);
  color: var(--htb-text);
}

/* ----- Interactive feedback ----- */
[role="button"]:active {
  opacity: 0.7;
  transition: opacity 0.1s ease;
}

/* ----- Safe area support ----- */
@supports (padding: env(safe-area-inset-bottom)) {
  body {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* ----- Dark mode (system preference) ----- */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
  }
}
`;
