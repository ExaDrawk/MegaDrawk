/**
 * UI theme constants — Tailwind utility class composition.
 * Single source of truth for the application's visual theme.
 *
 * Raw CSS animations are defined in globals.css.
 * Animation delays below control staggered entry timing.
 */

export const UI = {
  background: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
  text: {
    primary: "text-white",
    secondary: "text-slate-400",
    muted: "text-slate-500",
    accent: "text-cyan-400",
  },
  card: {
    base: "bg-white/5 backdrop-blur-sm border border-white/10",
    hover: "hover:bg-white/10 hover:border-cyan-500/50",
  },
} as const;

/** CSS animation delay values (ms) for staggered entry animations. */
export const ANIMATION_DELAYS = {
  branding: 0,
  serviceCard: 300,
  footer: 600,
} as const;
