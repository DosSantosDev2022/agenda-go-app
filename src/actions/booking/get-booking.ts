// actions/appointments/get-appointments.ts
"use server";

import { db } from "@/lib/prisma";
import { getAuthData } from "@/utils/get-auth-data";
import { Booking, Customer, Service, StatusBooking } from "@prisma/client";
import { endOfDay, parseISO, startOfDay } from "date-fns";

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
  // 1. OBTENÇÃO DOS DADOS DE AUTORIZAÇÃO E NEGÓCIO
  const authData = await getAuthData();

  if (!authData) {
    // Se não estiver autenticado ou sem business, retorna um array vazio.
    return [];
  }

  const { businessId } = authData;
  
  // 2. Tratar as datas
  let startDate: Date;
  let endDate: Date;

  try {
    // As strings vêm do calendário (startStr/endStr), usamos parseISO para converter
    startDate = startOfDay(parseISO(startStr));
    endDate = endOfDay(parseISO(endStr));
  } catch (e) {
    // É mais seguro retornar um array vazio e logar o erro, em vez de lançar um erro que pode quebrar a UI
    console.error("Erro ao converter datas:", e);
    return [];
  }

  // 3. Buscar os agendamentos no banco de dados
  const appointments = await db.booking.findMany({
    where: {
      businessId, // 💡 businessId é usado para proteger a busca
      startTime: {
        gte: startDate, // Agendamentos a partir da data de início
        lte: endDate, // Agendamentos até a data de fim
      },
      // Exclui agendamentos cancelados, focando em PENDENTE e CONFIRMADO
      /* status: {
         in: [StatusBooking.PENDING, StatusBooking.CONFIRMED],
      }, */
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