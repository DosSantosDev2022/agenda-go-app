// src/types/schema/zod-discount-schema.ts

import { z } from "zod";

/**
 * @description Esquema de validação para o formulário de envio de desconto.
 * Garante que o customerId e a porcentagem são válidos.
 */
export const DiscountSchema = z.object({
  // Campo oculto para identificar o cliente
  customerId: z.string({
    error: "ID do cliente é obrigatório.",
  }),
  // Porcentagem de desconto (de 1 a 100)
  percentage: z.coerce
    .number({
      error: "A porcentagem é obrigatória.",
    })
    .min(1, "O desconto mínimo é de 1%")
    .max(100, "O desconto máximo é de 100%"),
});

/**
 * @description Tipo inferido a partir do esquema Zod.
 */
export type DiscountFormValues = z.infer<typeof DiscountSchema>;
