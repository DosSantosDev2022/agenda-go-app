// Importa o Zod
import { z } from 'zod';

// 1. Schema Base do Produto
// Define a estrutura e as validações para os campos principais do produto.
export const productSchema = z.object({
  /**
   * Nome do produto.
   * Deve ser uma string com pelo menos 1 caracter.
   */
  name: z.string({
    error: "O nome é obrigatório.",
  }).min(1, "O nome não pode estar vazio."),

  /**
   * Quantidade do produto em estoque.
   * Deve ser um número inteiro e não pode ser negativo.
   */
  quantity: z.number({
    error: "A quantidade é obrigatória.",
  }).int("A quantidade deve ser um número inteiro.").nonnegative("A quantidade não pode ser negativa."),

  /**
   * ID da empresa (Business) à qual o produto pertence.
   * Deve ser uma string no formato CUID.
   */
  businessId: z.string({
    error: "O ID da empresa é obrigatório.",
  }).cuid("O ID da empresa fornecido é inválido."),
});

// 2. Schema para Criação de Produto
// Para criar um produto, usamos o schema base diretamente,
// pois todos os campos são obrigatórios.
export const createProductSchema = productSchema;

export type InputFormValues = z.infer<typeof createProductSchema>;

// 3. Schema para Atualização de Produto
// Para atualizar, tornamos todos os campos do schema base opcionais.
// O método .partial() faz isso automaticamente para nós.
export const updateProductSchema = productSchema.partial();