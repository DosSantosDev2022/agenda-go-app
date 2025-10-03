import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
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
  if (!userHasBusiness) {
    // Se ele NÃO tem negócio, joga para o onboarding
    redirect("/onboarding");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Bem-vindo ao seu Dashboard, {session?.user?.name}!
      </h1>
      <p className="text-muted-foreground">
        Aqui você terá uma visão geral dos seus agendamentos e finanças.
      </p>
    </div>
  );
}