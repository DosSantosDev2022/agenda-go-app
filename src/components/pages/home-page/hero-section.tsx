// components/landing/hero-section.tsx
import { Button } from "@/components/ui";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeroSectionProps {
  data: typeof import("@/config/landing-page-data").landingPageData.hero;
}

/**
 * @description Seção de destaque (Hero) da landing page.
 * @param {HeroSectionProps} props - Dados da seção Hero.
 */
const HeroSection = ({ data }: HeroSectionProps) => {
  return (
    <section className="text-center pt-16 pb-8 md:pt-24 md:pb-12 px-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto">
        {data.title}
      </h1>
      <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
        {data.subtitle}
      </p>
      <div className="mt-8 flex justify-center flex-wrap lg:space-x-4 space-y-4">
        <Button asChild size="lg" className="h-12 text-lg w-full lg:w-auto">
          <Link href={"/auth/register"}>
            {data.ctaPrimary}
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-12 text-lg w-full lg:w-auto">
          <Link href={"/auth/login"}>
            {data.ctaSecondary} <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
      {/* Placeholder para imagem do produto */}
      <div className="relative mt-16 h-96 overflow-hidden">
        <Image
          src={"/images/screenshot.png"}
          alt="Screenshot do Dashboard Agenda GO"
          fill // 💡 Preenche o container pai
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
          className="object-contain object-top"
          priority
        />
      </div>
    </section>
  );
}

export { HeroSection };

