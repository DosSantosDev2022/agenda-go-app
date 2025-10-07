// actions/appointments/create-appointment.ts
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
 * * Esta Server Action realiza validação, verifica/cria o cliente e calcula
 * a hora final do agendamento antes de persistir os dados.
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
    // Se não estiver autenticado ou sem businessId, encerra imediatamente.
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
      // Retorna uma mensagem amigável em caso de erro de validação
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
      where: {
        name: customerName,
        businessId: businessId, // Filtra clientes apenas deste negócio
      },
      select: { id: true },
    });

    if (!customer) {
      // Cliente não encontrado, cria um novo
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

    // 4. BUSCAR DETALHES DO SERVIÇO (duração correta)
    const service = await db.service.findUnique({
      where: { id: serviceId },
      select: {
        durationInMinutes: true,
      },
    });

    if (!service) {
      return { success: false, message: "Serviço selecionado não existe." };
    }

    // 5. CALCULAR HORÁRIOS
    const [hours, minutes] = startTime.split(":").map(Number);
    const startDateTime = new Date(date);
    startDateTime.setHours(hours, minutes, 0, 0);

    // Usa durationInMinutes para calcular o endTime
    const endDateTime = addMinutes(startDateTime, service.durationInMinutes);

    // 6. PERSISTÊNCIA (Criação do Booking)
    await db.booking.create({
      data: {
        startTime: startDateTime,
        endTime: endDateTime,
        notes: notes || null,

        // Relacionamentos
        businessId: businessId, // Usando o ID obtido do utilitário
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
    // Erro genérico para o usuário final.
    return {
      success: false,
      message: "Falha interna no servidor ao criar o agendamento.",
    };
  }
}
