import type { Service } from "@/config/site";
import { MeetPicksIcon } from "@/components/icons/MeetPicksIcon";
import { ArrowUpRight } from "lucide-react";

/**
 * Icon registry — maps service ID to its icon component.
 * Add new entries here when new services are introduced.
 */
const SERVICE_ICONS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  meetpicks: MeetPicksIcon,
};

/**
 * Service card — an interactive link to a child service.
 *
 * Design:
 * - Glass-morphism card with subtle border glow on hover.
 * - Icon + title + domain + description + CTA.
 * - Full card is the click target (Fitts' law).
 * - Focus ring visible on keyboard navigation.
 *
 * Usage:
 *   <ServiceCard service={SERVICES[0]} delay={200} />
 */
export function ServiceCard({
  service,
  delay = 0,
}: {
  service: Service;
  delay?: number;
}) {
  const Icon = SERVICE_ICONS[service.id];

  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className="service-card group animate-enter-up block rounded-[var(--radius-card)] p-[var(--space-card-padding)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--color-brand-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
      style={{ animationDelay: `${delay}ms` }}
      aria-label={`${service.name} を開く — ${service.description}`}
    >
      {/* Top row: icon + text */}
      <div className="flex items-center gap-5">
        {Icon && (
          <div className="shrink-0 w-14 h-14 rounded-[var(--radius-icon)] overflow-hidden shadow-lg ring-1 ring-white/10">
            <Icon className="w-full h-full" aria-hidden="true" />
          </div>
        )}
        <div className="min-w-0">
          <h2
            className="text-xl font-bold tracking-tight transition-colors duration-[var(--duration-normal)]"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span className="group-hover:text-[var(--color-brand-light)]">
              {service.name}
            </span>
          </h2>
          <span
            className="text-xs font-mono block mt-0.5"
            style={{ color: "var(--color-text-muted)" }}
          >
            {service.subdomain}
          </span>
        </div>
      </div>

      {/* Description */}
      <p
        className="mt-4 text-sm leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {service.description}
      </p>

      {/* CTA */}
      <div
        className="mt-5 flex items-center gap-1.5 text-sm font-semibold"
        style={{ color: "var(--color-text-accent)" }}
      >
        <span>サイトを開く</span>
        <ArrowUpRight
          size={15}
          className="transition-transform duration-[var(--duration-normal)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </div>
    </a>
  );
}
