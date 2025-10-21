// hooks/customer/use-search-customers-query.ts
import { CustomerSearchResult, searchCustomerByNameAction } from "@/actions/customer";
import { useQuery } from "@tanstack/react-query";

/**
 * @description Hook customizado para buscar clientes pelo nome usando React Query.
 * @param {string} searchTerm O termo de pesquisa digitado pelo usuário.
 * @returns O resultado da query, incluindo dados e status de carregamento.
 */
export function useSearchCustomersQuery(searchTerm: string) {
  // Define se a query deve ser habilitada
  // Só executa a query se o termo de pesquisa tiver 3 ou mais caracteres e não estiver vazio
  const isSearchEnabled = searchTerm.trim().length >= 3;

  return useQuery<CustomerSearchResult[]>({
    queryKey: ["customers", "search", searchTerm],
    queryFn: () => searchCustomerByNameAction(searchTerm),
    enabled: isSearchEnabled,
    staleTime: 1000 * 60 * 5, // 5 minutos (clientes não mudam frequentemente)
  });
}
