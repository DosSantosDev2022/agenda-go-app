// hooks/customer/use-infinite-customers-query.ts
import { getInputsList } from "@/actions";
import { InputsPageData } from "@/types/inputs";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

/**
 * @description Hook customizado para buscar clientes com scroll infinito.
 * @returns O resultado do useInfiniteQuery.
 */
export function useInfiniteInputsQuery(debouncedSearchTerm: string = "") {
  // O tipo de pageParam é string | undefined (nosso cursor)
  type InputCursor = string | undefined;

  return useInfiniteQuery<
    InputsPageData, // TQueryFnData: O que a queryFn retorna (uma página)
    Error, // TError: Tipo de erro
    InfiniteData<InputsPageData>, // TData: Estrutura final que o hook retorna (com .pages)
    ["inputs", "list", string], // TQueryKey: O tipo da Query Key
    InputCursor // TPageParam: O tipo do cursor (pageParam)
  >({
    queryKey: ["inputs", "list", debouncedSearchTerm],

    // Garantimos que o cursor é do tipo esperado antes de passar para a Server Action
    queryFn: ({ pageParam }) =>
      getInputsList({ cursor: pageParam, searchTerm: debouncedSearchTerm }),

    getNextPageParam: (lastPage) => lastPage.nextCursor,

    initialPageParam: undefined,
  });
}
