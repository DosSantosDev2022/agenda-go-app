// Importa o Zod
import { z } from 'zod';

// 1. Schema Base do Produto
// Define a estrutura e as validações para os campos principais do produto.
export const productSchema = z.object({
  id: z.string().min(1, "ID do insumo é obrigatório."),
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
  quantity: z.coerce
    .number({
      error: "A quantidade deve ser um número.",
    })
    .int("A quantidade deve ser um número inteiro.")
    .nonnegative("A quantidade não pode ser negativa."),
})

// 2. Schema para Criação de Produto
// Para criar um produto, usamos o schema base diretamente,
// pois todos os campos são obrigatórios.
export const createProductSchema = productSchema;

export type InputFormValues = z.infer<typeof createProductSchema>;

export const updateInputSchema = z.object({
  id: z.string().min(1, "ID do insumo é obrigatório."), // Adiciona validação para o ID
  name: z.string().min(1, "O nome é obrigatório"),
  quantity: z.coerce
    .number({
      error: "A quantidade deve ser um número.",
    })
    .int("A quantidade deve ser um número inteiro.")
    .nonnegative("A quantidade não pode ser negativa."),
  // description: z.string().optional(), // Se você for incluir a descrição
});

export type UpdateInputFormValues = z.infer<typeof updateInputSchema>;