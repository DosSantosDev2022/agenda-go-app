// actions/business/get-business-hours.ts
"use server";

import { db } from "@/lib/prisma";
import { getAuthData } from "@/utils/get-auth-data";

/**
 * @typedef {Object} DayWorkingHours
 * @property {number} dayOfWeek - Dia da semana (0=Dom, 6=Sáb).
 * @property {string} startTime - Hora de início (ex: "09:00").
 * @property {string} endTime - Hora de fim (ex: "18:00").
 */
export interface DayWorkingHours {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

/**
 * @typedef {Object} BusinessHours
 * @property {DayWorkingHours[]} workingHours - Array de horários de funcionamento por dia.
 * @property {number} slotDuration - Duração padrão do slot em minutos (ex: 60).
 */
export interface BusinessHours {
  workingHours: DayWorkingHours[];
  slotDuration: number; // ✅ Incluído novamente
}

/**
 * @description Busca as informações de horário de funcionamento e duração de slot do negócio logado.
 * @returns {Promise<BusinessHours | null>} Os horários do negócio, ou null se não for autorizado.
 */
export async function getBusinessHours(): Promise<BusinessHours | null> {
  const authData = await getAuthData();

  if (!authData?.businessId) {
    return null;
  }

  const businessWithHours = await db.business.findUnique({
    where: { id: authData.businessId },
    select: {
      slotDuration: true,
      workingHours: {
        select: {
          dayOfWeek: true,
          startTime: true,
          endTime: true,
        },
      },
    },
  });

  if (!businessWithHours || !businessWithHours.slotDuration) {
    // Retorna null se não encontrar o negócio ou se o slotDuration for 0/null
    return null;
  }

  return {
    workingHours: businessWithHours.workingHours as DayWorkingHours[],
    slotDuration: businessWithHours.slotDuration,
  };
}
