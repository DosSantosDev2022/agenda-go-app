// components/landing/features-section.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeatureCard } from "@/config/landing-page-data";

interface FeaturesSectionProps {
  data: typeof import("@/config/landing-page-data").landingPageData.features;
}

/**
 * @description Seção que lista as principais funcionalidades do app em formato de grid.
 * @param {FeaturesSectionProps} props - Dados da seção de Funcionalidades.
 */
const FeaturesSection = ({ data }: FeaturesSectionProps) => {
  return (
    <section className="px-4">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {data.heading}
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          {data.subheading}
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.cards.map((card: FeatureCard, index: number) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <card.icon className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export { FeaturesSection };
