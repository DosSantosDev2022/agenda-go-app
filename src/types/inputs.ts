import { Business } from "@prisma/client";

/**
 * @description Interface para a lista de insumos.
 */
export interface InputsListItem {
  id: string;
  name: string;
  quantity: number,
  business: Business,
  createdAt: Date;
}

/**
 * @description Interface para a resposta da API (paginada).
 */
export interface InputsPageData {
  items: InputsListItem[];
  nextCursor: string | null; // Usado para o cursor da próxima página
}
