// hooks/inputs/mutations/use-update-input.ts

import { updateInputAction } from "@/actions/inputs";
import { UpdateInputFormValues } from "@/types/schema/zod-input-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * @description Hook customizado para atualizar um insumo existente.
 *
 * @returns {import('@tanstack/react-query').UseMutationResult<any, Error, UpdateInputFormValues, unknown>}
 */
export function useUpdateInput() {
  const queryClient = useQueryClient();

  return useMutation({
    // A função que será executada ao chamar 'mutate'
    mutationFn: async (values: UpdateInputFormValues) => {
      const result = await updateInputAction(values);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },

    // Lógica executada após o sucesso da Server Action
    onSuccess: (result) => {
      // Invalida a query da lista de insumos
      queryClient.invalidateQueries({ queryKey: ["inputsList"] });

      toast.success("Insumo atualizado com sucesso!", { description: result.message });
    },

    // Lógica executada em caso de erro
    onError: (error) => {
      console.error("Erro na mutação de atualização:", error);
      toast.error("Falha ao atualizar insumo.", {
        description: error.message || "Não foi possível se comunicar com o servidor.",
      });
    },
  });
}