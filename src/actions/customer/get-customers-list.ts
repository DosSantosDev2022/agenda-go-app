// actions/customer/get-customers-list.ts
"use server";

import db from "@/lib/prisma";
import { CustomerListItem, CustomersPageData } from "@/types/customers";

const PAGE_SIZE = 50; // Defina o limite de itens por página

/**
 * @description Busca clientes de forma paginada usando cursor para scroll infinito.
 * O cursor é o ID do último cliente da página anterior.
 * * @param {string} [cursor] - O ID do último item da página anterior.
 * @returns {Promise<CustomersPageData>} Os dados da página de clientes e o próximo cursor.
 */
export async function getCustomersList({
  cursor,
}: {
  cursor?: string;
}): Promise<CustomersPageData> {
  try {
    // 1. Busca os clientes
    const customers = await db.customer.findMany({
      // Busca (PAGE_SIZE + 1) para determinar se há um próximo cursor
      take: PAGE_SIZE + 1,

      // Ordenação: Clientes mais novos primeiro
      orderBy: {
        createdAt: "desc",
      },

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

    // 2. Determina o próximo cursor e a lista real de clientes
    const hasNextPage = customers.length > PAGE_SIZE;
    // Pega apenas os primeiros 20 clientes
    const items = customers.slice(0, PAGE_SIZE);

    // O próximo cursor é o ID do último item da lista
    const nextCursor = hasNextPage ? items[PAGE_SIZE - 1].id : null;

    // 3. Mapeia para o tipo CustomerListItem esperado pelo cliente (sem o _count)
    const customerListItems: CustomerListItem[] = items.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      createdAt: customer.createdAt,
      totalAppointments: customer._count.bookings, // Extrai a contagem
    }));

    return {
      items: customerListItems,
      nextCursor: nextCursor,
    };
  } catch (error) {
    console.error("Erro ao buscar lista de clientes:", error);
    // Em caso de erro, retorna uma lista vazia e sem próximo cursor
    return {
      items: [],
      nextCursor: null,
    };
  }
}
