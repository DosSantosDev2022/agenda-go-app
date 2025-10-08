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
 * @typedef {Object} MonthlyRevenueData
 * @property {string} month - Nome abreviado do mês (ex: Jan, Fev).
 * @property {number} totalRevenue - Receita total do mês.
 */
export interface MonthlyRevenueData {
  month: string;
  totalRevenue: number;
}

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
  monthlyRevenue: MonthlyRevenueData[];
}

/**
 * @description Mapeamento de números de mês para nomes abreviados em português.
 */
const monthNames = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

/**
 * @description Busca todos os dados necessários para o dashboard do usuário logado.
 * @returns {Promise<DashboardData | null>} Os dados estruturados para a página, ou null se não for autorizado.
 */
export async function getDashboardData(): Promise<DashboardData | null> {
  const authData = await getAuthData();

  if (!authData) {
    return null;
  }

  const { businessId } = authData;

  // Data inicial para buscar dados do último ano
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // Busca paralela para eficiência
  const [
    totalBookingsCount,
    totalCustomersCount,
    allBookings,
    confirmedBookingsLastYear,
    recentBookings,
  ] = await Promise.all([
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

    // Todos os agendamentos (Confirmados e Pendentes) para cálculo de receita total
    db.booking.findMany({
      where: {
        businessId,
        status: { in: [StatusBooking.CONFIRMED, StatusBooking.PENDING] },
      },
      select: { service: { select: { price: true } } },
    }),

    // Agendamentos CONFIRMADOS do último ano para o gráfico
    db.booking.findMany({
      where: {
        businessId,
        status: StatusBooking.CONFIRMED, // Apenas CONFIRMADOS para receita real
        startTime: { gte: oneYearAgo },
      },
      select: {
        startTime: true,
        service: { select: { price: true } },
      },
      // Ordena por data para facilitar o processamento
      orderBy: { startTime: "asc" },
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
    (sum, booking) => sum + booking.service.price / 100,
    0,
  );

  const monthlyRevenueMap = confirmedBookingsLastYear.reduce((map, booking) => {
    // Usa o mês e ano para garantir que meses de anos diferentes sejam separados
    const date = new Date(booking.startTime);
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const key = `${year}-${monthIndex}`;

    const revenue = booking.service.price / 100;

    if (!map.has(key)) {
      map.set(key, {
        monthIndex,
        year,
        totalRevenue: 0,
      });
    }

    const current = map.get(key)!;
    current.totalRevenue += revenue;

    return map;
  }, new Map<
    string,
    { monthIndex: number; year: number; totalRevenue: number }
  >());

  // Converte o Map para um array no formato MonthlyRevenueData, ordenando cronologicamente
  const monthlyRevenue: MonthlyRevenueData[] = Array.from(
    monthlyRevenueMap.values(),
  )
    .sort((a, b) => {
      // Ordena primariamente pelo ano e secundariamente pelo mês
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.monthIndex - b.monthIndex;
    })
    .map(({ monthIndex, totalRevenue }) => ({
      month: monthNames[monthIndex],
      totalRevenue: totalRevenue,
    }));
  // ----------------------------------------------------

  return {
    totalBookings: totalBookingsCount,
    totalCustomers: totalCustomersCount,
    totalRevenue: totalRevenue,
    recentBookings: recentBookings as BookingWithServiceAndCustomer[],
    monthlyRevenue: monthlyRevenue,
  };
}
