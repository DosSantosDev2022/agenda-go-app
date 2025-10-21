// hooks/inputs/controllers/use-input-form-controller.ts

import { useCreateInputs } from "@/hooks/inputs/mutations/use-create-input";
import { useUpdateInput } from "@/hooks/inputs/mutations/use-update-input"; // Hook de edição
import {
  createProductSchema,
  InputFormValues,
  UpdateInputFormValues // Tipo base para edição (inclui 'id')
  , // Tipo base para criação
  updateInputSchema
} from "@/types/schema/zod-input-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

/**
 * Tipagem que representa os dados iniciais do formulário (para edição).
 * Deve incluir o 'id' para a edição.
 */
type InitialInputData = UpdateInputFormValues;

/**
 * @description Props para o hook de controle.
 */
interface UseInputFormControllerProps {
  onSuccess: () => void;
  // Dados iniciais opcionais. Se presentes, o formulário está em modo de EDIÇÃO.
  initialData?: InitialInputData;
}

/**
 * @description Hook de controle unificado para o formulário de insumos (Criação e Edição).
 * Gerencia o estado do formulário, a validação e a submissão.
 * * @param {UseInputFormControllerProps} props - Props do controller.
 */
export function useInputFormController({ onSuccess, initialData }: UseInputFormControllerProps) {
  // Determina se estamos em modo de EDIÇÃO
  const isEditMode = !!initialData?.id;

  // Hooks de Mutação
  const createMutation = useCreateInputs();
  const updateMutation = useUpdateInput();

  // A mutação em uso e o estado de carregamento global
  const { mutate, isPending } = isEditMode ? updateMutation : createMutation;

  // 2. CONFIGURAÇÃO DO FORMULÁRIO (React Hook Form)
  // O schema usado será o de update (que é mais abrangente) se for edição, ou create se for criação.
  const schema = isEditMode ? updateInputSchema : createProductSchema;

  const form = useForm({ // Usamos o tipo mais abrangente para o useForm
    resolver: zodResolver(schema),
    defaultValues: initialData || { // Usa initialData ou valores padrão para criação
      id: "",
      name: "",
      quantity: 0,
    },
  });

  // 3. Efeito para garantir que os valores do formulário sejam redefinidos quando initialData muda.
  useEffect(() => {
    if (initialData) {
      // Usamos reset() para popular o formulário com dados de edição
      form.reset(initialData);
    } else {
      // Ou limpamos se o modo for criação
      form.reset({ id: "", name: "", quantity: 0 });
    }
  }, [initialData, form]);


  // 4. LÓGICA DE SUBMISSÃO
  /**
   * @description Manipula a submissão do formulário.
   */
  const onSubmit = useCallback(
    async (values: UpdateInputFormValues | InputFormValues) => {
      // O tipo de 'values' será validado pelo Zod antes de chegar aqui.

      // Chamamos a mutação apropriada (create ou update)
      mutate(values as any, { // O tipo 'any' é necessário aqui para satisfazer ambas as mutações com o mesmo 'mutate'
        onSuccess: (result) => {
          if (result.success) {
            if (!isEditMode) {
              form.reset(); // Limpa se for criação
            }
            onSuccess(); // Fecha o modal/dialog
          }
        },
      });
    },
    [mutate, form, onSuccess, isEditMode],
  );

  // 5. RETORNO DO HOOK
  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
    isEditMode, // Retornamos para o componente UI saber o que exibir no botão
  };
}