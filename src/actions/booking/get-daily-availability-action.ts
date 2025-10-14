"use server";

import db from "@/lib/prisma";
import { DailyAvailability } from "@/types/booking-types"; // Assumindo o caminho do tipo
import { getAuthData } from "@/utils/get-auth-data";
import { addDays, startOfDay } from "date-fns";

interface GetAvailabilityParams {
  date: Date;
}

/**
 * @description Server Action unificada para buscar:
 * 1. Horário de funcionamento do dia.
 * 2. Duração do slot padrão do negócio.
 * 3. Slots de horário já ocupados para a data.
 * @param {GetAvailabilityParams} { date } - A data selecionada pelo usuário.
 * @returns {Promise<DailyAvailability | null>} Dados de disponibilidade diária ou null em caso de falha.
 */
export async function getDailyAvailabilityAction({
  date,
}: GetAvailabilityParams): Promise<DailyAvailability | null> {
  const authData = await getAuthData();

  if (!authData?.businessId) {
    return null;
  }

  const dayOfWeek = date.getDay(); // Obtém o dia da semana (0-6)
  const businessId = authData.businessId;

  try {
    // Busca consolidada por Business ID (usa o findUnique para buscar o business)
    const businessData = await db.business.findUnique({
      where: { id: businessId },
      select: {
        slotDurationInMinutes: true,
        workingHours: {
          where: { dayOfWeek: dayOfWeek }, // Filtra apenas o dia da semana
          select: {
            startTime: true,
            endTime: true,
          },
        },
      },
    });

    if (!businessData || !businessData.slotDurationInMinutes) {
      return null; // Não configurado
    }

    const hoursForDay = businessData.workingHours[0];
    const slotDuration = businessData.slotDurationInMinutes;

    // Se o negócio estiver fechado nesse dia, retorna apenas a duração do slot
    if (!hoursForDay) {
      return {
        startTime: null,
        endTime: null,
        slotDurationInMinutes: slotDuration,
        occupiedSlots: [],
      };
    }

    // --- Lógica de Busca de Agendamentos Existentes ---

    // 1. Definição do Intervalo de Busca (para o Prisma, garante 24h)
    const dayStart = startOfDay(date);
    const dayEnd = addDays(dayStart, 1);

    const existingBookings = await db.booking.findMany({
      where: {
        businessId,
        startTime: {
          gte: dayStart, // Começo do dia
          lt: dayEnd, // Menor que o começo do próximo dia
        },
        status: {
          in: ["CONFIRMED", "PENDING"], // Filtra apenas status que ocupam tempo
        },
      },
      select: {
        startTime: true,
        service: { select: { durationInMinutes: true } },
      },
    });

    // 2. Mapeamento e Cálculo de Slots Ocupados (Reutiliza a lógica anterior)
    const minSlotStep = 15;

    const occupiedSlots = existingBookings.flatMap((booking) => {
      const startDate = booking.startTime;
      const startHour = startDate.getHours();
      const startMinute = startDate.getMinutes();
      const startTotalMinutes = startHour * 60 + startMinute;

      const serviceDuration = booking.service.durationInMinutes;
      const occupiedTimeStrings: string[] = [];

      // Loop para marcar todos os blocos de 15 minutos que o serviço ocupa
      for (
        let t = startTotalMinutes;
        t < startTotalMinutes + serviceDuration;
        t += minSlotStep
      ) {
        const hours = Math.floor(t / 60);
        const minutes = t % 60;
        // Formatar para "HH:MM" com padding zero
        occupiedTimeStrings.push(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
        );
      }

      return occupiedTimeStrings;
    });

    // Retorno Final Unificado
    return {
      startTime: hoursForDay.startTime,
      endTime: hoursForDay.endTime,
      slotDurationInMinutes: slotDuration,
      occupiedSlots: Array.from(new Set(occupiedSlots)), // Remove duplicatas
    };
  } catch (error) {
    console.error("Erro ao buscar disponibilidade diária:", error);
    return null;
  }
}
