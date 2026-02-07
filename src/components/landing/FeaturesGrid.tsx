import { FEATURES } from "@/config/site";
import type { Feature } from "@/config/site";
import {
  Shield,
  Blocks,
  Zap,
  BarChart3,
  Globe,
  Headphones,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Icon registry — maps feature icon name to lucide component.
 * Centralizes icon resolution; add entries when new features are introduced.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  Shield,
  Blocks,
  Zap,
  BarChart3,
  Globe,
  HeadphonesIcon: Headphones,
};

/**
 * Single feature card — used within the features grid.
 */
function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = ICON_MAP[feature.icon];

  return (
    <div
      className="group p-6 rounded-[var(--radius-card)] transition-all duration-[var(--duration-normal)] hover:bg-[var(--color-surface-overlay-hover)]"
      style={{
        background: "var(--color-surface-overlay)",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      {/* Icon */}
      {Icon && (
        <div
          className="w-12 h-12 rounded-[var(--radius-icon)] flex items-center justify-center mb-4 transition-shadow duration-[var(--duration-normal)] group-hover:shadow-[var(--shadow-glow)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(20,184,166,0.1))",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <Icon
            size={22}
            style={{ color: "var(--color-brand-light)" }}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Title */}
      <h3
        className="text-base font-bold tracking-tight"
        style={{ color: "var(--color-text-primary)" }}
      >
        {feature.title}
      </h3>

      {/* Description */}
      <p
        className="mt-2 text-sm leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {feature.description}
      </p>
    </div>
  );
}

/**
 * Features grid — displays platform capabilities.
 *
 * Pure RSC. Features derived from FEATURES config.
 * Responsive 3-column grid on desktop, single column on mobile.
 */
export function FeaturesGrid({ delay = 0 }: { delay?: number }) {
  return (
    <section
      id="features"
      className="animate-enter-up w-full"
      style={{ animationDelay: `${delay}ms` }}
      aria-label="プラットフォーム特徴"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            プラットフォームの特徴
          </h2>
          <p
            className="mt-4 text-base max-w-2xl mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            エンタープライズに求められるセキュリティ・パフォーマンス・拡張性を兼ね備えた統合基盤。
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
