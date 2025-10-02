import * as z from 'zod';

/**
 * @module Schemas
 * @description Contém esquemas de validação Zod para diferentes formulários.
 */

/**
 * @constant
 * @name EMAIL_REGEX
 * @type {RegExp}
 * @description Expressão regular para validação de formato de e-mail básico.
 * @deprecated Prefira a validação nativa `.email()` do Zod quando possível.
 * Para validações mais robustas, considere bibliotecas dedicadas ou regex mais complexos.
 */

/**
 * @constant
 * @name PASSWORD_MIN_LENGTH
 * @type {number}
 * @description Comprimento mínimo exigido para senhas.
 */
const PASSWORD_MIN_LENGTH = 8;

/**
 * @constant
 * @name loginSchema
 * @description Esquema de validação Zod para o formulário de login.
 * Garante que o e-mail e a senha estejam em um formato válido e atendam aos requisitos de segurança.
 *
 * @property {z.ZodString} email - Valida o campo de e-mail.
 * - Deve ser uma string.
 * - Deve ser um e-mail válido (`.email()`).
 * - Não pode ser vazio (`.min(1)`).
 * - Espaços em branco serão removidos (`.trim()`).
 *
 * @property {z.ZodString} password - Valida o campo de senha.
 * - Deve ser uma string.
 * - Deve ter no mínimo `PASSWORD_MIN_LENGTH` caracteres (`.min()`).
 * - Deve conter pelo menos uma letra maiúscula (`.regex(/[A-Z]/)`).
 * - Deve conter pelo menos um caractere especial (`.regex(/[^a-zA-Z0-9]/)`).
 * - Espaços em branco serão removidos (`.trim()`).
 */
export const LoginSchema = z.object({
	email: z
		.string()
		.min(1, { message: "O e-mail é obrigatório." })
		.email({ message: "O e-mail fornecido é inválido." })
		.trim(), // Adicionado para remover espaços em branco

	password: z
		.string()
		.min(1, { message: "A senha é obrigatória." })
		.trim() // Adicionado para remover espaços em branco
		.min(PASSWORD_MIN_LENGTH, {
			message: `A senha deve ter no mínimo ${PASSWORD_MIN_LENGTH} caracteres.`,
		})
		.regex(/[A-Z]/, {
			message: "A senha deve conter pelo menos uma letra maiúscula.",
		})
		.regex(/[^a-zA-Z0-9]/, {
			message: "A senha deve conter pelo menos um caractere especial.",
		}),
});

/**
 * @typedef {z.infer<typeof loginSchema>} LoginFormInputs
 * @description Tipo TypeScript inferido a partir do `loginSchema` do Zod,
 * representando a estrutura dos dados de entrada do formulário de login.
 */
export type LoginFormInputs = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
  passwordConfirmation: z.string()
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "As senhas não coincidem.",
  path: ["passwordConfirmation"], // Campo que receberá a mensagem de erro
});