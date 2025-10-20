// actions/inputs/create-input-action.ts

"use server";

import db from "@/lib/prisma";
import { createProductSchema, InputFormValues } from "@/types/schema/zod-input-schema";
import { getAuthData } from "@/utils/get-auth-data";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

/**
 * @description Cria um novo insumo (produto) associado ao negócio do usuário logado.
 * Esta Server Action valida os dados do formulário e os insere no banco de dados.
 *
 * @param {InputFormValues} values - Dados do formulário de criação de insumo.
 * @returns {Promise<{ success: boolean; message: string }>} O resultado da operação.
 */
export async function createInputAction(
  values: InputFormValues,
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
  // Usamos o schema 'createProductSchema' para validar os dados recebidos.
  const validationResult = createProductSchema.safeParse(values);

  if (!validationResult.success) {
    // Se a validação falhar, retornamos uma mensagem de erro.
    if (validationResult.error instanceof ZodError) {
      return {
        success: false,
        message: "Dados inválidos. Verifique todos os campos.",
      };
    }
    return { success: false, message: "Erro de validação desconhecido." };
  }

  // 3. EXTRAÇÃO DOS DADOS VALIDADOS
  // Desestruturamos os campos do objeto 'data' para usá-los na criação.
  const { name, quantity } = validationResult.data;

  try {
    // 4. CRIAÇÃO DO INSUMO NO BANCO DE DADOS
    await db.product.create({
      data: {
        name: name,
        quantity: Number(quantity), // Garantimos que a quantidade seja um número
        // Relacionamento com o negócio do usuário
        businessId: businessId,
      },
    });

    // 5. REVALIDAÇÃO DE CACHE (opcional, mas recomendado)
    // Invalida o cache das páginas que exibem a lista de insumos ou o dashboard.
    revalidatePath("/inputs"); // Exemplo de rota de inventário
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Insumo "${name}" criado com sucesso!`,
    };
  } catch (error) {
    console.error("Erro no servidor ao criar insumo:", error);
    return {
      success: false,
      message: "Falha interna no servidor ao criar o insumo.",
    };
  }
}