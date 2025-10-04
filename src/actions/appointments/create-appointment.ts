// actions/appointments/create-appointment.ts
"use server";

import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import {
  AppointmentFormValues,
  AppointmentSchema,
} from "@/types/schema/zod-appointments-schema";
import { addMinutes } from "date-fns";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

/**
 * @description Obtém o BusinessId associado ao usuário logado através do NextAuth.
 * @returns O businessId do negócio do usuário logado.
 * @throws {Error} Se o usuário não estiver logado ou não tiver um negócio associado.
 */
async function getBusinessIdFromSession(): Promise<string> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    throw new Error("Não autorizado: Usuário não está logado.");
  }

  const userId = session.user.id;

  // 💡 Lógica de Busca do Business ID
  // Busca a entidade Business que o User (owner) possui.
  const business = await db.business.findUnique({
    where: { ownerId: userId },
    select: { id: true },
  });

  if (!business) {
    throw new Error("Usuário logado não possui um negócio registrado.");
  }

  return business.id;
}

export async function createAppointmentAction(
  values: AppointmentFormValues,
): Promise<{ success: boolean; message: string }> {
  // 1. Validação do Zod
  const validationResult = AppointmentSchema.safeParse(values);

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
    // A. OBTENÇÃO DO ID DO NEGÓCIO (Requisito do seu schema)
    const businessId = await getBusinessIdFromSession();

    let customer = await db.customer.findFirst({
      where: {
        name: customerName,
        businessId: businessId, // Filtra clientes apenas deste negócio
      },
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

    // C. BUSCAR DETALHES DO SERVIÇO (duração correta)
    const service = await db.service.findUnique({
      where: { id: serviceId },
      select: {
        durationInMinutes: true,
      },
    });

    if (!service) {
      return { success: false, message: "Serviço selecionado não existe." };
    }

    // D. CALCULAR HORÁRIOS
    const [hours, minutes] = startTime.split(":").map(Number);
    const startDateTime = new Date(date);
    startDateTime.setHours(hours, minutes, 0, 0);

    // Usa durationInMinutes para calcular o endTime
    const endDateTime = addMinutes(startDateTime, service.durationInMinutes);

    // E. PERSISTÊNCIA (Criação do Booking)
    await db.booking.create({
      data: {
        startTime: startDateTime,
        endTime: endDateTime,
        notes: notes || null,
        status: "PENDING", // Definido pelo default no schema, mas pode ser explícito.

        // Relacionamentos
        businessId: businessId, // Usando o ID obtido da sessão
        serviceId: serviceId,
        customerId: customerId,
      },
    });

    // F. Invalidação de Cache
    revalidatePath("/appointments");

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
