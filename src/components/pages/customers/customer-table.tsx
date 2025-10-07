// components/customers/customer-table.tsx
"use client";

import { DataTable } from "@/components/ui/"; // Reutilizando seu DataTable
import { Button } from "@/components/ui/button";
import { useInfiniteCustomersQuery } from "@/hooks/customer/use-infinite-customers-query";
import { CustomerListItem } from "@/types/customers";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { customerColumns } from "./customer-columns";
import { CustomerSearchInput } from "./customer-search-input";

/**
 * @description Componente que exibe a tabela de clientes com scroll infinito.
 */
export function CustomerTable() {

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isFetching
  } = useInfiniteCustomersQuery(debouncedSearchTerm);

  const handleSearchChange = useCallback((term: string) => {
    setDebouncedSearchTerm(term);
  }, []);

  // Hook para detectar se o botão "Carregar Mais" está visível
  const { ref: inViewRef, inView } = useInView({
    threshold: 0, // Aciona assim que entra na view
  });

  // Combina todos os dados das páginas em uma única lista
  const allCustomers: CustomerListItem[] = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  // 💡 Lógica: Se o botão de "Carregar Mais" estiver visível E houver mais páginas
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isLoadingInitial = isFetching && allCustomers.length === 0 && !debouncedSearchTerm;
  const isSearching = isFetching && !!debouncedSearchTerm;

  if (isLoadingInitial) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando clientes...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8 text-destructive">
        Erro ao carregar os clientes. Tente novamente mais tarde.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 3. CAMPO DE BUSCA */}
      <CustomerSearchInput
        onSearchChange={handleSearchChange}
        isSearching={isSearching}
      />
      {/* Tabela de Dados */}
      <div className="max-h-[60vh] overflow-y-auto scrollbar-custom border rounded-lg">
        <DataTable columns={customerColumns} data={allCustomers} />
      </div>

      {/* FOOTER DE SCROLL INFINITO (Mantido) */}
      {hasNextPage && (
        <div
          className="flex flex-col items-center p-4 space-y-2"
          ref={inViewRef}
        >
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              variant="outline"
            >
              Carregar Mais Clientes
            </Button>
          )}
        </div>
      )}

      {/* Mensagens de Fim da Lista / Sem Resultados */}
      {!hasNextPage && allCustomers.length > 0 && (
        <p className="text-center text-sm text-muted-foreground pt-4">
          Fim da lista de clientes.
        </p>
      )}

      {/* 💡 Mensagem de "Nenhum Resultado" */}
      {!isLoading && allCustomers.length === 0 && (
        <p className="text-center text-lg text-muted-foreground pt-10">
          {debouncedSearchTerm
            ? `Nenhum cliente encontrado para "${debouncedSearchTerm}".`
            : "Nenhum cliente cadastrado."}
        </p>
      )}

    </div>
  );
}