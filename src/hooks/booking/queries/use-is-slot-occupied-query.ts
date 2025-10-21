// hooks/booking/use-is-slot-occupied-query.ts (Novo Hook)

import { getDailyAvailabilityAction } from "@/actions/booking";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useMemo } from "react";

interface SlotCheckResult {
  isOccupied: boolean;
  isLoading: boolean;
}

/**
 * @description Verifica se um slot específico (startTime) para uma data já está ocupado por outro booking.
 * @param {Date | undefined} date - Data do agendamento.
 * @param {Date | undefined} startTime - Hora de início do agendamento a ser verificado.
 * @param {string} currentBookingId - O ID do agendamento atual (para ignorá-lo na verificação).
 * @returns {SlotCheckResult} Indica se o slot está ocupado.
 */
export function useIsSlotOccupiedQuery(
  date: Date | undefined,
  startTime: Date | undefined,
  currentBookingId: string | undefined,
): SlotCheckResult {
  // Converte a hora de início para o formato "HH:MM" para a checagem
  const timeKey = startTime ? format(startTime, "HH:mm") : "";
  const dateKey = date ? format(date, "yyyy-MM-dd") : "";

  // A query só deve rodar se tivermos data e hora
  const isEnabled = !!date && !!startTime && !!timeKey;

  const { data: availability, isLoading } = useQuery({
    queryKey: ["slotCheck", dateKey, timeKey, currentBookingId],
    queryFn: async () => {
      if (!date) return null;

      // Reutilizamos a Server Action unificada de disponibilidade.
      const result = await getDailyAvailabilityAction({
        date,
        currentBookingId,
      });

      if (!result) return null;

      // Filtra os slots ocupados, ignorando o próprio agendamento (se for o caso)
      // NOTA: Para funcionar corretamente, a Server Action precisa retornar
      // a lista de slots ocupados IGNORANDO O AGENDAMENTO ATUAL.
      // Se a Server Action já ignora o booking cancelado/atual, é só verificar o slot.

      return {
        occupiedSlots: result.occupiedSlots,
        slotDurationInMinutes: result.slotDurationInMinutes, // Opcional, mas útil
      };
    },
    enabled: isEnabled,
    staleTime: 1000 * 5, // Cache curto para garantir que o estado é atual
  });

  const isOccupied = useMemo(() => {
    if (!availability || !timeKey) return false;

    // Verifica se o slot de agendamento está na lista de slots ocupados
    // Essa lista deve conter apenas agendamentos CONFIRMADOS/PENDENTES de OUTRAS pessoas.
    return availability.occupiedSlots.includes(timeKey);
  }, [availability, timeKey]);

  return { isOccupied, isLoading };
}
