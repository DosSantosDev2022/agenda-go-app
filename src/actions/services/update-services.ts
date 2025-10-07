// actions/services/update-service.ts
"use server";

import db from "@/lib/prisma";
import {
  ServiceFormValues,
  ServiceSchema,
} from "@/types/schema/zod-service-schema";
import { getAuthData } from "@/utils/get-auth-data";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

/**
 * @description Atualiza um serviço existente, verificando se ele pertence ao negócio do usuário logado.
 *
 * @param serviceId O ID do serviço a ser atualizado.
 * @param values Os dados validados do formulário de serviço.
 * @returns Objeto com status de sucesso/erro e mensagem.
 */
export async function updateServiceAction(
  serviceId: string,
  values: ServiceFormValues,
): Promise<{ success: boolean; message: string }> {
  // 1. Validação do Zod
  const validationResult = ServiceSchema.safeParse(values);

  if (!validationResult.success) {
    if (validationResult.error instanceof ZodError) {
      return {
        success: false,
        message: "Erro de validação: Verifique os campos.",
      };
    }
    return { success: false, message: "Erro de validação desconhecido." };
  }

  const { name, durationInMinutes, price } = validationResult.data;

  // 2. AUTENTICAÇÃO E AUTORIZAÇÃO (Obter businessId)
  const authData = await getAuthData();

  if (!authData) {
    return { success: false, message: "Não autorizado." };
  }

  const { businessId } = authData;

  try {
    // 3. Persistência (Atualização Segura)
    // Incluímos o businessId na cláusula WHERE para garantir que
    // o usuário só pode atualizar serviços de seu próprio negócio.
    const updatedService = await db.service.updateMany({
      where: {
        id: serviceId,
        businessId: businessId,
      },
      data: {
        name,
        durationInMinutes,
        price: Math.round(price * 100), // Armazena o preço em centavos
      },
    });

    if (updatedService.count === 0) {
      // Se não atualizou nada (porque o ID não existe OU o ID existe, mas pertence a outro negócio)
      return {
        success: false,
        message:
          "Serviço não encontrado ou você não tem permissão para editar.",
      };
    }

    // 4. Invalidação de Cache
    revalidatePath("/services");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Serviço '${name}' atualizado com sucesso!`,
    };
  } catch (error) {
    console.error(`Erro ao atualizar serviço ${serviceId}:`, error);
    return {
      success: false,
      message: "Falha interna ao atualizar o serviço.",
    };
  }
}
