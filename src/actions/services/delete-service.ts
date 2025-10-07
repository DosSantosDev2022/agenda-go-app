// actions/services/delete-service.ts
"use server";

import db from "@/lib/prisma";
import { getAuthData } from "@/utils/get-auth-data";
import { revalidatePath } from "next/cache"; // Mudado de revalidateTag para revalidatePath, que é mais comum em Server Actions.

/**
 * @description Exclui um serviço, garantindo que ele pertence ao negócio do usuário logado.
 * @param serviceId O ID do serviço a ser excluído.
 * @returns Objeto com status de sucesso/erro e mensagem.
 */
export async function deleteServiceAction(
  serviceId: string,
): Promise<{ success: boolean; message: string }> {
  // 1. AUTENTICAÇÃO E AUTORIZAÇÃO (Obter businessId)
  const authData = await getAuthData();

  if (!authData) {
    return { success: false, message: "Não autorizado." };
  }

  const { businessId } = authData;

  try {
    // 2. Deleção Segura: Tenta deletar apenas se o serviceId e o businessId
    // corresponderem. Isso substitui a busca e verificação manual de propriedade.
    const result = await db.service.deleteMany({
      where: {
        id: serviceId,
        businessId: businessId,
      },
    });

    if (result.count === 0) {
      // Se não deletou nada, pode ser que o ID não exista OU que o ID exista,
      // mas não pertence ao usuário logado (violando a segurança).
      return {
        success: false,
        message:
          "Serviço não encontrado ou você não tem permissão para excluí-lo.",
      };
    }

    // 3. Invalidação de Cache
    // Usando revalidatePath para invalidar a lista de serviços.
    revalidatePath("/services");
    revalidatePath("/dashboard");

    return { success: true, message: `Serviço excluído com sucesso!` };
  } catch (error) {
    console.error("Erro ao deletar serviço:", error);
    // Erros do Prisma (como falha na chave estrangeira, embora incomum aqui)
    return {
      success: false,
      message:
        "Falha interna ao excluir o serviço. Verifique se não há agendamentos associados.",
    };
  }
}
