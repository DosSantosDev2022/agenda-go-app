import { InputsTable } from "@/components/pages/inputs";
import { AddInputs } from "@/components/pages/inputs/addInputs";

/**
 * @description Página principal para visualização e gerenciamento de insumos.
 */
export default function InputsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* HEADER DA PÁGINA */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Insumos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os insumos do seu negócio.
          </p>
        </div>

        <AddInputs />
      </div>

      {/*  <Separator /> */}

      <div className="w-full">
        <InputsTable />
      </div>
    </div>
  );
}