import { getDashboardData } from "@/actions/dashboard/dashboard-data";
import { DashboardHeader, RecentBookings, StatsCards } from "@/components/pages/dashboard";
import { MonthlyRevenueChart } from "@/components/pages/dashboard/monthly-revenue-chart";
import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // 💡 Use getServerSession para consistência com OnboardingPage
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    // Se a sessão for inválida, vá para o login.
    redirect("/auth/login");
  }

  // Busque no Prisma usando o ID da sessão
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { business: { select: { id: true } } },
  });

  const userHasBusiness = !!user?.business?.id;

  // Lógica de Redirecionamento da Página:
  if (!userHasBusiness) {
    // Se não tem negócio, redireciona para o onboarding.
    redirect("/onboarding");
  }




  const data = await getDashboardData();




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

  const { totalBookings, totalCustomers, totalRevenue, recentBookings, monthlyRevenue } = data;

  return (
    <div className="space-y-8">
      <DashboardHeader />

      {/* 2. Cards de Estatísticas */}
      <StatsCards
        totalBookings={totalBookings}
        totalCustomers={totalCustomers}
        totalRevenue={totalRevenue}
      />

      {/* 3. Seção Principal (Agendamentos Recentes e Gráfico) */}
      {/* Aqui estamos usando grid-cols-1 para mobile e lg:grid-cols-3 para telas grandes */}
      <div className="grid grid-cols-1 gap-8">

        {/* Agendamentos Recentes (ocupa 2/3 da largura em telas grandes) */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Agendamentos Recentes
          </h2>
          <RecentBookings recentBookings={recentBookings} />
        </div>

        {/* 4. Substituir a div placeholder pelo componente de gráfico */}
        <div className="lg:col-span-2">
          <MonthlyRevenueChart data={monthlyRevenue} />
        </div>
      </div>
    </div>
  );
}