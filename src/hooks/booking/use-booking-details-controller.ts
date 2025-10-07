// hooks/agenda/use-booking-details-controller.ts

import { BookingAgenda } from "@/actions/booking/get-booking";
import { updateBookingStatus } from "@/actions/booking/update-status-booking-action";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useCallback } from "react";
import { toast } from "sonner";

/**
 * @description Hook de controle para o componente BookingDetailsModal.
 * Gerencia a formatação de dados e a atualização do status do agendamento.
 * @param booking O objeto de agendamento.
 * @param onOpenChange Função para fechar o modal.
 */
export function useBookingDetailsController(
  booking: BookingAgenda,
  onOpenChange: (open: boolean) => void,
) {
  const queryClient = useQueryClient();

  // 1. Funções de Formatação de Dados
  const formatTime = useCallback((date: Date): string => {
    // Converte Date objects (startTime/endTime) para strings formatadas
    return format(date, "HH:mm");
  }, []);

  const fullTimeRange = `${format(booking.startTime, "dd/MM")} | ${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`;

  // 2. Lógica de Atualização de Status
  const updateStatus = useCallback(
    async (newStatus: "CONFIRMED" | "CANCELED") => {
      const actionText =
        newStatus === "CONFIRMED" ? "Confirmando" : "Cancelando";
      const actionSuccessText =
        newStatus === "CONFIRMED" ? "confirmado" : "cancelado";

      // Exibe um toast de carregamento enquanto a operação ocorre
      const loadingToastId = toast.loading(`${actionText} o agendamento...`);

      const result = await updateBookingStatus(booking.id, newStatus);

      // Remove o toast de carregamento
      toast.dismiss(loadingToastId);

      if (result.success) {
        toast.success(`Agendamento ${actionSuccessText} com sucesso!`);
        // Invalida as queries para re-fetch automático
        await queryClient.invalidateQueries({ queryKey: ["appointments"] });
        onOpenChange(false); // Fecha o modal
      } else {
        toast.error(
          result.message ||
            `Falha ao ${actionText.toLowerCase()} o agendamento.`,
        );
      }
    },
    [booking.id, queryClient, onOpenChange],
  );

  // 3. Handlers Públicos
  const handleConfirmBooking = useCallback(() => {
    updateStatus("CONFIRMED");
  }, [updateStatus]);

  const handleCancelBooking = useCallback(() => {
    updateStatus("CANCELED");
  }, [updateStatus]);

  // 4. Retorno do Hook
  return {
    formatTime,
    fullTimeRange,
    handleConfirmBooking,
    handleCancelBooking,
    currentStatus: booking.status,
  };
}
