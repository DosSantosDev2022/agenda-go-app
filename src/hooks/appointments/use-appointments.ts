// hooks/appointments/use-agenda.ts
import {
  BookingAgenda,
  getAppointments,
} from "@/actions/appointments/get-appointments"; // Importa a Server Action e a tipagem
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * @description Hook customizado para gerenciar a busca de agendamentos para a agenda.
 * @param {string} startDate - A data de início (visível no calendário - ISO string).
 * @param {string} endDate - A data de fim (visível no calendário - ISO string).
 * @returns O estado de query do React Query com os agendamentos reais.
 */
export function useAppointmentsBookings(startDate: string, endDate: string) {
  const query = useQuery<BookingAgenda[], Error>({
    queryKey: ["appointments", startDate, endDate],

    // Agora chama a Server Action diretamente!
    queryFn: () => getAppointments(startDate, endDate),

    enabled: !!startDate && !!endDate, // Só executa se tiver as datas

    // Adicionamos um callback de erro no componente principal (ou Provider)
    // para exibir o toast, se necessário. Aqui, podemos deixar a query pura.

    staleTime: 1000 * 60, // Considera os dados frescos por 1 minuto
  });

  // Exibição de Erro (Side Effect tratado no componente, mas para debug rápido):
  if (query.isError) {
    toast.error(`Falha ao carregar a agenda: ${query.error.message}`);
  }

  return query;
}
