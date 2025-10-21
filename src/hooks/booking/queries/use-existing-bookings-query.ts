// hooks/booking/use-existing-bookings-query.ts
import { getExistingBookingsAction } from "@/actions/booking";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

// Define a chave de consulta, usando a data para invalidar e refetch
const QUERY_KEY = "existingBookings";

/**
 * @description Hook do TanStack Query para buscar os horários já agendados para uma data específica.
 * @param {Date | undefined} selectedDate - A data selecionada no formulário de agendamento.
 * @returns {UseQueryResult<string[], Error>} O resultado da query.
 */
export function useExistingBookingsQuery(
  selectedDate: Date | undefined,
): UseQueryResult<string[], Error> {
  // A data é formatada para YYYY-MM-DD para garantir que a chave da query seja estável
  const dateKey = selectedDate
    ? `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, "0")}-${selectedDate.getDate().toString().padStart(2, "0")}`
    : "";

  return useQuery({
    // A chave inclui a data para que o React Query armazene em cache e refaça a busca corretamente
    queryKey: [QUERY_KEY, dateKey],

    queryFn: async () => {
      // 1. Chama a Server Action
      const result = await getExistingBookingsAction({
        // Se a data for válida, a Server Action a usará
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        date: selectedDate!,
      });

      // 2. Trata erros da Server Action
      if ("error" in result) {
        throw new Error(result.error);
      }

      // 3. Retorna a lista de slots ocupados (Ex: ["09:00", "09:30", ...])
      return result;
    },

    // A query só deve rodar se uma data for selecionada
    enabled: !!selectedDate,
  });
}
