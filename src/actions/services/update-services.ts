// actions/services/update-service.ts
"use server";

import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import {
  ServiceFormValues,
  ServiceSchema,
} from "@/types/schema/zod-service-schema";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

/**
 * @description Atualiza um serviço existente, verificando a propriedade.
 * @param serviceId O ID do serviço a ser atualizado.
 * @param values Os dados validados do formulário de serviço.
 * @returns Objeto com status de sucesso/erro e mensagem.
 */
export async function updateServiceAction(
  serviceId: string,
  values: ServiceFormValues,
): Promise<{ success: boolean; message: string }> {
  // 1. Validação
  const validationResult = ServiceSchema.safeParse(values);

  if (!validationResult.success) {
    if (validationResult.error instanceof ZodError) {
      return {
        success: false,
        message: "Erro de validação: " + validationResult.error.message,
      };
    }
    return { success: false, message: "Erro de validação desconhecido." };
  }

  const { name, durationInMinutes, price } = validationResult.data;

  try {
    // 2. Autenticação e Autorização
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, message: "Não autorizado." };
    }
    const userId = session.user.id;

    // 3. Verifica a propriedade do serviço (apenas o dono pode editar)
    const service = await db.service.findUnique({
      where: { id: serviceId },
      select: { business: { select: { ownerId: true } } },
    });

    if (service?.business?.ownerId !== userId) {
      return {
        success: false,
        message: "Você não tem permissão para editar este serviço.",
      };
    }

    // 4. Persistência (Atualização)
    await db.service.update({
      where: { id: serviceId },
      data: {
        name,
        durationInMinutes,
        price: Math.round(price * 100), // Armazena o preço em centavos
      },
    });

    // 5. Invalidação de Cache
    revalidatePath("/services");

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
