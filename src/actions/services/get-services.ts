// actions/services/get-services.ts
"use server";

import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth";

/**
 * @description Server Action para buscar todos os serviços de um negócio.
 * @returns Uma lista de serviços.
 */
export async function getServicesAction() {
  // 1. Obter o userId
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    throw new Error("Não autorizado: Usuário não logado.");
  }
  const userId = session.user.id;

  // 2. Obter o businessId
  const business = await db.business.findUnique({
    where: { ownerId: userId },
    select: { id: true },
  });

  if (!business) {
    throw new Error("Negócio não encontrado para o usuário logado.");
  }

  const businessId = business.id;

  // 3. Buscar os serviços
  const services = await db.service.findMany({
    where: { businessId },
    // Garante que a duração e preço venham como strings (se necessário) ou números
    select: {
      id: true,
      name: true,
      durationInMinutes: true, // Corrigido
      price: true,
      // Adicione outros campos necessários aqui
    },
    orderBy: { name: "asc" },
  });

  return services;
}

// 💡 Definição de Tipagem (Interface) para os serviços
export interface ServiceListItem {
  id: string;
  name: string;
  durationInMinutes: number;
  price: number;
}
