import { SERVICES } from "@/config/site";
import { ServiceCard } from "./ServiceCard";

/**
 * Services section — displays all child services.
 *
 * Pure RSC. Services derived from SERVICES config (single source of truth).
 * Cards are staggered by 100ms per item for visual flow.
 */
export function ServicesSection({ delay = 0 }: { delay?: number }) {
  return (
    <section
      id="services"
      className="animate-enter-up w-full"
      style={{ animationDelay: `${delay}ms` }}
      aria-label="サービス一覧"
    >
      <div className="mx-auto max-w-3xl">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            サービス
          </h2>
          <p
            className="mt-4 text-base max-w-2xl mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            MegaDrawkエコシステムを構成するプロダクト群。
          </p>
        </div>

        {/* Service cards */}
        <div className="flex flex-col gap-4">
          {SERVICES.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              delay={delay + (i + 1) * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
