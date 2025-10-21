// hooks/mutations/use-delete-service.ts
import { deleteServiceAction } from "@/actions/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * @description Hook customizado para excluir um serviço.
 * @returns O objeto de mutação do React Query.
 */
export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceId: string) => deleteServiceAction(serviceId),

    onSuccess: (result) => {
      if (result.success) {
        // Invalida a lista de serviços para remover o item
        queryClient.invalidateQueries({ queryKey: ["services"] });
        toast.success(result.message);
      } else {
        toast.error("Falha na exclusão.", { description: result.message });
      }
      return result;
    },
    onError: () => {
      toast.error("Erro de Conexão", {
        description:
          "Não foi possível conectar ao servidor para excluir o serviço.",
      });
    },
  });
}
