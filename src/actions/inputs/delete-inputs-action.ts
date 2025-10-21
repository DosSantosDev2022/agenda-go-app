// actions/inputs/delete-input-action.ts

"use server";

import db from "@/lib/prisma";
import { getAuthData } from "@/utils/get-auth-data";
import { revalidatePath } from "next/cache";

/**
 * @description Argumentos necessários para deletar um insumo.
 */
interface DeleteInputArgs {
  id: string; // O ID do produto a ser deletado.
}

/**
 * @description Deleta um insumo (produto) no banco de dados.
 * A deleção é restrita ao businessId do usuário logado para segurança.
 *
 * @param {DeleteInputArgs} args - Objeto contendo o ID do insumo a ser deletado.
 * @returns {Promise<{ success: boolean; message: string }>} O resultado da operação.
 */
export async function deleteInputAction({ id }: DeleteInputArgs): Promise<{ success: boolean; message: string }> {
  // 1. OBTENÇÃO DOS DADOS DE AUTENTICAÇÃO E DO NEGÓCIO
  const authData = await getAuthData();

  if (!authData) {
    return {
      success: false,
      message: "Não autorizado: Sessão inválida ou negócio não configurado.",
    };
  }

  const { businessId } = authData;

  // 2. VALIDAÇÃO BÁSICA DO ID
  if (!id) {
    return { success: false, message: "ID do insumo não fornecido." };
  }

  try {
    // 3. DELEÇÃO DO INSUMO NO BANCO DE DADOS
    const deletedProduct = await db.product.delete({
      where: {
        id: id,
        // **IMPORTANTE**: Garante que o usuário só pode deletar
        // produtos que pertencem ao seu próprio business.
        businessId: businessId,
      },
    });

    // 4. REVALIDAÇÃO DE CACHE
    revalidatePath("/inputs");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Insumo "${deletedProduct.name}" deletado com sucesso.`,
    };
  } catch (error) {
    // Tratamento de erro específico para caso o item não exista (P2025)
    // Se o ID não for encontrado ou não pertencer ao business, o Prisma lança um erro.
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return {
        success: false,
        message: "Insumo não encontrado ou você não tem permissão para deletá-lo.",
      };
    }

    console.error("Erro no servidor ao deletar insumo:", error);
    return {
      success: false,
      message: "Falha interna no servidor ao deletar o insumo.",
    };
  }
}