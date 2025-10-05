// components/landing/pricing-section.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingPlan } from "@/config/landing-page-data";
import { cn } from "@/lib/utils"; // Assumindo que você tem uma função utilitária para classes
import { Check } from "lucide-react";

interface PricingSectionProps {
  data: typeof import("@/config/landing-page-data").landingPageData.pricing;
}

/**
 * @description Seção que apresenta os planos de preços.
 * @param {PricingSectionProps} props - Dados da seção de Preços.
 */
const PricingSection = ({ data }: PricingSectionProps) => {
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

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {data.plans.map((plan: PricingPlan, index: number) => (
          <Card
            key={index}
            className={cn(
              "flex flex-col",
              plan.isHighlighted && "ring-2 ring-primary shadow-2xl scale-[1.02]"
            )}
          >
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <p className="text-5xl font-extrabold mt-2">
                {plan.price}
              </p>
              <p className="text-sm text-muted-foreground">{plan.billingCycle}</p>
            </CardHeader>

            <CardContent className="flex-grow py-4 border-t border-b">
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-3 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="pt-6">
              <Button
                className="w-full"
                variant={plan.isHighlighted ? "default" : "outline"}
                size="lg"
              >
                {plan.isHighlighted ? "Começar Agora" : "Selecionar Plano"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

export { PricingSection };
