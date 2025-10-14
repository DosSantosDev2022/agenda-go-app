// components/customers/customer-table.tsx
"use client";

import { Button, DataTable } from "@/components/ui/"; // Reutilizando seu DataTable
import { useCustomerTableController } from "@/hooks/customer";
import { Loader2 } from "lucide-react";
import { customerColumns } from "./customer-columns";
import { CustomerSearchInput } from "./customer-search-input";

/**
 * @description Componente que exibe a tabela de clientes com scroll infinito.
 */
const CustomerTable = () => {
  const {
    allCustomers,
    inViewRef,
    handleSearchChange,
    fetchNextPage,
    searchTerm,
    isLoadingInitial,
    isSearching,
    isError,
    hasNextPage,
    isFetchingNextPage,
    hasResults,
    isLoading
  } = useCustomerTableController();

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
      {!hasNextPage && hasResults && (
        <p className="text-center text-sm text-muted-foreground pt-4">
          Fim da lista de clientes.
        </p>
      )}

      {!isLoading && allCustomers.length === 0 && (
        <p className="text-center text-lg text-muted-foreground pt-10">
          {searchTerm
            ? `Nenhum cliente encontrado para "${searchTerm}".`
            : "Nenhum cliente cadastrado."}
        </p>
      )}

    </div>
  );
}

export { CustomerTable };

