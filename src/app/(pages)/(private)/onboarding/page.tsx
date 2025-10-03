import { OnboardingForm } from "@/components/pages/onboarding/onboarding-form";
import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login"); // Redirecionamento extra de segurança
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { business: { select: { id: true } } }, // Busque apenas o necessário
  });

  const userHasBusiness = !!user?.business?.id;

  // Lógica de Redirecionamento da Página:
  if (userHasBusiness) {
    // Se ele já tem negócio, joga para o dashboard
    redirect("/dashboard");
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">Configure seu Negócio</h1>
        <p className="text-muted-foreground text-center mb-6">
          Precisamos de algumas informações para criar sua página de agendamento.
        </p>
        <OnboardingForm />
      </div>
    </div>
  );
}