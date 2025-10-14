import { createBookingAction } from "@/actions";
import { BookingViewFormValues } from "@/types/schema/zod-booking-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * @description Hook customizado para criar um novo agendamento (Booking), utilizando React Query.
 *
 * @returns {UseMutationResult<any, Error, BookingViewFormValues, unknown>} O objeto de mutação do React Query com as tipagens definidas.
 */

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    // A função que será executada ao chamar 'mutate'
    mutationFn: (values: BookingViewFormValues) => createBookingAction(values),

    // Lógica executada após o sucesso da Server Action
    onSuccess: (result) => {
      if (result.success) {
        // Invalida a query da lista de agendamentos para forçar o refetch dos novos dados
        queryClient.invalidateQueries({ queryKey: ["bookingsList"] });

        toast.success("Agendamento criado!", { description: result.message });
      } else {
        toast.error("Falha ao agendar.", { description: result.message });
      }
      return result;
    },

    // Lógica executada em caso de erro na rede ou Server Action (se não tratada em onSuccess)
    onError: (error) => {
      console.error("Erro na mutação:", error);
      toast.error("Erro de Rede", {
        description: "Não foi possível se comunicar com o servidor.",
      });
    },
  });
}
