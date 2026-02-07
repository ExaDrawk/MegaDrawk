/**
 * Ambient background — decorative gradient orbs.
 *
 * Pure CSS, no JS. Uses fixed positioning to fill the viewport.
 * aria-hidden ensures screen readers skip this entirely.
 */
export function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(6,182,212,0.08), transparent 70%), " +
            "radial-gradient(ellipse 60% 50% at 80% 110%, rgba(20,184,166,0.06), transparent 70%), " +
            "var(--color-surface-base)",
        }}
      />

      {/* Floating orbs */}
      <div
        className="absolute top-[-15%] left-[-5%] w-[45%] h-[45%] rounded-full blur-[120px]"
        style={{ background: "var(--color-brand-glow)" }}
      />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] rounded-full blur-[100px]"
        style={{ background: "rgba(20,184,166,0.08)" }}
      />

      {/* Subtle noise texture for depth */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}
