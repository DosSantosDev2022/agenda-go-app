// actions/dashboard/get-dashboard-data.ts (ou onde seu arquivo estiver)
"use server";

import { db } from "@/lib/prisma";
import { getAuthData } from "@/utils/get-auth-data";
import { Customer, Service, StatusBooking } from "@prisma/client";

/**
 * @typedef {Object} BookingWithServiceAndCustomer
 * @property {string} id - ID do agendamento.
 * @property {Date} startTime - Hora de início do agendamento.
 * @property {Date} endTime - Hora de término do agendamento.
 * @property {StatusBooking} status - Status do agendamento.
 * @property {Service} service - Dados do serviço agendado.
 * @property {Customer} customer - Dados do cliente.
 */
export type BookingWithServiceAndCustomer = {
  id: string;
  startTime: Date;
  endTime: Date;
  status: StatusBooking;
  service: Pick<Service, "name" | "price">;
  customer: Pick<Customer, "name">;
};

/**
 * @typedef {Object} DashboardData
 * @property {number} totalBookings - Total de agendamentos confirmados/pendentes.
 * @property {number} totalCustomers - Total de clientes.
 * @property {number} totalRevenue - Receita potencial total (Preço dos agendamentos confirmados/pendentes).
 * @property {BookingWithServiceAndCustomer[]} recentBookings - Lista dos 5 agendamentos mais recentes.
 */
export interface DashboardData {
  totalBookings: number;
  totalCustomers: number;
  totalRevenue: number;
  recentBookings: BookingWithServiceAndCustomer[];
}

/**
 * @description Busca todos os dados necessários para o dashboard do usuário logado.
 * @returns {Promise<DashboardData | null>} Os dados estruturados para a página, ou null se não for autorizado.
 */
export async function getDashboardData(): Promise<DashboardData | null> {
  // 1. OBTENÇÃO DOS DADOS DE AUTORIZAÇÃO E NEGÓCIO
  const authData = await getAuthData();

  if (!authData) {
    // Retorna null se não estiver autenticado ou sem businessId,
    // garantindo que o Server Component pai possa lidar com o redirecionamento ou estado de carregamento.
    return null;
  }

  const { businessId } = authData;

  // Busca paralela para eficiência
  const [totalBookingsCount, totalCustomersCount, allBookings, recentBookings] =
    await Promise.all([
      // Contagem de Agendamentos (Confirmados e Pendentes)
      db.booking.count({
        where: {
          businessId,
          status: { in: [StatusBooking.CONFIRMED, StatusBooking.PENDING] },
        },
      }),

      // Contagem de Clientes
      db.customer.count({
        where: { businessId },
      }),

      // Todos os agendamentos para cálculo de receita
      db.booking.findMany({
        where: {
          businessId,
          status: { in: [StatusBooking.CONFIRMED, StatusBooking.PENDING] },
        },
        select: { service: { select: { price: true } } },
      }),

      // 5 Agendamentos Recentes
      db.booking.findMany({
        where: { businessId },
        orderBy: { startTime: "desc" },
        take: 5,
        select: {
          id: true,
          startTime: true,
          endTime: true,
          status: true,
          service: { select: { name: true, price: true } },
          customer: { select: { name: true } },
        },
      }),
    ]);

  // Cálculo de Receita Potencial (Soma dos preços dos serviços agendados)
  const totalRevenue = allBookings.reduce(
    (sum, booking) => sum + booking.service.price,
    0,
  );

  return {
    totalBookings: totalBookingsCount,
    totalCustomers: totalCustomersCount,
    totalRevenue: totalRevenue,
    // O casting é necessário aqui porque o tipo de retorno do Prisma é compatível,
    // mas o TS precisa da confirmação.
    recentBookings: recentBookings as BookingWithServiceAndCustomer[],
  };
}
