'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/prisma';
import { RegisterSchema, LoginSchema } from '@/types/schema/zod-schema-auth';
import { signIn } from 'next-auth/react';

export async function registerAction(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Campos inválidos.' };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: 'Este email já está em uso.' };
  }

  // TODO: Criar o Business associado ao usuário após o cadastro,
  // talvez em um passo de "onboarding"
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
    },
  });

  return { success: 'Usuário criado com sucesso! Faça o login.' };
}

export async function loginAction(values: z.infer<typeof LoginSchema>) {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Campos inválidos.' };
    }

    const { email, password } = validatedFields.data;

    try {
        await signIn('credentials', {
            email,
            password,
            redirectTo: '/dashboard', // Rota para o dashboard do profissional
        });
        return { success: 'Login efetuado com sucesso!' }
    } catch (error) {
        console.error(error)
        throw error;
    }
}