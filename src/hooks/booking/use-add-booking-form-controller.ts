// hooks/agenda/use-add-booking-form-controller.ts

import { CustomerSearchResult } from "@/actions";
import { useCreateBooking } from "@/hooks/booking/use-create-booking";
import { useServicesQuery } from "@/hooks/services";
import {
  BookingViewFormValues,
  BookingViewSchema,
} from "@/types/schema/zod-booking-schema";
import { generateTimeSlots } from "@/utils/time-slots-generator";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useBusinessHoursQuery } from "../business/use-business-hours-query";

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
  const {
    data: services,
    isLoading: isLoadingServices,
    isError: isErrorServices,
  } = useServicesQuery();
  // Busca os dados de horário e duração do slot do negócio
  const {
    data: businessHours,
    isLoading: isLoadingHours,
    isError: isErrorHours,
  } = useBusinessHoursQuery();

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

  // 3. Observa os campos de data no formulário para gerar slots
  const selectedDate = watch("date");

  // Lógica de Geração e Filtragem de Time Slots
  /**
   * @description Calcula os slots de horário disponíveis com base na data selecionada,
   * no horário de funcionamento do dia e na duração do slot.
   * @returns {string[]} Lista de horários disponíveis formatados ("HH:MM").
   */
  const timeSlots = useMemo(() => {
    // Retorna vazio se:
    // 1. Data não selecionada.
    // 2. Dados de horário não carregados ou vazios.
    // 3. slotDuration não definido (o que indica que o dado do DB está incompleto).
    if (
      !selectedDate ||
      !businessHours?.workingHours ||
      !businessHours?.slotDuration
    ) {
      return [];
    }

    // 1. Encontra o dia da semana (0=Dom, 6=Sáb) da data selecionada
    const dayOfWeek = selectedDate.getDay();

    // 2. Encontra o horário de funcionamento para esse dia
    const hoursForDay = businessHours.workingHours.find(
      (day) => day.dayOfWeek === dayOfWeek,
    );

    // Se o negócio estiver fechado nesse dia (não há horário registrado)
    if (!hoursForDay) {
      // Limpa o startTime se o dia for inválido
      if (getValues("startTime") !== "") {
        setValue("startTime", "", { shouldValidate: true });
      }
      return [];
    }

    // 3. Gera os slots usando a duração do slot
    return generateTimeSlots(
      hoursForDay.startTime,
      hoursForDay.endTime,
      businessHours.slotDuration,
    );
  }, [selectedDate, businessHours, getValues, setValue]);

  // 4. Lógica de Submissão
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

  // 5. Lógica de Seleção de Cliente
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

  // 6. Lógica de Limpeza ao Digitar (para o campo nome do cliente)
  /**
   * @description Sobrescreve o onChange padrão para limpar Email/Telefone
   * se o usuário começar a digitar, em vez de selecionar na Combobox.
   */
  const handleCustomerNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newName = e.target.value;
      const currentName = getValues("customerName");

      // 1. Atualiza o valor do RHF
      control._formState.isDirty = true;
      setValue("customerName", newName, {
        shouldValidate: true,
        shouldDirty: true,
      });

      // 2. Limpa Email/Telefone se o usuário estiver digitando
      if (newName !== currentName) {
        setValue("customerEmail", "", { shouldValidate: true });
        setValue("customerPhone", "", { shouldValidate: true });
      }
    },
    [setValue, getValues, control],
  );

  // 7. Variáveis de Estado Derivado
  const isServicesDisabled =
    isLoadingServices ||
    isPending ||
    isErrorServices ||
    !services ||
    services.length === 0;

  // Desabilita os slots se: carregando, com erro, data não selecionada, ou lista de slots vazia.
  const isTimeSlotsDisabled =
    isLoadingHours || isErrorHours || !selectedDate || timeSlots.length === 0;

  console.log("slots:", timeSlots);

  // 8. Retorno do Hook
  return {
    form,
    onSubmit: handleSubmit(onSubmit),
    isPending,
    // Dados de Serviços
    services,
    isLoadingServices,
    isErrorServices,
    isServicesDisabled,
    // Dados de Horários
    timeSlots,
    isLoadingHours,
    isErrorHours,
    isTimeSlotsDisabled,
    // Funções de Manipulação
    handleCustomerSelect,
    handleCustomerNameChange,
    customerEmail: watch("customerEmail"),
    customerNameField: form.control,
  };
}
