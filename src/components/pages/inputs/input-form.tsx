"use client";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input
} from "@/components/ui";
import { useInputFormController } from "@/hooks/inputs/controllers/use-input-form-controller"; // Importando o novo hook
import { UpdateInputFormValues } from "@/types/schema/zod-input-schema"; // Importando a tipagem de edição
import { Loader2, PlusCircle } from "lucide-react";

/**
 * @typedef {object} InputFormProps
 * @property {() => void} onSuccess - Callback para ser executado após uma submissão bem-sucedida (criação ou edição), normalmente usado para fechar o modal.
 * @property {UpdateInputFormValues} [initialData] - Dados iniciais (opcionais) para pré-popular o formulário no modo de edição. Se presente, o formulário opera em modo de edição.
 */
interface InputFormProps {
  onSuccess: () => void; // Callback para fechar o modal ou dialog após sucesso.
  initialData?: UpdateInputFormValues; // Dados iniciais (opcionais) para modo de edição.
}

/**
 * Componente de formulário unificado para criação e edição de insumos.
 * Ele utiliza o hook `useInputFormController` para gerenciar o estado, validação e submissão dos dados,
 * adaptando-se automaticamente para o modo de Criação ou Edição com base na prop `initialData`.
 * * @param {InputFormProps} props - As propriedades do componente.
 * @returns {JSX.Element} - O formulário React.
 */
const InputForm = ({ onSuccess, initialData }: InputFormProps) => {

  // Usamos nosso hook unificado, passando os dados iniciais.
  const { form, onSubmit, isPending, isEditMode } = useInputFormController({
    onSuccess,
    initialData
  });

  /**
   * Texto do botão de submissão, dinâmico de acordo com o modo de operação.
   * @type {string}
   */
  const submitButtonText = isEditMode ? "Salvar Alterações" : "Adicionar Insumo";

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">

        {/* O campo ID será oculto se estiver no modo de edição */}
        {isEditMode && (
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              // Campo ID oculto para garantir que o valor seja enviado na edição
              <Input type="hidden" {...field} />
            )}
          />
        )}

        {/* 1. CAMPO NOME DO INSUMO */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Insumo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Parafuso Sextavado"
                  disabled={isPending}
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 2. CAMPO QUANTIDADE */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade em Estoque</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  disabled={isPending}
                  autoComplete="off"
                  {...field}
                  value={field.value === 0 || field.value ? String(field.value) : ''}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* BOTÃO DE SUBMISSÃO */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            // Ícone condicional para Edição ou Criação
            isEditMode ? (
              <Loader2 className="mr-2 h-4 w-4" />
            ) : (
              <PlusCircle className="mr-2 h-4 w-4" />
            )
          )}
          {isPending ? (isEditMode ? "Salvando..." : "Adicionando...") : submitButtonText}
        </Button>
      </form>
    </Form>
  );
};

export { InputForm };

