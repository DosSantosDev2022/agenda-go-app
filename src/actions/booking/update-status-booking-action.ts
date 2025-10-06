// src/app/actions/booking-actions.ts (Exemplo de nome de arquivo)
"use server";

import { db } from "@/lib/prisma";
import { formatBookingStatus } from "@/utils/format-status-booking";
import { StatusBooking } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface UpdateBookingStatusResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * @description Atualiza o status de um agendamento (booking) específico.
 * @param {string} bookingId O ID único do agendamento a ser atualizado.
 * @param {BookingStatus} status O novo status para o agendamento (ex: 'CONFIRMED').
 * @returns {Promise<UpdateBookingStatusResponse>} Objeto com o resultado da operação.
 */
export async function updateBookingStatus(
  bookingId: string,
  status: StatusBooking,
): Promise<UpdateBookingStatusResponse> {
  const statusFormatted = formatBookingStatus(status);

  try {
    // 1. Validação básica de entrada.
    if (!bookingId || !status) {
      return {
        success: false,
        message: "É necessário informar o ID e o status da reserva.",
      };
    }

    // 2. Busca e verifica se o booking existe.
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return {
        success: false,
        message: "Reserva não encontrada.",
        error: "NOT_FOUND",
      };
    }

    // 3. Verifica se o status já é o que se deseja (evita escrita desnecessária).
    if (booking.status === status) {
      return {
        success: true,
        message: `Este agendamento já foi ${statusFormatted} `,
      };
    }

    // 4. Atualiza o status no banco de dados.
    await db.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    // Revalida os caminhos (mantido para segurança e fallback).
    revalidatePath("/bookings");

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
