// components/customers/customer-columns.tsx

"use client";

import { InputsListItem } from "@/types/inputs";
import { ColumnDef } from "@tanstack/react-table";
import { InputsButtonActions } from "./inputs-buttons-actions";

// Removido a interface InputsColumnProps que não estava sendo usada

/**
 * @description Definição das colunas da tabela de insumos (inputs).
 * O tipo ColumnDef é inferido a partir do array.
 */
const InputsColumns: ColumnDef<InputsListItem>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.name}</div>;
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantidade",
    cell: ({ row }) => <div>{row.original.quantity ?? "N/A"}</div>,
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      // O ID está disponível via row.original.id
      return (
        <InputsButtonActions inputItem={row.original} />
      );
    },
  },
];

export { InputsColumns };

