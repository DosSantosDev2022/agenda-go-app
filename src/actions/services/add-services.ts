// actions/services/create-service.ts
"use server";
import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import { ServiceFormValues, ServiceSchema } from "@/types/schema/zod-service-schema";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

/**
 * @description Cria um novo serviço associado ao negócio do usuário logado.
 * @param values Os dados validados do formulário de serviço.
 * @returns Objeto com status de sucesso/erro e mensagem.
 */
export async function addServiceAction(
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
        // 2. Autenticação e Autorização (Obter businessId)
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return { success: false, message: "Não autorizado. Faça login para cadastrar serviços." };
        }
        
        const business = await db.business.findUnique({
            where: { ownerId: session.user.id },
            select: { id: true },
        });

        if (!business) {
            return { success: false, message: "Negócio não encontrado para o usuário logado." };
        }
        
        const businessId = business.id;

        // 3. Persistência (Criação do Serviço)
        await db.service.create({
            data: {
                name,
                durationInMinutes,
                price: Math.round(price * 100), // Armazena o preço em centavos
                businessId,
            },
        });

        // 4. Invalidação de Cache
        revalidatePath('/services');

        return { success: true, message: `Serviço '${name}' cadastrado com sucesso!` };

    } catch (error) {
        console.error("Erro ao criar serviço:", error);
        return {
            success: false,
            message: "Falha interna ao cadastrar o serviço.",
        };
    }
}