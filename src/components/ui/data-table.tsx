"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Componentes Shadcn UI
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * @description Interface para as propriedades do componente DataTable.
 * @template TData O tipo de dados da linha (ex: ServiceListItem).
 * @template TValue O tipo do valor da célula.
 */
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // Opcional: Adicione aqui propriedades para paginação, filtros, etc.
}

/**
 * @description Componente de tabela reutilizável usando TanStack Table e Shadcn UI.
 */
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Adicione modelos de estado de tabela (sorting, filtering, pagination) aqui
  });

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        {/* Cabeçalho da Tabela */}
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        {/* Corpo da Tabela */}
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                Nenhum resultado encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}