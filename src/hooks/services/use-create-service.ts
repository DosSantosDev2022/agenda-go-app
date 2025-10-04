// hooks/mutations/use-create-service.ts
import { addServiceAction } from "@/actions";
import { ServiceFormValues } from "@/types/schema/zod-service-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * @description Hook customizado para criar um novo serviço.
 * @returns O objeto de mutação do React Query.
 */
export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: ServiceFormValues) => addServiceAction(values),

    onSuccess: (result) => {
      if (result.success) {
        // Invalida a lista de serviços para mostrar o novo item
        queryClient.invalidateQueries({ queryKey: ["services"] });
        toast.success(result.message);
      } else {
        toast.error("Erro ao cadastrar.", { description: result.message });
      }
      return result;
    },
    onError: () => {
      toast.error("Erro de Conexão", {
        description:
          "Não foi possível conectar ao servidor para cadastrar o serviço.",
      });
    },
  });
}
