// components/customers/customer-table.tsx
"use client";

import { Button, DataTable } from "@/components/ui/"; // Reutilizando seu DataTable
import { useInputsTableController } from "@/hooks/inputs/controllers/use-inputs-table-controller";
import { Loader2 } from "lucide-react";
import { InputsColumns } from "./inputs-columns";

/**
 * @description Componente que exibe a tabela de clientes com scroll infinito.
 */
const InputsTable = () => {
  const {
    allInputs,
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
  } = useInputsTableController();

  if (isLoadingInitial) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando insumos...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8 text-destructive">
        Erro ao carregar os insumos. Tente novamente mais tarde.
      </div>
    );
  }

  // Passamos a função de callback para o factory de colunas
  const columns = InputsColumns

  return (
    <div className="space-y-4">
      {/* 3. CAMPO DE BUSCA */}
      {/*  <CustomerSearchInput
        onSearchChange={handleSearchChange}
        isSearching={isSearching}
      /> */}
      {/* Tabela de Dados */}
      <div className="max-h-[60vh] overflow-y-auto scrollbar-custom border rounded-lg">
        <DataTable columns={columns} data={allInputs} />
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
              Carregar Mais insumos
            </Button>
          )}
        </div>
      )}

      {/* Mensagens de Fim da Lista / Sem Resultados */}
      {!hasNextPage && hasResults && (
        <p className="text-center text-sm text-muted-foreground pt-4">
          Fim da lista de insumos.
        </p>
      )}

      {!isLoading && allInputs.length === 0 && (
        <p className="text-center text-lg text-muted-foreground pt-10">
          {searchTerm
            ? `Nenhum insumo encontrado para "${searchTerm}".`
            : "Nenhum insumo cadastrado."}
        </p>
      )}
    </div>
  );
}

export { InputsTable };

