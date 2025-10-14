// components/landing/final-cta-section.tsx
import { Button } from "@/components/ui";

interface FinalCtaSectionProps {
  data: typeof import("@/config/landing-page-data").landingPageData.finalCta;
}

/**
 * @description Seção de Chamada para Ação final (CTA).
 * @param {FinalCtaSectionProps} props - Dados da seção CTA.
 */
const FinalCtaSection = ({ data }: FinalCtaSectionProps) => {
  return (
    <section className="text-center px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
        {data.title}
      </h2>
      <p className="mt-3 text-lg text-muted-foreground">
        {data.subtitle}
      </p>
      <div className="mt-8">
        <Button size="lg" className="h-14 text-xl">
          {data.ctaText}
        </Button>
      </div>
    </section>
  );
}

export { FinalCtaSection };

