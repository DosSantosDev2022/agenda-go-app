/**
 * @description Interface para a lista de clientes.
 */
export interface CustomerListItem {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  totalAppointments: number;
  createdAt: Date;
}

/**
 * @description Interface para a resposta da API (paginada).
 */
export interface CustomersPageData {
  items: CustomerListItem[];
  nextCursor: string | null; // Usado para o cursor da próxima página
}
