// components/customers/customer-columns.tsx
"use client";

import { CustomerListItem } from "@/types/customers";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

/**
 * @description Definição das colunas da tabela de clientes.
 */
export const customerColumns: ColumnDef<CustomerListItem>[] = [
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
];