// lib/auth/get-auth-data.ts

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";

/**
 * @interface AuthData
 * @description Interface para os dados de autenticação e negócio.
 * Retorna null se o usuário não estiver autenticado ou não tiver um negócio ativo.
 */
export interface AuthData {
  userId: string;
  businessId: string;
}

/**
 * @description Obtém a sessão do usuário e o ID do negócio associado.
 * Esta função é utilizada em Server Components ou Server Actions para
 * garantir que o usuário está logado e tem um negócio configurado.
 *
 * @returns {Promise<AuthData | null>} Um objeto contendo userId e businessId, ou null se não for autorizado.
 */
export async function getAuthData(): Promise<AuthData | null> {
  // 1. Obter a sessão
  const session = await getServerSession(authOptions);

  // Verifica se a sessão e o ID do usuário existem
  const userId = session?.user?.id;
  if (!userId) {
    // Não autenticado
    return null;
  }

  // 2. Encontrar o BusinessId
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { business: { select: { id: true } } },
  });

  const businessId = user?.business?.id;

  if (!businessId) {
    // Autenticado, mas sem negócio configurado (pode ser redirecionado para onboarding)
    return null; 
  }

  // 3. Retornar os dados
  return {
    userId,
    businessId,
  };
}