// hooks/mutations/use-create-appointment.ts
import { createAppointmentAction } from "@/actions/appointments/create-appointment";
import { AppointmentFormValues } from "@/types/schema/zod-appointments-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * @description Hook customizado para criar um novo agendamento, utilizando React Query.
 * @returns O objeto de mutação do React Query.
 */
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    // A função que será executada ao chamar 'mutate'
    mutationFn: (values: AppointmentFormValues) =>
      createAppointmentAction(values),

    // Lógica executada após o sucesso da Server Action
    onSuccess: (result) => {
      if (result.success) {
        // 💡 Invalida a query da lista de agendamentos para forçar o refetch dos novos dados
        // Assumindo que a chave de query da sua agenda é ['appointments']
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
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
