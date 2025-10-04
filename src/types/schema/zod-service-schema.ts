// types/schema/service-schema.ts

import { z } from "zod";

/**
 * @description Esquema de validação para o formulário de criação/edição de Serviço.
 */
export const ServiceSchema = z.object({
  name: z.string().min(3, "O nome do serviço deve ter pelo menos 3 caracteres.").max(100, "O nome não pode exceder 100 caracteres."),
  
  // Duração em minutos (deve ser um número inteiro > 0)
  durationInMinutes: z.coerce.number({ message: "A duração é obrigatória."}).int("A duração deve ser um número inteiro.")
    .positive("A duração deve ser maior que zero."),
  
  // Preço em centavos (o valor que o usuário digita * 100)
  price: z.coerce.number({
    error: "O preço é obrigatório.",
  })
    .min(0, "O preço não pode ser negativo."),
});

/**
 * @description Interface TypeScript baseada no esquema Zod.
 */
export type ServiceFormValues = z.infer<typeof ServiceSchema>;