// components/customers/customer-table.tsx
"use client";

import { DataTable } from "@/components/ui/"; // Reutilizando seu DataTable
import { Button } from "@/components/ui/button";
import { useInfiniteCustomersQuery } from "@/hooks/customer/use-infinite-customers-query";
import { CustomerListItem } from "@/types/customers";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { customerColumns } from "./customer-columns";

/**
 * @description Componente que exibe a tabela de clientes com scroll infinito.
 */
export function CustomerTable() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useInfiniteCustomersQuery();

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

  if (isLoading) {
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
    <div className="space-y-4 max-h-[60vh] overflow-y-auto scrollbar-custom ">
      <DataTable columns={customerColumns} data={allCustomers} />

      {/* FOOTER DE SCROLL INFINITO */}
      {hasNextPage && (
        <div
          className="flex flex-col items-center p-4 space-y-2"
          ref={inViewRef} // Anexa a ref do hook InView
        >
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            // Botão de Carregar Mais ( fallback caso o scroll não funcione 100% )
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

      {!hasNextPage && allCustomers.length > 0 && (
        <p className="text-center text-sm text-muted-foreground pt-4">
          Fim da lista de clientes.
        </p>
      )}

      {!hasNextPage && allCustomers.length === 0 && (
        <p className="text-center text-lg text-muted-foreground pt-10">
          Nenhum cliente cadastrado.
        </p>
      )}

    </div>
  );
}