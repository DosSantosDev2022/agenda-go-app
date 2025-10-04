// hooks/customer/use-infinite-customers-query.ts
import { getCustomersList } from "@/actions/customer/get-customers-list";
import { CustomersPageData } from "@/types/customers";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

/**
 * @description Hook customizado para buscar clientes com scroll infinito.
 * @returns O resultado do useInfiniteQuery.
 */
export function useInfiniteCustomersQuery() {
  // O tipo de pageParam é string | undefined (nosso cursor)
  type CustomerCursor = string | undefined;

  return useInfiniteQuery<
    CustomersPageData, // TQueryFnData: O que a queryFn retorna (uma página)
    Error, // TError: Tipo de erro
    InfiniteData<CustomersPageData>, // TData: Estrutura final que o hook retorna (com .pages)
    ["customers", "list"], // TQueryKey: O tipo da Query Key
    CustomerCursor // TPageParam: O tipo do cursor (pageParam)
  >({
    queryKey: ["customers", "list"],

    // Garantimos que o cursor é do tipo esperado antes de passar para a Server Action
    queryFn: ({ pageParam }) => getCustomersList({ cursor: pageParam }),

    getNextPageParam: (lastPage) => lastPage.nextCursor,

    initialPageParam: undefined,
  });
}
