// actions/booking/get-existing-bookings-action.ts
"use server";

import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import { addDays, startOfDay } from "date-fns";
import { getServerSession } from "next-auth";
import * as z from "zod";

const DateSchema = z.object({
  date: z.date(),
});

// Define o tipo de retorno esperado: um array de strings (horários "HH:MM") ou um objeto de erro.
type ExistingBookingsResult = string[] | { error: string };

export async function getExistingBookingsAction({
  date,
}: z.infer<typeof DateSchema>): Promise<ExistingBookingsResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "Não autorizado. Sessão Inválida." };
  }
  // 1. OBTENÇÃO DO BUSINESS ID (VERIFICAÇÃO CRÍTICA)
  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      // Garante que o Business está sendo buscado corretamente
      select: {
        business: { select: { id: true, slotDurationInMinutes: true } },
      },
    });

    const businessId = user?.business?.id;

    if (!businessId) {
      // Se não achar o ID, retorna um erro, mas não deixa que o hook receba um array vazio
      return { error: "Negócio do usuário não encontrado." };
    }
    // 2. DEFINIÇÃO DAS BORDAS DO DIA
    // Certifique-se de que startOfDay e endOfDay são do date-fns
    // A. Define o início do dia (00:00:00) NO FUSO HORÁRIO DA DATA RECEBIDA.
    const dayStart = startOfDay(date);

    // B. Define o fim do dia como 24h depois do início.
    // Isso garante um intervalo exato de 24 horas (ex: 00:00:00 até 23:59:59).
    const dayEnd = addDays(dayStart, 1);

    // 3. BUSCA NO BANCO DE DADOS
    const existingBookings = await db.booking.findMany({
      where: {
        businessId,
        startTime: {
          gte: dayStart, // Começo do dia (00:00)
          lt: dayEnd, // // Menor que o começo do próximo dia (exatamente 24h)
        },
        status: {
          // Garante que estamos pegando agendamentos que ocupam o tempo
          in: ["CONFIRMED", "PENDING"],
        },
      },
      select: {
        startTime: true,
        service: {
          select: {
            // É CRUCIAL BUSCAR A DURAÇÃO DO SERVIÇO AQUI
            durationInMinutes: true,
          },
        },
      },
    });

    // Se não houver agendamentos, retorna array vazio aqui.
    if (existingBookings.length === 0) {
      return [];
    }

    // 4. MAPEAMENTO E CÁLCULO DE SLOTS OCUPADOS
    // Usamos 15min como passo mínimo para garantir que todos os blocos sejam bloqueados
    const minSlotStep = 15;

    const occupiedSlots = existingBookings.flatMap((booking) => {
      const startDate = booking.startTime;
      const startHour = startDate.getHours();
      const startMinute = startDate.getMinutes();
      const startTotalMinutes = startHour * 60 + startMinute;

      // Pega a duração do serviço
      const serviceDuration = booking.service.durationInMinutes;

      const occupiedTimeStrings: string[] = [];

      // Loop para marcar todos os blocos de 15 minutos (ou o mínimo) que o serviço ocupa
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

    // Filtra duplicatas se houver (opcional, mas bom)
    return Array.from(new Set(occupiedSlots));
  } catch (error) {
    console.error("GET_EXISTING_BOOKINGS_ERROR", error);
    return { error: "Erro interno ao buscar agendamentos." };
  }
}
