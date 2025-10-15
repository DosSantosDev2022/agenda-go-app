// components/customers/customer-columns.tsx
"use client";

import { Button } from "@/components/ui";
import { CustomerListItem } from "@/types/customers";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Gift } from "lucide-react";

// Adicione o tipo de prop para a função de ação
export interface CustomerColumnProps {
  onNotifyClick: (customer: CustomerListItem) => void;
}

/**
 * @description Definição das colunas da tabela de clientes.
 */
const customerColumns = (props: CustomerColumnProps): ColumnDef<CustomerListItem>[] => [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => {
      // 💡 Opcional: Adicionar link para a página de detalhes do cliente
      return <div className="font-medium">{row.original.name}</div>;
    },
  },
  {
    accessorKey: "email",
    header: "E-mail",
    cell: ({ row }) => <div>{row.original.email ?? "N/A"}</div>,
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    cell: ({ row }) => <div>{row.original.phone ?? "N/A"}</div>,
  },
  {
    accessorKey: "totalAppointments",
    header: "Agendamentos",
    cell: ({ row }) => (
      <div className="text-center">{row.original.totalAppointments}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Membro Desde",
    cell: ({ row }) => (
      <div>{format(new Date(row.original.createdAt), "dd/MM/yyyy")}</div>
    ),
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const customer: CustomerListItem = row.original;
      return (
        <Button
          variant="secondary"
          // feature desabilitada por enquanto, deverá ser implementado quando houver clientes para 
          // custear as dispesas de uso de Apis como a da meta e resend
          disabled
          size="sm"
          onClick={() => props.onNotifyClick(customer)}
          aria-label={`Notificar ou recompensar cliente ${customer.name}`}
        >
          <Gift className="h-4 w-4 mr-2" />
          Recompensa
        </Button>
      );
    },
  },

];

export { customerColumns };

