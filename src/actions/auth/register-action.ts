"use server";

import { db } from "@/lib/prisma";
import { RegisterSchema } from "@/types/schema/zod-schema-auth";
import bcrypt from "bcryptjs";
import * as z from "zod";

export async function registerAction(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos." };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Este email já está em uso." };
  }

  // TODO: Criar o Business associado ao usuário após o cadastro,
  // talvez em um passo de "onboarding"
  await db.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
    },
  });

  return { success: "Usuário criado com sucesso! Faça o login." };
}
