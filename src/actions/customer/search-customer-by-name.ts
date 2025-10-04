// actions/customers/search-customer-by-name.ts
"use server";

import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth";

// Define a interface para o cliente que será retornado
export interface CustomerSearchResult {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
}

/**
 * @description Obtém o BusinessId associado ao usuário logado através do NextAuth.
 * @returns O businessId do negócio do usuário logado.
 * @throws {Error} Se o usuário não estiver logado ou não tiver um negócio associado.
 */
async function getBusinessIdFromSession(): Promise<string> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    throw new Error("Não autorizado: Usuário não está logado.");
  }

  const userId = session.user.id;

  const business = await db.business.findUnique({
    where: { ownerId: userId },
    select: { id: true },
  });

  if (!business) {
    // Isso deve ser tratado no frontend como uma mensagem amigável (e não deve ocorrer se a rota for protegida)
    throw new Error("Usuário logado não possui um negócio registrado.");
  }

  return business.id;
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

  try {
    // B. Obtém o BusinessId para garantir que apenas clientes do seu negócio sejam buscados
    const businessId = await getBusinessIdFromSession();

    // C. Busca clientes no banco de dados
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
      `[ACTION] Clientes encontrados para '${normalizedSearchTerm}':`,
      customers.length,
    ); // 👈 ADICIONE ESTE LOG

    return customers;
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    // Em caso de erro (ex: não autorizado), retorna um array vazio
    return [];
  }
}
