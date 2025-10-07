// app/(public)/page.tsx
import { FaqSection, FeaturesSection, FinalCtaSection, HeroSection, PricingSection } from "@/components/pages/home-page";
import { Separator } from "@/components/ui/separator";
import { landingPageData } from "@/config/landing-page-data";

/**
 * @description Página inicial pública (Landing Page) do Agenda GO.
 * É um Server Component para melhor performance e SEO.
 */
export default function HomePage() {
  return (
    // Utilizamos mx-auto e px para centralizar e garantir responsividade (desktop/mobile)
    <div className="min-h-screen">
      <main className="container max-w-7xl mx-auto py-8 space-y-24 sm:py-16 md:space-y-32">

        {/* 1. SEÇÃO HERO */}
        <HeroSection data={landingPageData.hero} />

        <Separator className="max-w-md mx-auto" />

        {/* 2. SEÇÃO DE FUNCIONALIDADES */}
        <FeaturesSection data={landingPageData.features} />

        {/* 3. SEÇÃO DE PREÇOS */}
        <PricingSection data={landingPageData.pricing} />

        {/* 4. SEÇÃO DE PERGUNTAS FREQUENTES */}
        <FaqSection data={landingPageData.faq} />

      </main>

      {/* 5. SEÇÃO CTA FINAL (Full Width) */}
      <div className="bg-primary/5 border-t border-b border-primary/10 py-16">
        <FinalCtaSection data={landingPageData.finalCta} />
      </div>
    </div>
  );
}