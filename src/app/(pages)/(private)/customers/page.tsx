// app/(dashboard)/customers/page.tsx
import { CustomerTable } from "@/components/pages/customers/customer-table";
import { Separator } from "@/components/ui/separator";

/**
 * @description Página principal para visualização e gerenciamento de clientes.
 */
export default function CustomersPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* HEADER DA PÁGINA */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie a lista completa de clientes cadastrados.
        </p>
      </div>

      <Separator />

      {/* CONTEÚDO PRINCIPAL: TABELA DE CLIENTES COM SCROLL INFINITO */}
      <div className="w-full">
        <CustomerTable />
      </div>
    </div>
  );
}