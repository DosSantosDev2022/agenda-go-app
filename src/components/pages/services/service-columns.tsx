// components/services/service-columns.tsx

import { ServiceListItem } from "@/actions/services/get-services";
import { formatPrice } from "@/utils/format-price"; // Assumindo uma função utilitária para formatação
import { ColumnDef } from "@tanstack/react-table";
import { ServiceActions } from "./service-actions";

export const serviceColumns: ColumnDef<ServiceListItem>[] = [
  {
    accessorKey: "name",
    header: "Serviço",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "durationInMinutes",
    header: "Duração",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.durationInMinutes} min</span>
    ),
  },
  {
    accessorKey: "price",
    header: "Preço",
    cell: ({ row }) => (
      <span className="font-semibold">{formatPrice(row.original.price / 100)}</span> // Assumindo preço em centavos
    ),
  },
  // 💡 Coluna de Ações (Detalhes, Edição, Deleção)
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => <ServiceActions service={row.original} />,
    size: 50,
  },
];