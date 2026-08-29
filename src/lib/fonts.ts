import localFont from "next/font/local";

/**
 * Beide Schriften liegen als Variable-Font unter src/fonts/ im Repo (SIL Open Font
 * License). Bewusst kein next/font/google: so entsteht weder zur Laufzeit noch beim
 * Build eine Verbindung zu Google.
 */

export const oswald = localFont({
  src: "../fonts/Oswald-Variable-latin.woff2",
  weight: "200 700",
  style: "normal",
  display: "swap",
  variable: "--font-oswald",
  fallback: ["Arial Narrow", "Helvetica Neue", "sans-serif"],
});

export const inter = localFont({
  src: "../fonts/Inter-Variable-latin.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-inter",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});
