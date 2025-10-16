// hooks/agenda/use-customer-combobox-controller.ts

import { CustomerSearchResult } from "@/actions";
import { useSearchCustomersQuery } from "@/hooks/customer";
import { useDebounce } from "@/hooks/use-debounce";
import { useCallback, useMemo, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";

/**
 * @description Argumentos necessários para o hook de controle.
 */
interface CustomerComboboxControllerArgs {
  field: ControllerRenderProps<any, "customerName">;
  onCustomerSelect: (customer: CustomerSearchResult) => void;
}

/**
 * @description Hook de controle para o componente CustomerCombobox.
 * Gerencia o estado do Popover, lógica de debounce e a busca reativa de clientes.
 */
export function useCustomerComboboxController({
  field,
  onCustomerSelect,
}: CustomerComboboxControllerArgs) {
  // 1. Estado da UI
  const [open, setOpen] = useState(false);

  // 2. Lógica de Debounce
  const debouncedSearchTerm = useDebounce(field.value, 300);

  // 3. Data Fetching
  // A query só roda se debouncedSearchTerm.length >= 3
  const {
    data: customers,
    isLoading,
    isFetching,
  } = useSearchCustomersQuery(debouncedSearchTerm);

  // 4. Variáveis Derivadas de Estado
  const hasValidSearchTerm = useMemo(() => {
    return debouncedSearchTerm.trim().length >= 3;
  }, [debouncedSearchTerm]);

  // 5. Manipulador de Seleção
  const handleSelect = useCallback(
    (customer: CustomerSearchResult) => {
      onCustomerSelect(customer);
      setOpen(false); // Fecha o popover após a seleção
    },
    [onCustomerSelect],
  );

  // 6. Retorno do Hook
  return {
    // Estado do Popover
    open,
    setOpen,

    // Dados da Busca
    customers,
    isFetching,
    isLoading,
    hasValidSearchTerm,

    // Handlers
    handleSelect,
  };
}
