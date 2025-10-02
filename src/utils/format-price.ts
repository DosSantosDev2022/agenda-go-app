// src/utils/formatPrice.ts

/**
 * Formata um número para o formato de moeda brasileira (BRL).
 * @param price O número a ser formatado.
 * @returns String formatada como R$ X.XXX,XX.
 */
export const formatPrice = (price: number): string => {
  if (typeof price !== "number") {
    // Retorna um valor padrão ou lança um erro se o tipo não for número.
    // Para simplificar, vamos tratar como 0.
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(0);
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};
