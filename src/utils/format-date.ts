import { format } from "date-fns";

/**
 * Formata um objeto Date ou string de data para um formato específico.
 * Retorna "-" se a data for inválida.
 * @param {Date | string} date - A data a ser formatada. Pode ser um objeto Date ou uma string parsável.
 * @param {string} [pattern="dd/MM/yyyy"] - O padrão de formatação a ser usado (padrão 'dd/MM/yyyy').
 * @returns {string} A data formatada como string ou "-" se for inválida.
 */
export const formatDate = (date: Date | string, pattern = "dd/MM/yyyy") => {
  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return "-";
  }

  return format(parsedDate, pattern);
};
