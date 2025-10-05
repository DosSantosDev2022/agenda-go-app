// components/landing/faq-section.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui";

interface FaqSectionProps {
  data: typeof import("@/config/landing-page-data").landingPageData.faq;
}

/**
 * @description Seção de Perguntas Frequentes usando o Accordion do ShadcnUI.
 * @param {FaqSectionProps} props - Dados da seção FAQ.
 */
const FaqSection = ({ data }: FaqSectionProps) => {
  return (
    <section className="px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {data.heading}
        </h2>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {data.items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left font-medium">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export { FaqSection };
