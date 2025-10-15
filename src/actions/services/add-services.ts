// actions/services/create-service.ts
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
 * @description Cria um novo serviço associado ao negócio do usuário logado.
 * Garante que a operação só ocorre se o usuário estiver autenticado e tiver um businessId.
 *
 * @param values Os dados validados do formulário de serviço.
 * @returns Objeto com status de sucesso/erro e mensagem.
 */
export async function addServiceAction(
  values: ServiceFormValues,
): Promise<{ success: boolean; message: string }> {
  // 1. Validação do Zod
  const validationResult = ServiceSchema.safeParse(values);

  if (!validationResult.success) {
    if (validationResult.error instanceof ZodError) {
      // Você pode formatar o erro para enviar detalhes ao cliente
      const formattedErrors = validationResult.error.flatten().fieldErrors;
      console.log("Erros detalhados:", formattedErrors);

      // Retornamos uma mensagem genérica, mas o console.log ajuda no debug
      return {
        success: false,
        message: "Erro de validação: Um ou mais campos estão inválidos.",
      };
    }
    return { success: false, message: "Erro de validação desconhecido." };
  }
  const { name, durationInMinutes, price } = validationResult.data;

  // 2. AUTENTICAÇÃO E AUTORIZAÇÃO (Obter businessId)
  const authData = await getAuthData();

  if (!authData) {
    return {
      success: false,
      message: "Não autorizado. Faça login para cadastrar serviços.",
    };
  }

  const { businessId } = authData;

  try {
    // Busca um serviço com o mesmo nome e o mesmo businessId

    const existingService = await db.service.findFirst({
      where: {
        name: {
          equals: name,
        },
        businessId: businessId,
      },
      select: {
        id: true,
      },
    });

    if (existingService) {
      return {
        success: false,
        message: `O serviço '${name}' já existe.`,
      };
    }

    // Persistência (Criação do Serviço)
    await db.service.create({
      data: {
        name,
        durationInMinutes,
        price: Math.round(price * 100), // Armazena o preço em centavos
        businessId,
      },
    });

    //  Invalidação de Cache
    revalidatePath("/services");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Serviço '${name}' cadastrado com sucesso!`,
    };
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    return {
      success: false,
      message:
        "Falha interna ao cadastrar o serviço. Tente novamente mais tarde.",
    };
  }
}
