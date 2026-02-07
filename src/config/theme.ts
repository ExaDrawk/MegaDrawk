/**
 * Animation & layout orchestration tokens.
 *
 * Stagger delays (ms) for landing page element entry animations.
 * Actual animation curves/durations are in globals.css (--duration-*, --ease-*).
 * This file only holds the orchestration timing.
 *
 * Layout tokens define reusable sizing/spacing values used by
 * multiple components (e.g., loading skeleton mirrors hero dimensions).
 */
export const STAGGER = {
  header: 0,
  hero: 100,
  about: 250,
  features: 400,
  services: 550,
  cta: 700,
  footer: 850,
} as const;

/**
 * Shared layout dimensions.
 * Used by HeroBrand and Loading skeleton to stay in sync.
 */
export const LAYOUT = {
  logoSize: "5.5rem",
  logoRadius: "1.375rem",
} as const;
