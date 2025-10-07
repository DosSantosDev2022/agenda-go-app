// actions/customer/get-customers-list.ts
"use server";

import db from "@/lib/prisma";
import { CustomerListItem, CustomersPageData } from "@/types/customers";
import { getAuthData } from "@/utils/get-auth-data";
import { Prisma } from "@prisma/client"; // 💡 Importar Prisma para tipagem
import { redirect } from "next/navigation";

const PAGE_SIZE = 50; // Defina o limite de itens por página

// Função utilitária para verificar o formato
/**
 * @description Verifica se uma string se parece com um endereço de e-mail.
 * @param {string} term - O termo a ser verificado.
 * @returns {boolean} Se o termo é um e-mail.
 */
const isEmail = (term: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(term);

/**
 * @description Busca clientes de forma paginada usando cursor para scroll infinito, com opção de filtro.
 * @param {string} [cursor] - O ID do último item da página anterior.
 * @param {string} [searchTerm] - Termo de busca para filtrar por nome, email ou telefone.
 * @returns {Promise<CustomersPageData>} Os dados da página de clientes e o próximo cursor.
 */
export async function getCustomersList({
  cursor,
  searchTerm,
}: {
  cursor?: string;
  searchTerm?: string;
}): Promise<CustomersPageData> {
  // 1. AUTENTICAÇÃO E AUTORIZAÇÃO (USANDO O UTILITÁRIO)
  const authData = await getAuthData();

  if (!authData) {
    // Se não estiver autenticado ou sem business, redireciona
    // Isso garante que a ação só é executada por usuários logados e com negócio
    return redirect("/auth/login");
  }

  // Dados extraídos do utilitário
  const { businessId } = authData;

  try {
    // 1. Constrói o objeto de filtro WHERE
    // Inicialmente, o filtro é vazio.
    let where: Prisma.CustomerWhereInput = {
      businessId: businessId,
    };
    const normalizedSearchTerm = searchTerm?.trim() || "";

    if (normalizedSearchTerm) {
      if (isEmail(normalizedSearchTerm)) {
        // Se for um e-mail, buscamos por e-mail, exigindo que a string seja IGUAL ou comece com o termo para ser mais preciso
        where = {
          email: {
            contains: normalizedSearchTerm,
          },
        };
      } else {
        // Se não for um e-mail específico (ou se for uma busca mais ampla), buscamos nos 3 campos
        where = {
          OR: [
            // Busca por nome
            { name: { startsWith: normalizedSearchTerm } },
            // Busca por e-mail (como parte do e-mail)
            { email: { startsWith: normalizedSearchTerm } },
          ],
        };
      }
    }

    // 2. Busca os clientes
    const customers = await db.customer.findMany({
      take: PAGE_SIZE + 1,

      orderBy: {
        createdAt: "desc",
      },

      // APLICA O FILTRO CONSTRUÍDO
      where: where,

      // Paginação Baseada em Cursor
      ...(cursor && {
        skip: 1, // Pula o item do cursor
        cursor: {
          id: cursor,
        },
      }),

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: {
          select: { bookings: true },
        },
      },
    });

    // 3. Determina o próximo cursor e a lista real de clientes
    const hasNextPage = customers.length > PAGE_SIZE;
    const items = customers.slice(0, PAGE_SIZE);

    // O próximo cursor é o ID do último item da lista
    const nextCursor = hasNextPage ? items[PAGE_SIZE - 1].id : null;

    // 4. Mapeia para o tipo CustomerListItem
    const customerListItems: CustomerListItem[] = items.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      createdAt: customer.createdAt,
      totalAppointments: customer._count.bookings,
    }));

    return {
      items: customerListItems,
      nextCursor: nextCursor,
    };
  } catch (error) {
    console.error("Erro ao buscar lista de clientes:", error);
    return {
      items: [],
      nextCursor: null,
    };
  }
}
