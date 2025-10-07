// app/(dashboard)/services/page.tsx

import { AddServiceModal, ServiceList } from "@/components/pages/services";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * @description Página principal para gerenciar os serviços do negócio.
 * Exibe a lista de serviços e permite a criação de novos.
 */
export default function ServicesPage() {
  return (
    <div className="flex flex-col space-y-6 p-4 md:p-8">

      {/* HEADER DA PÁGINA */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerenciamento de Serviços
        </h1>
        {/* BOTÃO DE AÇÃO: Abre o modal de criação */}
        <AddServiceModal />
      </div>

      {/* CONTEÚDO PRINCIPAL: Lista de Serviços */}
      <Card>
        <CardHeader>
          <CardTitle>Serviços Cadastrados</CardTitle>
          <CardDescription>
            Visualize, edite ou remova seus serviços de agendamento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* O componente ServiceList é responsável por buscar os dados no lado do cliente */}
          <ServiceList />
        </CardContent>
      </Card>
    </div>
  );
}