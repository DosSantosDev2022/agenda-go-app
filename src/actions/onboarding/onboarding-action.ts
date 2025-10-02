'use server';

import { getServerSession } from 'next-auth';
import { db } from '@/lib/prisma';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';

const OnboardingSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
});

export async function createBusinessAction(values: z.infer<typeof OnboardingSchema>) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: 'Não autorizado. Faça login novamente.', success: false };
  }

  const validatedFields = OnboardingSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Dados inválidos.', success: false };
  }

  const { name, slug } = validatedFields.data;

  // Verifica se a URL (slug) já está em uso
  const existingBusiness = await db.business.findUnique({
    where: { slug },
  });

  if (existingBusiness) {
    return { error: 'Esta URL já está em uso. Por favor, escolha outra.', success: false };
  }

  try {
    await db.business.create({
      data: {
        name,
        slug,
        ownerId: session.user.id,
      },
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("ONBOARDING_ACTION_ERROR", error);
    return { error: 'Ocorreu um erro ao salvar. Tente novamente.', success: false };
  }
}