"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { WorkingHoursArraySchema } from "@/types/schema/working-hours";
import { getServerSession } from "next-auth";
import { z } from "zod";

const BusinessCreationSchema = z.object({
  name: z.string().min(3),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/),
  workingHours: WorkingHoursArraySchema.min(7, "Deve conter 7 dias."),
  slotDuration: z
    .number()
    .int()
    .positive()
    .min(1, "A duração do slot deve ser um número positivo."),
});

export async function createBusinessAction(
  values: z.infer<typeof BusinessCreationSchema>,
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "Não autorizado. Faça login novamente.", success: false };
  }

  const validatedFields = BusinessCreationSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Dados inválidos.", success: false };
  }

  const { name, slug, workingHours, slotDuration } = validatedFields.data;

  // Verifica se a URL (slug) já está em uso
  const existingBusiness = await db.business.findUnique({
    where: { slug },
  });

  if (existingBusiness) {
    return {
      error: "Esta URL já está em uso. Por favor, escolha outra.",
      success: false,
    };
  }

  try {
    await db.business.create({
      data: {
        name,
        slug,
        ownerId: session.user.id,
        // ✅ NOVO CAMPO SALVO no Business (slotDuration)
        slotDurationInMinutes: slotDuration,

        // ✅ SALVANDO HORÁRIOS DE TRABALHO (WorkingHours)
        workingHours: {
          createMany: {
            // Mapeamos os dados do WorkingHours do frontend para o formato do Prisma
            data: workingHours
              .map((day) => ({
                dayOfWeek:
                  day.day === "SUNDAY"
                    ? 0
                    : day.day === "MONDAY"
                      ? 1
                      : day.day === "TUESDAY"
                        ? 2
                        : day.day === "WEDNESDAY"
                          ? 3
                          : day.day === "THURSDAY"
                            ? 4
                            : day.day === "FRIDAY"
                              ? 5
                              : day.day === "SATURDAY"
                                ? 6
                                : 0, // Mapeamento de string para number (dia da semana)
                startTime: day.isWorking ? day.startTime || "09:00" : null, // Garante que é null/vazio se não estiver trabalhando
                endTime: day.isWorking ? day.endTime || "18:00" : null,
              }))
              // Filtramos dias que não estão trabalhando ou não têm horários
              .filter((day) => day.startTime !== null),
          },
        },
      },
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("ONBOARDING_ACTION_ERROR", error);
    return {
      error: "Ocorreu um erro ao salvar. Tente novamente.",
      success: false,
    };
  }
}
