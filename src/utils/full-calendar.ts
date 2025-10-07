// utils/calendar-utils.ts

import { BookingAgenda } from "@/actions/booking/get-booking";
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  startOfMonth,
  subDays,
} from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * @typedef {Object} DayData
 * @property {Date} date - O objeto Date para o dia.
 * @property {boolean} isCurrentMonth - Indica se o dia pertence ao mês atualmente visualizado.
 * @property {boolean} isToday - Indica se o dia é hoje.
 * @property {number} appointmentsCount - Número de agendamentos para o dia (inicialmente 0).
 */
export interface DayData {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  // Agora armazena a lista de agendamentos reais
  appointments: BookingAgenda[];
  appointmentsCount: number; // Mantemos a contagem para simplicidade
}

/**
 * @description Gera os dias do calendário para o mês fornecido.
 * Inclui dias da semana anterior e posterior para completar a visualização.
 * @param {Date} month - O mês central para renderização.
 * @returns {DayData[]} Um array de objetos DayData para a grade do calendário.
 */
export function getCalendarDays(month: Date): DayData[] {
  const firstOfMonth = startOfMonth(month); // primeiroDoMês
  const lastOfMonth = endOfMonth(month); // últimoDoMês

  // 1. Determina a data de INÍCIO da grade:
  // Encontra o dia da semana (0=domingo, 6=sábado) do primeiro dia do mês.
  const dayOfWeekOfFirst = getDay(firstOfMonth);

  // A data de início da grade é o primeiroOfMonth menos a diferença para o Domingo (dia 0).
  // Ex: Se 1º de out é quarta (dia 3), a grade deve começar em 1º - 3 dias = domingo.
  const startDay = subDays(firstOfMonth, dayOfWeekOfFirst);

  // 2. Determina a data de FIM da grade:
  // Queremos que a grade termine no sábado da última semana exibida.
  // O calendário precisa de 6 semanas (42 dias) para garantir a cobertura completa,
  // ou pelo menos até o sábado após o último dia do mês.

  const dayOfWeekOfLast = getDay(lastOfMonth);
  const endDay = addDays(lastOfMonth, 6 - dayOfWeekOfLast);

  // 3. Garante que sempre tenhamos 6 semanas (42 dias) se o mês for grande
  const totalDays = eachDayOfInterval({ start: startDay, end: endDay });

  // Se o intervalo gerado for menor que 42 dias, completamos até 42
  while (totalDays.length < 42) {
    totalDays.push(addDays(totalDays[totalDays.length - 1], 1));
  }

  // 4. Mapeia para o formato DayData
  return totalDays.map((date) => ({
    date,
    isCurrentMonth: date.getMonth() === month.getMonth(),
    isToday: isSameDay(date, new Date()),
    appointments: [],
    appointmentsCount: Math.floor(Math.random() * 5), // Mock: Manter o mock por enquanto
  }));
}

/**
 * @description Retorna o nome abreviado dos dias da semana (Dom, Seg, etc.)
 * @returns {string[]} Array de nomes de dias.
 */
export function getWeekdays(): string[] {
  return ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."];
}

/**
 * @description Formata a data para o cabeçalho (Ex: Outubro de 2025)
 * @param {Date} date - A data para formatar.
 * @returns {string} A string formatada.
 */
export function formatMonthYear(date: Date): string {
  return format(date, "MMMM yyyy", { locale: ptBR });
}

/**
 * @description Agrupa os agendamentos reais nos respectivos dias da grade.
 * @param {Date} month - O mês central para renderização.
 * @param {BookingAgenda[]} bookings - Agendamentos reais buscados do servidor.
 * @returns {DayData[]} Array de objetos DayData com agendamentos agrupados.
 */
export function groupBookingsIntoCalendarDays(
  month: Date,
  bookings: BookingAgenda[],
): DayData[] {
  const days = getCalendarDays(month);

  // Cria um mapa para agilizar a busca de agendamentos por dia (string formatada)
  const bookingsMap = new Map<string, BookingAgenda[]>();

  bookings.forEach((booking) => {
    // Formata a data para a chave do mapa (ex: 2025-10-03)
    const key = format(booking.startTime, "yyyy-MM-dd");
    if (!bookingsMap.has(key)) {
      bookingsMap.set(key, []);
    }
    bookingsMap.get(key)?.push(booking);
  });

  return days.map((day) => {
    const key = format(day.date, "yyyy-MM-dd");
    const dayBookings = bookingsMap.get(key) || [];

    return {
      ...day,
      appointments: dayBookings,
      appointmentsCount: dayBookings.length,
    };
  });
}
