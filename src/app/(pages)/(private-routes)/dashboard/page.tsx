import { getDashboardData } from "@/actions/dashboard/dashboard-data";
import { DashboardHeader, RecentBookings, StatsCards } from "@/components/pages/dashboard";
import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const data = await getDashboardData();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login"); // Redirecionamento extra de segurança
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { business: { select: { id: true } } },
  });

  const userHasBusiness = !!user?.business?.id;

  // Lógica de Redirecionamento da Página:
  if (!userHasBusiness) {
    // Se ele NÃO tem negócio, joga para o onboarding
    redirect("/onboarding");
  }

  if (!data) {
    // Tratamento de erro ou redirecionamento caso o getDashboardData retorne null
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-destructive">
          Não foi possível carregar os dados do Dashboard.
        </p>
      </div>
    );
  }

  const { totalBookings, totalCustomers, totalRevenue, recentBookings } = data;

  return (
    <div className="space-y-8">
      {/* 1. Cabeçalho de Boas-vindas (Client Component - para futuras interações, mas simples por agora) */}
      <DashboardHeader />

      {/* 2. Cards de Estatísticas */}
      <StatsCards
        totalBookings={totalBookings}
        totalCustomers={totalCustomers}
        totalRevenue={totalRevenue}
      />

      {/* 3. Seção de Agendamentos Recentes */}
      <div className="grid grid-cols-1 gap-8">
        {/* Agendamentos Recentes ocupa 2/3 da largura em telas grandes */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Agendamentos Recentes
          </h2>
          <RecentBookings recentBookings={recentBookings} />
        </div>

        {/* Espaço para gráficos ou outros cards (1/3) */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Receitas mensais
          </h2>
          <div className="p-6 border rounded-lg h-64 flex items-center justify-center text-muted-foreground">
            Gráfico de Receita Mensal
          </div>
        </div>
      </div>
    </div>
  );
}