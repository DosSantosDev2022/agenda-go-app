// hooks/mutations/use-update-service.ts
import { updateServiceAction } from "@/actions";
import { ServiceFormValues } from "@/types/schema/zod-service-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdatePayload {
  serviceId: string;
  values: ServiceFormValues;
}

/**
 * @description Hook customizado para atualizar um serviço existente.
 */
export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, values }: UpdatePayload) =>
      updateServiceAction(serviceId, values),

    onSuccess: (result, variables) => {
      if (result.success) {
        // Invalida a lista geral e o cache específico para forçar o refetch
        queryClient.invalidateQueries({ queryKey: ["services"] });
        toast.success(result.message);
      } else {
        toast.error("Erro na atualização.", { description: result.message });
      }
      return result;
    },
    onError: () => {
      toast.error("Erro de Conexão", {
        description:
          "Não foi possível conectar ao servidor para atualizar o serviço.",
      });
    },
  });
}
