// hooks/agenda/use-business-hours-query.ts

import {
  BusinessHours,
  getBusinessHours,
} from "@/actions/business/get-business-hours";
import { useQuery } from "@tanstack/react-query";

const QUERY_KEY = ["business", "hours"];

/**
 * @interface BusinessHoursQuery
 * @description Estrutura de dados retornada pelo hook.
 * @property {BusinessHours | undefined} data - Dados brutos de horário de funcionamento e duração.
 * @property {boolean} isLoading - Indica se a query está em carregamento.
 * @property {boolean} isError - Indica se ocorreu um erro na query.
 */
interface BusinessHoursQuery {
  data: BusinessHours | undefined;
  isLoading: boolean;
  isError: boolean;
}

/**
 * @description Hook customizado para buscar os horários de funcionamento do negócio.
 * Os dados brutos são retornados para serem processados no controlador (filtragem e geração de slots).
 * @returns {BusinessHoursQuery} Um objeto contendo os dados brutos e o estado da query.
 */
export function useBusinessHoursQuery(): BusinessHoursQuery {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getBusinessHours,
    staleTime: 1000 * 60 * 60, // 1 hora
  });

  // Retorna os dados brutos
  return {
    data: data ?? undefined,
    isLoading,
    isError,
  };
}
