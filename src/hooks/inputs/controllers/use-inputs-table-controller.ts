// hooks/customers/use-customer-table-controller.ts

import { useInfiniteInputsQuery } from "@/hooks/inputs/controllers/use-infinite-inputs-query";
import { InputsListItem } from "@/types/inputs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

/**
 * @description Hook de controle para o componente InputsTable.
 * Gerencia a busca infinita de insumos, pesquisa e lógica de scroll.
 */
export function useInputsTableController() {
  // 1. Estado de Pesquisa (que será aplicado com debounce no hook de query, ou aqui se não estiver no useInfiniteInputsQuery)
  // Nota: O estado de debounce já está sendo gerenciado *dentro* do InputsTable original.
  // Vamos mantê-lo aqui para controlar a pesquisa.
  const [searchTerm, setSearchTerm] = useState("");

  // 2. Data Fetching (tanstack/query)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isFetching,
  } = useInfiniteInputsQuery(searchTerm);

  // 3. Detecção de Visibilidade (react-intersection-observer)
  const { ref: inViewRef, inView } = useInView({
    threshold: 0,
  });

  // 4. Combinação e Agrupamento de Dados
  // Combina todos os dados das páginas em uma única lista
  const allInputs: InputsListItem[] = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  // 5. Lógica de Scroll Infinito
  // Dispara o fetchNextPage quando o elemento de referência está visível
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 6. Manipulador de Pesquisa
  const handleSearchChange = useCallback((term: string) => {
    // Atualiza o termo que será usado no useInfiniteCustomersQuery
    setSearchTerm(term);
  }, []);

  // 7. Estados Derivados para UI
  const isLoadingInitial =
    isFetching && allInputs.length === 0 && !searchTerm;
  const isSearching = isFetching && !!searchTerm;
  const hasResults = allInputs.length > 0;




  // 8. Retorno do Hook
  return {
    // Dados e Referência
    allInputs,
    inViewRef,

    // Handlers
    handleSearchChange,
    fetchNextPage,

    // Estados
    searchTerm,
    isLoadingInitial,
    isSearching,
    isError,
    hasNextPage,
    isFetchingNextPage,
    hasResults,
    isLoading, // Usado para a mensagem de "Nenhum Resultado"
  };
}
