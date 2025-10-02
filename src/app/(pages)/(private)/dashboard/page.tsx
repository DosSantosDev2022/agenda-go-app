import { getServerSession } from "next-auth";

export default async function DashboardPage() {
  const session = await getServerSession();

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