import { getDailyAvailabilityAction } from "@/actions/booking/get-daily-availability-action"; // Ação acima
import { DailyAvailability } from "@/types/booking-types"; // Tipo DailyAvailability
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const QUERY_KEY = ["dailyAvailability"];

/**
 * @description Hook customizado que unifica a busca de Horário de Funcionamento,
 * Duração de Slot e Agendamentos Existentes para a data selecionada.
 * @param {Date | undefined} selectedDate - A data selecionada no formulário.
 * @returns {UseQueryResult<DailyAvailability, Error>} O resultado da query unificada.
 */
export function useDailyAvailabilityQuery(
  selectedDate: Date | undefined,
): UseQueryResult<DailyAvailability, Error> {
  // A chave da query DEVE mudar quando a data muda para forçar o re-fetch
  const dateKey = selectedDate
    ? `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, "0")}-${selectedDate.getDate().toString().padStart(2, "0")}`
    : "";

  return useQuery<DailyAvailability, Error>({
    queryKey: [QUERY_KEY, dateKey], // A chave muda com o dia
    queryFn: () => {
      if (!selectedDate) {
        // Embora o `enabled` cuide disso, é bom ter uma segurança extra
        throw new Error("Data de agendamento não selecionada.");
      }
      return getDailyAvailabilityAction({ date: selectedDate }).then(
        (result) => {
          if (!result) {
            throw new Error(
              "Não foi possível buscar a disponibilidade diária.",
            );
          }
          return result;
        },
      );
    },

    // A query só deve ser ativada se uma data válida estiver selecionada
    enabled: !!selectedDate,

    // O `initialData` garante que o useMemo não trave no frontend
    initialData: {
      startTime: null,
      endTime: null,
      slotDurationInMinutes: 0,
      occupiedSlots: [],
    },

    staleTime: 1000 * 60, // 1 minuto de cache (para refletir mudanças rápidas)
  });
}
