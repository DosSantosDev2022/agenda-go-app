// actions/services/delete-service.ts
"use server";

import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

/**
 * @description Exclui um serviço e verifica a propriedade do usuário logado.
 * @param serviceId O ID do serviço a ser excluído.
 * @returns Objeto com status de sucesso/erro e mensagem.
 */
export async function deleteServiceAction(
  serviceId: string,
): Promise<{ success: boolean; message: string }> {
  // 1. Autenticação e Autorização
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "Não autorizado." };
  }
  const userId = session.user.id;

  try {
    // 2. Verifica a propriedade do serviço antes de deletar
    const service = await db.service.findUnique({
      where: { id: serviceId },
      select: { business: { select: { ownerId: true } } },
    });

    if (!service) {
      return { success: false, message: "Serviço não encontrado." };
    }

    // Garante que o usuário logado é o dono do negócio
    if (service.business?.ownerId !== userId) {
      return {
        success: false,
        message: "Você não tem permissão para excluir este serviço.",
      };
    }

    // 3. Deleção
    await db.service.delete({
      where: { id: serviceId },
    });

    // 4. Invalidação de Cache
    revalidateTag("services-list");

    return { success: true, message: `Serviço excluído com sucesso!` };
  } catch (error) {
    console.error("Erro ao deletar serviço:", error);
    return {
      success: false,
      message: "Falha interna ao excluir o serviço.",
    };
  }
}
