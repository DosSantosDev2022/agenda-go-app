// actions/customers/search-customer-by-name.ts
"use server";

import db from "@/lib/prisma";
import { getAuthData } from "@/utils/get-auth-data";

// Define a interface para o cliente que será retornado
export interface CustomerSearchResult {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
}

/**
 * @description Busca clientes pelo nome ou parte dele, associados ao negócio do usuário logado.
 * @param {string} searchTerm O termo de pesquisa (nome do cliente).
 * @returns {Promise<CustomerSearchResult[]>} Uma lista de clientes correspondentes.
 */
export async function searchCustomerByNameAction(
  searchTerm: string,
): Promise<CustomerSearchResult[]> {
  // A. Normaliza o termo de pesquisa
  const normalizedSearchTerm = searchTerm.trim();

  // Se o termo de pesquisa for muito curto ou vazio, não faz a busca
  if (normalizedSearchTerm.length < 3) {
    return [];
  }

  // 1. OBTENÇÃO DOS DADOS DE AUTORIZAÇÃO
  const authData = await getAuthData();

  if (!authData) {
    // Se não estiver autenticado ou não tiver businessId, retorna vazio.
    // O frontend deve tratar isso como um estado de não autorizado ou erro de sessão.
    return []; 
  }

  const { businessId } = authData;

  try {
    // 2. Busca clientes no banco de dados, protegida por businessId
    const customers = await db.customer.findMany({
      where: {
        businessId: businessId, 
        // Procura por nomes que contenham o termo de pesquisa (case-insensitive)
        name: {
          contains: normalizedSearchTerm,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
      take: 10, // Limita o número de resultados
    });

    console.log(
      `[ACTION] Clientes encontrados para '${normalizedSearchTerm}' (Business ID: ${businessId}):`,
      customers.length,
    );

    // O retorno já é compatível com CustomerSearchResult[]
    return customers; 
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    // Em caso de erro, retorna um array vazio
    return [];
  }
}