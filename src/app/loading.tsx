import { UI } from "@/config/theme";

/**
 * Loading skeleton displayed during route transitions.
 * Uses CSS animation and pulse effect for a polished loading experience.
 * Theme constants ensure visual consistency with the main page.
 */
export default function Loading() {
  return (
    <div
      className={`min-h-screen ${UI.background} ${UI.text.primary} flex flex-col items-center justify-center`}
    >
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-20 h-20 bg-white/10 rounded-2xl" />
        <div className="w-48 h-6 bg-white/10 rounded-lg" />
        <div className="w-32 h-4 bg-white/5 rounded-lg" />
      </div>
    </div>
  );
}
