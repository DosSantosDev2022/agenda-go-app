// hooks/agenda/use-add-booking-form-controller.ts

import { CustomerSearchResult } from "@/actions";
import { useCreateBooking } from "@/hooks/booking/use-create-booking";
import { useServicesQuery } from "@/hooks/services";
import {
  BookingViewFormValues,
  BookingViewSchema,
} from "@/types/schema/zod-booking-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback } from "react"; // Importar React para React.ChangeEvent
import { useForm } from "react-hook-form";

// MOCK para horários disponíveis
export const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
];

/**
 * @description Hook de controle para o componente AddABookingForm.
 * Contém a lógica de formulário, manipulação de estado e chamadas assíncronas.
 * @param {() => void} onSuccess - Callback para fechar o modal após o sucesso.
 */
export function useAddBookingFormController({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  // 1. Hooks de Dados e Mutação
  const { mutate, isPending } = useCreateBooking();
  const { data: services, isLoading, isError } = useServicesQuery();

  // 2. Configuração do React Hook Form
  const form = useForm<BookingViewFormValues>({
    resolver: zodResolver(BookingViewSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      serviceId: "",
      date: undefined, // Tipo Date | undefined
      startTime: "",
      notes: "",
    },
  });

  const { reset, setValue, handleSubmit, getValues, control, watch } = form;

  // 3. Lógica de Submissão
  /**
   * @description Manipula a submissão do formulário, integrando com a mutação.
   * @param values Os dados validados do formulário.
   */
  const onSubmit = useCallback(
    async function onSubmit(values: BookingViewFormValues) {
      // Chama a função mutate com os valores.
      mutate(values, {
        onSuccess: (result) => {
          if (result.success) {
            reset();
            onSuccess(); // Fecha o modal
          }
        },
      });
    },
    [mutate, reset, onSuccess],
  );

  // 4. Lógica de Seleção de Cliente
  /**
   * @description Função para preencher Email e Telefone ao selecionar um cliente.
   */
  const handleCustomerSelect = useCallback(
    (customer: CustomerSearchResult) => {
      // Atualiza os campos do React Hook Form com os dados do cliente
      setValue("customerName", customer.name, { shouldValidate: true });
      setValue("customerEmail", customer.email ?? "", { shouldValidate: true });
      setValue("customerPhone", customer.phone ?? "", { shouldValidate: true });
    },
    [setValue],
  );

  // 5. Lógica de Limpeza ao Digitar (para o campo nome do cliente)
  /**
   * @description Sobrescreve o onChange padrão para limpar Email/Telefone
   * se o usuário começar a digitar, em vez de selecionar na Combobox.
   */
  const handleCustomerNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newName = e.target.value;
      const currentName = getValues("customerName");

      // 1. Atualiza o valor do RHF
      // Esta é a função original que o RHF passaria para o field.onChange
      control._formState.isDirty = true; // Força a detecção de 'dirty' se necessário, embora o setValue/onChange já deva fazer isso.
      setValue("customerName", newName, {
        shouldValidate: true,
        shouldDirty: true,
      });

      // 2. Limpa Email/Telefone se o usuário estiver digitando
      // A comparação é importante para não limpar se for um valor vindo do Select (que já chamou handleCustomerSelect)
      if (newName !== currentName) {
        setValue("customerEmail", "", { shouldValidate: true });
        setValue("customerPhone", "", { shouldValidate: true });
      }
    },
    [setValue, getValues, control],
  ); // Dependências do RHF

  // 6. Variáveis de Estado Derivado
  const isServicesDisabled =
    isLoading || isPending || isError || !services || services.length === 0;

  // 7. Retorno do Hook
  return {
    form,
    onSubmit: handleSubmit(onSubmit), // Lógica do RHF acoplada ao onSubmit
    isPending,
    services,
    isLoadingServices: isLoading,
    isErrorServices: isError,
    isServicesDisabled,
    handleCustomerSelect,
    handleCustomerNameChange,
    customerEmail: watch("customerEmail"), // Expondo apenas o que é necessário para a Combobox
    customerNameField: form.control, // Passando o control diretamente para o FormField (opcional, mas comum)
  };
}

// Re-exporta o TIME_SLOTS para uso na UI
// export { TIME_SLOTS };
