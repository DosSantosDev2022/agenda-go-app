// components/customers/customer-columns.tsx
"use client";

import { Button } from "@/components/ui";
import { InputsListItem } from "@/types/inputs";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";

// Adicione o tipo de prop para a função de ação
export interface InputsColumnProps {
  onNotifyClick: (customer: InputsListItem) => void;
}

/**
 * @description Definição das colunas da tabela de clientes.
 */
const InputsColumns = (): ColumnDef<InputsListItem>[] => [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => {
      // 💡 Opcional: Adicionar link para a página de detalhes do cliente
      return <div className="font-medium">{row.original.name}</div>;
    },
  },
  /* {
    accessorKey: "descrição",
    header: "Descrição",
    cell: ({ row }) => <div>{row.original. ?? "N/A"}</div>,
  }, */
  {
    accessorKey: "Quantidade",
    header: "Quantidade",
    cell: ({ row }) => <div>{row.original.quantity ?? "N/A"}</div>,
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="icon"
        >
          <Trash />
        </Button>
      );
    },
  },

];

export { InputsColumns };

