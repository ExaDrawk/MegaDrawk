/**
 * About section — explains MegaDrawk's vision and value proposition.
 *
 * Pure RSC. Content describes the platform's core identity.
 * Stagger delay is passed from parent for entrance animation orchestration.
 */
export function AboutSection({ delay = 0 }: { delay?: number }) {
  return (
    <section
      id="about"
      className="animate-enter-up w-full"
      style={{ animationDelay: `${delay}ms` }}
      aria-label="MegaDrawkについて"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          組織の力を、
          <span style={{ color: "var(--color-brand-light)" }}>
            一つのプラットフォーム
          </span>
          に。
        </h2>

        <p
          className="mt-6 text-base sm:text-lg leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          MegaDrawkは、分散したビジネスツールを統合し、
          チーム全体の意思決定速度と品質を飛躍的に向上させます。
          エンタープライズグレードのセキュリティと
          直感的なユーザー体験を両立した、次世代のワークプラットフォームです。
        </p>

        {/* Stats row */}
        <div
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6"
          role="list"
          aria-label="プラットフォーム実績"
        >
          {[
            { value: "99.9%", label: "稼働率保証" },
            { value: "SOC2", label: "セキュリティ準拠" },
            { value: "< 50ms", label: "グローバルレイテンシ" },
          ].map((stat) => (
            <div
              key={stat.label}
              role="listitem"
              className="p-6 rounded-[var(--radius-card)]"
              style={{
                background: "var(--color-surface-overlay)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <div
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: "var(--color-brand-light)" }}
              >
                {stat.value}
              </div>
              <div
                className="mt-1 text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
