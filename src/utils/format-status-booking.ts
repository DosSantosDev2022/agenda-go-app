/**
 * @description Mapeia o StatusBooking para o estilo da Badge.
 * @param {string} status - O status do agendamento.
 * @returns {string} O estilo da variante do ShadcnUI.
 */
export function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" | "warnning" {
  switch (status) {
    case "CONFIRMED":
      return "default";
    case "PENDING":
      return "warnning";
    case "CANCELED":
      return "destructive";
    default:
      return "outline";
  }
}

// Adicione esta função ao seu arquivo onde a lógica de status for necessária
// (Ex: no topo do components/dashboard/recent-bookings.tsx ou em um arquivo utils de UI)

/**
 * @description Converte o status do Booking (enum) para uma string amigável em Português.
 * @param {string} status - O status do agendamento (Ex: "CONFIRMED").
 * @returns {string} O status formatado (Ex: "Confirmado").
 */
export function formatBookingStatus(status: string): string {
  switch (status) {
    case "CONFIRMED":
      return "Confirmado";
    case "PENDING":
      return "Pendente";
    case "CANCELED":
      return "Cancelado";
    default:
      return status; // Retorna o valor original se não for reconhecido
  }
}
