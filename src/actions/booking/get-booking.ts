// actions/appointments/get-appointments.ts
"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { Booking, Customer, Service, StatusBooking } from "@prisma/client";
import { endOfDay, parseISO, startOfDay } from "date-fns";
import { getServerSession } from "next-auth";

/**
 * @typedef {Object} BookingAgenda
 * @property {string} id - ID do agendamento.
 * @property {Date} startTime - Hora de início.
 * @property {Date} endTime - Hora de término.
 * @property {StatusBooking} status - Status do agendamento.
 * @property {string} serviceName - Nome do serviço.
 * @property {string} customerName - Nome do cliente.
 */
export type BookingAgenda = Pick<
  Booking,
  "id" | "startTime" | "endTime" | "status" | "notes"
> & {
  serviceName: Service["name"];
  customerName: Customer["name"];
};

/**
 * @description Busca todos os agendamentos do business do usuário logado dentro de um intervalo de tempo.
 * @param {string} startStr - Data de início do período (ISO string).
 * @param {string} endStr - Data de fim do período (ISO string).
 * @returns {Promise<BookingAgenda[]>} A lista de agendamentos formatada.
 */
export async function getBookings(
  startStr: string,
  endStr: string,
): Promise<BookingAgenda[]> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.");
  }

  // 1. Encontrar o BusinessId do usuário
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { business: { select: { id: true } } },
  });

  const businessId = user?.business?.id;

  if (!businessId) {
    // Se o usuário está logado mas não tem business, retornamos vazio.
    return [];
  }

  // 2. Tratar as datas
  let startDate: Date;
  let endDate: Date;

  try {
    // As strings vêm do calendário (startStr/endStr), usamos parseISO para converter
    startDate = startOfDay(parseISO(startStr));
    endDate = endOfDay(parseISO(endStr));
  } catch (e) {
    throw new Error("Formato de data inválido.");
  }

  // 3. Buscar os agendamentos no banco de dados
  const appointments = await db.booking.findMany({
    where: {
      businessId,
      startTime: {
        gte: startDate, // Agendamentos a partir da data de início
        lte: endDate, // Agendamentos até a data de fim
      },
      // Exclui agendamentos cancelados, focando em PENDENTE e CONFIRMADO
      status: {
        in: [StatusBooking.PENDING, StatusBooking.CONFIRMED],
      },
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
      service: { select: { name: true } },
      customer: { select: { name: true } },
      notes: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });

  // 4. Formatar os resultados para o formato BookingAgenda
  return appointments.map((app) => ({
    id: app.id,
    startTime: app.startTime,
    endTime: app.endTime,
    status: app.status,
    serviceName: app.service.name,
    customerName: app.customer.name,
    notes: app.notes,
  }));
}
