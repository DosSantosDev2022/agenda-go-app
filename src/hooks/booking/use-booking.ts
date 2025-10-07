import { BookingAgenda, getBookings } from "@/actions/booking/get-booking";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

/**
 * @description Hook customizado para gerenciar a busca de agendamentos para a agenda.
 * @param {string} startDate - A data de início (visível no calendário - ISO string).
 * @param {string} endDate - A data de fim (visível no calendário - ISO string).
 * @returns O estado de query do React Query com os agendamentos reais.
 */
export function useAppointmentsBookings(
  startDate: string,
  endDate: string,
): UseQueryResult<BookingAgenda[], Error> {
  const query = useQuery<BookingAgenda[], Error>({
    // Usa uma query key estável, que muda apenas com a alteração das datas.
    queryKey: ["appointments", startDate, endDate],

    // Chama a Server Action (getBookings) diretamente como queryFn.
    queryFn: () => getBookings(startDate, endDate),

    // Performance: A query só é executada se ambas as datas existirem.
    enabled: !!startDate && !!endDate,

    // Performance: O dado é considerado fresco por 1 minuto (cache).
    staleTime: 1000 * 60,
  });

  return query;
}
