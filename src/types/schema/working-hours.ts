// src/types/working-hours.ts

import * as z from "zod";

/**
 * @description Array de horários válidos no formato HH:MM.
 */
export const timeSchema = z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
  message: "Formato de hora inválido (Ex: 09:00, 18:30).",
});

/**
 * @description Schema para um único dia de trabalho.
 */
export const WorkingHourSchema = z
  .object({
    day: z.enum([
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ]),
    isWorking: z.boolean(),
    startTime: timeSchema.optional(), // Opcional, pois pode ser um dia de folga
    endTime: timeSchema.optional(), // Opcional, pois pode ser um dia de folga
  })
  .refine(
    (data) => {
      // Regra: Se isWorking é true, startTime e endTime devem ser fornecidos e serem horas válidas
      if (data.isWorking) {
        return data.startTime && data.endTime && data.startTime < data.endTime;
      }
      // Se isWorking é false, startTime e endTime devem ser indefinidos (opcionalmente)
      return true;
    },
    {
      message:
        "O horário de início deve ser anterior ao de fim se o dia for de trabalho.",
      path: ["startTime", "endTime"], // A mensagem será mostrada nos dois campos
    },
  );

/**
 * @description Schema do array completo de horários de trabalho.
 */
export const WorkingHoursArraySchema = z.array(WorkingHourSchema);

export type WorkingHour = z.infer<typeof WorkingHourSchema>;
export type WorkingHoursArray = z.infer<typeof WorkingHoursArraySchema>;
