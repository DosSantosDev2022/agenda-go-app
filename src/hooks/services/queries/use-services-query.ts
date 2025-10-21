// hooks/queries/use-services-query.ts
import {
  getServicesAction,
  ServiceListItem,
} from "@/actions/services";
import { useQuery } from "@tanstack/react-query";

/**
 * @description Hook para buscar todos os serviços do negócio logado.
 */
export function useServicesQuery() {
  return useQuery<ServiceListItem[], Error>({
    queryKey: ["services"],
    queryFn: getServicesAction,
    // Configuração do cache (opcional, mas boa prática)
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });
}
