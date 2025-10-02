"use client";

/**
 * Provedor Global para o TanStack Query.
 *
 * Configura o QueryClient com opções padrão otimizadas para queries e mutations.
 * As opções visam um bom equilíbrio entre performance, frescor dos dados e
 * experiência do utilizador.
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

// Define as configurações padrão otimizadas
const OPTIMIZED_QUERY_OPTIONS = {
  queries: {
    // staleTime: 5 minutos.
    // Durante 5 minutos, o dado é considerado 'fresco' e não dispara um novo fetch
    // ao montar o componente ou ao usar useQuery.
    staleTime: 1000 * 60 * 5,

    // cacheTime: 10 minutos.
    // Quanto tempo um dado 'inativo' (sem observadores) permanece no cache antes de ser coletado.
    // Deve ser maior que o staleTime.
    cacheTime: 1000 * 60 * 10,

    // refetchOnWindowFocus: 'always' ou 'false'.
    // 'false' é uma boa opção para controle manual, mas 'true' é o default.
    // Manter como 'true' é uma boa prática para apps em tempo real. 
    // Vamos manter 'false' para seguir o seu objetivo de evitar re-buscas excessivas.
    refetchOnWindowFocus: false,

    // refetchOnMount: false. 
    // Não busca dados automaticamente ao montar o componente se já estiverem em cache,
    // a menos que estejam 'stale' (ultrapassem o staleTime).
    refetchOnMount: true, // Mantemos true, o default, para um bom DX (Developer Experience).

    // retry: 2 vezes.
    // Número de tentativas em caso de falha da query antes de erro.
    retry: 2,
  },

  mutations: {
    // Configuração básica para tratamento de erros em operações de escrita (POST, PUT, DELETE).
    // Aqui você pode adicionar um callback de erro global se quiser, como mostrar um toast.
    onError: (error: unknown) => {
      console.error("Erro na mutação global:", error);
      toast.error("Ocorreu um erro na operação.");
    },
  },
};

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // O useState garante que o cliente é criado APENAS uma vez.
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: OPTIMIZED_QUERY_OPTIONS })
  );

  return (
    // QueryClientProvider envolve a aplicação para disponibilizar o cache.
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}