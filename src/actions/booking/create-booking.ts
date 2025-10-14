"use server";

import db from "@/lib/prisma";
import {
  BookingViewFormValues,
  BookingViewSchema,
} from "@/types/schema/zod-booking-schema";
import { getAuthData } from "@/utils/get-auth-data";
import { addMinutes } from "date-fns";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

/**
 * @description Cria um novo agendamento (booking) associado ao negócio do usuário logado.
 * Esta Server Action realiza validação, verifica/cria o cliente e calcula
 * a hora final do agendamento, arredondando-a para o próximo slot disponível.
 *
 * @param {BookingViewFormValues} values - Dados do formulário de agendamento.
 * @returns {Promise<{ success: boolean; message: string }>} O resultado da operação.
 */
export async function createBookingAction(
  values: BookingViewFormValues,
): Promise<{ success: boolean; message: string }> {
  // 1. OBTENÇÃO DOS DADOS DE AUTORIZAÇÃO E NEGÓCIO
  const authData = await getAuthData();

  if (!authData) {
    return {
      success: false,
      message: "Não autorizado: Sessão inválida ou negócio não configurado.",
    };
  }

  const { businessId } = authData;

  // 2. Validação do Zod
  const validationResult = BookingViewSchema.safeParse(values);

  if (!validationResult.success) {
    if (validationResult.error instanceof ZodError) {
      return {
        success: false,
        message: "Dados de agendamento inválidos. Verifique todos os campos.",
      };
    }
    return { success: false, message: "Erro de validação desconhecido." };
  }

  const {
    date,
    startTime,
    customerName,
    serviceId,
    notes,
    customerEmail,
    customerPhone,
  } = validationResult.data;

  try {
    // 3. ENCONTRAR OU CRIAR CLIENTE
    let customer = await db.customer.findFirst({
      where: { name: customerName, businessId: businessId },
      select: { id: true },
    });

    if (!customer) {
      customer = await db.customer.create({
        data: {
          name: customerName,
          businessId: businessId,
          email: customerEmail,
          phone: customerPhone,
        },
        select: { id: true },
      });
    }

    const customerId = customer.id;

    // 4. BUSCAR DETALHES DO SERVIÇO E DO NEGÓCIO (Duração do Serviço e Slot Padrão)
    const businessData = await db.business.findUnique({
      where: { id: businessId },
      select: {
        slotDurationInMinutes: true, // ✅ Busque o slotDuration
        services: {
          where: { id: serviceId },
          select: { durationInMinutes: true },
        },
      },
    });

    if (
      !businessData ||
      !businessData.services[0] ||
      !businessData.slotDurationInMinutes ||
      businessData.slotDurationInMinutes <= 0
    ) {
      return {
        success: false,
        message: "Detalhes de serviço ou negócio inválidos.",
      };
    }

    const serviceDuration = businessData.services[0].durationInMinutes;
    const slotDuration = businessData.slotDurationInMinutes;

    // 5. CALCULAR HORÁRIOS
    const [hours, minutes] = startTime.split(":").map(Number);
    const startDateTime = new Date(date);
    // Define a hora e o minuto no objeto Date (importante para o fuso local)
    startDateTime.setHours(hours, minutes, 0, 0);

    // 1. Tempo total em minutos desde a meia-noite até o final REAL do serviço
    const minutesFromMidnight =
      startDateTime.getHours() * 60 + startDateTime.getMinutes();
    const minutesAfterService = minutesFromMidnight + serviceDuration;

    // 2. Calcular o "restante" do slot (Ex: 30 minutos em um slot de 45 deixa 15 minutos)
    const minutesToEndOfSlot = minutesAfterService % slotDuration;
    let minutesToAdd = 0;

    // 3. Se houver um resto, significa que o serviço parou no meio de um slot.
    //    Adicionamos o tempo restante para forçar o endTime a ser o próximo múltiplo.
    if (minutesToEndOfSlot > 0) {
      minutesToAdd = slotDuration - minutesToEndOfSlot;
    }

    // 4. Define o endTime: Duração Real + Arredondamento
    const endDateTime = addMinutes(
      startDateTime,
      serviceDuration + minutesToAdd,
    );

    // 6. PERSISTÊNCIA (Criação do Booking)
    await db.booking.create({
      data: {
        startTime: startDateTime,
        endTime: endDateTime,
        notes: notes || null,
        status: "PENDING",

        // Relacionamentos
        businessId: businessId,
        serviceId: serviceId,
        customerId: customerId,
      },
    });

    // 7. Invalidação de Cache
    revalidatePath("/appointments");
    revalidatePath("/bookings");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Agendamento para ${customerName} confirmado.`,
    };
  } catch (error) {
    console.error("Erro no servidor ao criar agendamento:", error);
    return {
      success: false,
      message: "Falha interna no servidor ao criar o agendamento.",
    };
  }
}
