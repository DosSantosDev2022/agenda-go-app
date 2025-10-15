// actions/customer/send-discount-action.ts
"use server";

import {
  DiscountFormValues,
  DiscountSchema,
} from "@/types/schema/zod-discount-schema";
import { getAuthData } from "@/utils/get-auth-data";

/**
 * @description Server Action que processa o envio de um desconto percentual a um cliente.
 * * @param values Os dados validados do formulário (customerId e percentage).
 * @returns Objeto com status de sucesso/erro e mensagem.
 */
export async function sendDiscountAction(
  values: DiscountFormValues,
): Promise<{ success: boolean; message: string }> {
  // 1. Validação do Zod
  const validationResult = DiscountSchema.safeParse(values);

  if (!validationResult.success) {
    // Para simplificar, retornamos o primeiro erro
    const firstError = validationResult.error.flatten().fieldErrors;
    console.error("Erro de validação:", firstError);
    return {
      success: false,
      message: firstError.percentage?.[0] || "Erro de validação desconhecido.",
    };
  }

  const { customerId, percentage } = validationResult.data;

  // 2. AUTENTICAÇÃO E AUTORIZAÇÃO (Obter businessId)
  const authData = await getAuthData();

  if (!authData) {
    return {
      success: false,
      message: "Não autorizado. Faça login para realizar esta ação.",
    };
  }

  // 3. Lógica de Negócio (Exemplo)
  try {
    // 💡 Implementação futura:
    // - Verificar se o cliente pertence ao businessId
    // - Criar um registro de cupom no banco (Cupom: { customerId, percentage, businessId, expiresAt })
    // - Enviar a notificação ao cliente (email/SMS, etc.)

    // Simulação de criação (Aqui você implementaria a lógica real no Prisma)
    console.log(
      `[ACTION]: Criando cupom de ${percentage}% para o cliente ID: ${customerId} do negócio ID: ${authData.businessId}`,
    );

    // await db.coupon.create({ ... });

    return {
      success: true,
      message: `Desconto de ${percentage}% enviado com sucesso ao cliente!`,
    };
  } catch (error) {
    console.error("Erro ao enviar desconto:", error);
    return {
      success: false,
      message:
        "Falha interna ao processar o desconto. Tente novamente mais tarde.",
    };
  }
}
