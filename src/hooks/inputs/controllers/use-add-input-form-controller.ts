// hooks/inputs/controllers/use-add-input-form-controller.ts

import { useCreateInputs } from "@/hooks/inputs/mutations/use-create-input";
import {
  createProductSchema,
  InputFormValues
} from "@/types/schema/zod-input-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

/**
 * @description Props para o hook useAddInputFormController.
 */
interface UseAddInputFormControllerProps {
  onSuccess: () => void;
}

/**
 * @description Hook de controle para o formulário de adição de insumos.
 * Gerencia o estado do formulário, a validação e a submissão.
 * @param {() => void} onSuccess - Callback para ser executado após a criação bem-sucedida.
 */
export function useAddInputFormController({ onSuccess }: UseAddInputFormControllerProps) {
  // 1. HOOK DE MUTAÇÃO
  // Este hook (do React Query/TanStack Query) é responsável por chamar a nossa Server Action.
  const { mutate, isPending } = useCreateInputs(); // Assumindo que você tem um hook 'useCreateInput' que chama 'createInputAction'

  // 2. CONFIGURAÇÃO DO FORMULÁRIO (React Hook Form)
  const form = useForm<InputFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      quantity: 0,
    },
  });

  // 3. LÓGICA DE SUBMISSÃO
  /**
   * @description Manipula a submissão do formulário, chama a mutação e lida com o resultado.
   * @param values Os dados validados do formulário.
   */
  const onSubmit = useCallback(
    async (values: InputFormValues) => {
      // Chama a função 'mutate' para executar a Server Action.
      mutate(values, {
        onSuccess: (result) => {
          if (result.success) {
            form.reset(); // Limpa o formulário
            onSuccess(); // Fecha o modal ou executa outra ação
          }
        },
      });
    },
    [mutate, form, onSuccess],
  );

  // 4. RETORNO DO HOOK
  // Retornamos apenas o que o componente do formulário precisa.
  return {
    form,
    onSubmit: form.handleSubmit(onSubmit), // Empacota a função onSubmit com o handler do React Hook Form
    isPending, // Informa se a operação de criação está em andamento
  };
}