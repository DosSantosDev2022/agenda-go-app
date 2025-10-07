// src/app/actions/booking-actions.ts
"use server";

import { db } from "@/lib/prisma";
import { formatBookingStatus } from "@/utils/format-status-booking";
import { getAuthData } from "@/utils/get-auth-data";
import { StatusBooking } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface UpdateBookingStatusResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * @description Atualiza o status de um agendamento (booking) específico.
 * Garante que a atualização só ocorre se o agendamento pertencer ao negócio do usuário logado.
 *
 * @param {string} bookingId O ID único do agendamento a ser atualizado.
 * @param {StatusBooking} status O novo status para o agendamento (ex: 'CONFIRMED').
 * @returns {Promise<UpdateBookingStatusResponse>} Objeto com o resultado da operação.
 */
export async function updateBookingStatus(
  bookingId: string,
  status: StatusBooking,
): Promise<UpdateBookingStatusResponse> {
  // 1. OBTENÇÃO DOS DADOS DE AUTORIZAÇÃO E NEGÓCIO
  const authData = await getAuthData();

  if (!authData) {
    return {
      success: false,
      message: "Não autorizado: Sessão inválida ou negócio não configurado.",
      error: "UNAUTHORIZED",
    };
  }

  const { businessId } = authData;
  const statusFormatted = formatBookingStatus(status);

  try {
    // 2. Validação básica de entrada.
    if (!bookingId || !status) {
      return {
        success: false,
        message: "É necessário informar o ID e o status da reserva.",
      };
    }

    // 3. Busca e verifica se o booking existe e PERTENCE ao negócio.
    const booking = await db.booking.findUnique({
      where: {
        id: bookingId,
        businessId: businessId,
      },
    });

    if (!booking) {
      // Se não for encontrado (porque não existe OU não pertence ao businessId do usuário)
      return {
        success: false,
        message:
          "Reserva não encontrada ou você não tem permissão para alterá-la.",
        error: "NOT_FOUND_OR_UNAUTHORIZED",
      };
    }

    // 4. Verifica se o status já é o que se deseja (evita escrita desnecessária).
    if (booking.status === status) {
      return {
        success: true,
        message: `Este agendamento já foi ${statusFormatted} `,
      };
    }

    // 5. Atualiza o status no banco de dados.
    await db.booking.update({
      where: {
        id: bookingId,
        businessId: businessId, // 🛑 REPETIR o businessId garante que a operação é atômica e segura.
      },
      data: { status },
    });

    // Revalida os caminhos (mantido para segurança e fallback).
    revalidatePath("/bookings");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Agendamento ${statusFormatted} !`,
    };
  } catch (error) {
    console.error("Erro ao atualizar o status da reserva:", error);
    // 6. Retorno de erro padronizado.
    return {
      success: false,
      message:
        "Falha ao atualizar o status da reserva devido a um erro no servidor.",
      error:
        error instanceof Error
          ? error.message
          : "Ocorreu um erro desconhecido.",
    };
  }
}
