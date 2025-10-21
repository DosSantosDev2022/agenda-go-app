// hooks/inputs/mutations/use-delete-input.ts

import { deleteInputAction } from "@/actions/inputs/delete-inputs-action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * @description Argumento esperado pela Server Action de deleção.
 */
interface DeleteInputArgs {
  id: string;
}

/**
 * @description Retorno esperado da Server Action.
 */
interface ActionResponse {
  success: boolean;
  message: string;
}

/**
 * @description Hook customizado para deletar um insumo, utilizando React Query.
 *
 * @returns {import('@tanstack/react-query').UseMutationResult<ActionResponse, Error, DeleteInputArgs, unknown>}
 */
export function useDeleteInput() {
  const queryClient = useQueryClient();
  // Chaves de query a serem invalidadas após a deleção.
  const queryKeysToInvalidate = ["inputsList"];

  return useMutation<ActionResponse, Error, DeleteInputArgs>({

    // 1. FUNÇÃO DE MUTAÇÃO
    // Chama a Server Action, que espera um objeto { id: string }.
    mutationFn: async (args: DeleteInputArgs) => {
      const result = await deleteInputAction(args);

      // Trata o resultado da Server Action.
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },

    // 2. LÓGICA DE SUCESSO
    onSuccess: (result, variables) => {
      // Invalida a query da lista de insumos para forçar o refetch.
      queryKeysToInvalidate.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });

      // Exibe a notificação de sucesso
      toast.success("Insumo deletado com sucesso!", { description: result.message });
    },

    // 3. LÓGICA DE ERRO
    onError: (error) => {
      // Exibe a notificação de erro, usando a mensagem que veio da Server Action (via 'throw new Error').
      console.error("Erro na mutação de deleção:", error);
      toast.error("Falha ao deletar insumo.", {
        description: error.message || "Não foi possível se comunicar com o servidor.",
      });
    },

    // 4. MUTAÇÃO OTIMISTA (OPCIONAL)
    onMutate: async ({ id }) => {
      // Otimização: Opção para remover visualmente o item da lista antes de receber a resposta do servidor.
      queryKeysToInvalidate.forEach(key => {
        queryClient.cancelQueries({ queryKey: [key] });
      });

      // Retorna o ID para o contexto em caso de erro (rollback)
      return { previousInputId: id };
    }
  });
}