// actions/inputs/update-input-action.ts

"use server";

import db from "@/lib/prisma";
import { UpdateInputFormValues, updateInputSchema } from "@/types/schema/zod-input-schema"; // Usamos o novo tipo
import { getAuthData } from "@/utils/get-auth-data";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

/**
 * @description Atualiza um insumo (produto) existente, garantindo que pertença ao negócio do usuário logado.
 *
 * @param {UpdateInputFormValues} values - Dados do formulário de edição, incluindo o ID.
 * @returns {Promise<{ success: boolean; message: string }>} O resultado da operação.
 */
export async function updateInputAction(
  values: UpdateInputFormValues,
): Promise<{ success: boolean; message: string }> {
  // 1. OBTENÇÃO DOS DADOS DE AUTENTICAÇÃO E DO NEGÓCIO
  const authData = await getAuthData();

  if (!authData) {
    return {
      success: false,
      message: "Não autorizado: Sessão inválida ou negócio não configurado.",
    };
  }

  const { businessId } = authData;

  // 2. VALIDAÇÃO DOS DADOS COM ZOD
  const validationResult = updateInputSchema.safeParse(values);

  if (!validationResult.success) {
    if (validationResult.error instanceof ZodError) {
      return {
        success: false,
        message: "Dados inválidos. Verifique todos os campos.",
      };
    }
    return { success: false, message: "Erro de validação desconhecido." };
  }

  // 3. EXTRAÇÃO DOS DADOS VALIDADOS
  const { id, name, quantity } = validationResult.data;

  try {
    // 4. ATUALIZAÇÃO DO INSUMO NO BANCO DE DADOS
    await db.product.update({
      where: {
        id: id,
        // Garante que o usuário só pode editar produtos do seu próprio business.
        businessId: businessId,
      },
      data: {
        name: name,
        quantity: quantity,
      },
    });

    // 5. REVALIDAÇÃO DE CACHE
    revalidatePath("/inputs");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Insumo "${name}" atualizado com sucesso!`,
    };
  } catch (error) {
    // Erro P2025 é comum quando o item não é encontrado no 'where'
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return {
        success: false,
        message: "Insumo não encontrado ou você não tem permissão para editá-lo.",
      };
    }

    console.error("Erro no servidor ao atualizar insumo:", error);
    return {
      success: false,
      message: "Falha interna no servidor ao atualizar o insumo.",
    };
  }
}