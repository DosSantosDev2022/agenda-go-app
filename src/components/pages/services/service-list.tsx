// components/services/service-list.tsx
"use client";

import { serviceColumns } from "@/components/pages/services/service-columns";
import { DataTable } from "@/components/ui";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useServicesQuery } from "@/hooks/services/use-services-query";
import { AlertCircle } from "lucide-react";

/**
 * @description Componente para buscar e exibir a lista de serviços.
 */
const ServiceList = () => {
  // Usando React Query para data fetching no lado do cliente
  const { data: services, isLoading, error } = useServicesQuery();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar</AlertTitle>
        <AlertDescription>
          Ocorreu um erro ao buscar os serviços: {error.message}. Tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  // Se não houver serviços, exibe uma mensagem
  if (!services || services.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>Nenhum serviço cadastrado. Clique em "Novo Serviço" para começar.</p>
      </div>
    );
  }

  // Usando um componente de Tabela genérica para exibir os dados
  return (
    <DataTable
      columns={serviceColumns}
      data={services}
    />
  );
}

export { ServiceList };
