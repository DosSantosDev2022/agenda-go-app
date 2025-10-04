// types/schema/zod-appointments-schema.ts

import { z } from "zod";

/**
 * @description Esquema de validação para o formulário de novo agendamento.
 */
export const BookingViewSchema = z.object({
  // Detalhes do Cliente
  customerName: z
    .string()
    .min(2, "O nome é obrigatório e deve ter pelo menos 2 caracteres."),
  customerEmail: z
    .string()
    .email("Formato de e-mail inválido.")
    .min(1, "O e-mail é obrigatório."),
  // Simples validação de telefone. Você pode usar Regex mais complexo se necessário.
  customerPhone: z.string().optional(),

  // Detalhes do Serviço
  serviceId: z.string({ message: "Selecione um serviço válido." }),

  // Data e Hora
  date: z.date({ error: "A data é obrigatória." }),
  startTime: z.string().min(1, "A hora de início é obrigatória."),

  // Opcional
  notes: z
    .string()
    .max(500, "As observações não podem exceder 500 caracteres.")
    .optional(),
});

/**
 * @description Interface TypeScript baseada no esquema Zod.
 */
export type BookingViewFormValues = z.infer<typeof BookingViewSchema>;
