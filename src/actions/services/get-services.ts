// actions/services/get-services.ts
"use server";

import db from "@/lib/prisma";
import { getAuthData } from "@/utils/get-auth-data";

/**
 * @description Server Action para buscar todos os serviços de um negócio.
 * Garante que a busca é restrita ao businessId do usuário logado.
 * * @returns {Promise<ServiceListItem[]>} Uma lista de serviços do negócio, ou um array vazio se não for autorizado.
 */
export async function getServicesAction(): Promise<ServiceListItem[]> {
  // 1. AUTENTICAÇÃO E AUTORIZAÇÃO (Obter businessId)
  const authData = await getAuthData();

  if (!authData) {
    // Se não estiver autenticado ou sem businessId, retorna um array vazio.
    return [];
  }

  const { businessId } = authData;

  try {
    // 2. Buscar os serviços
    const services = await db.service.findMany({
      where: { businessId },
      select: {
        id: true,
        name: true,
        durationInMinutes: true,
        price: true,
      },
      orderBy: { name: "asc" },
    });

    // O retorno do Prisma já é compatível com a interface, mas faremos o cast
    // ou o mapeamento para garantir que o tipo `ServiceListItem` é respeitado.
    // Neste caso, o Prisma `select` deve garantir a estrutura correta.
    return services as ServiceListItem[];
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    // Em caso de erro interno, retorna um array vazio.
    return [];
  }
}

//  Definição de Tipagem (Interface) para os serviços
export interface ServiceListItem {
  id: string;
  name: string;
  durationInMinutes: number;
  price: number;
}
