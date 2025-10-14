// components/dashboard/dashboard-header.tsx
"use client";

import { useSession } from "next-auth/react"; // Requer use client para obter a sessão

/**
 * @description Componente de cabeçalho do Dashboard.
 * É um Client Component para poder usar hooks como useSession e garantir interações futuras.
 */
const DashboardHeader = () => {
  // Use useSession para pegar o nome e dar as boas-vindas
  const { data: session } = useSession();
  const userName = session?.user?.name || "";

  return (
    <header>
      <h1 className="text-3xl font-extrabold tracking-tight">
        Bem-vindo(a) ao seu Dashboard, {userName}!
      </h1>
      <p className="text-muted-foreground mt-1">
        Aqui você terá uma visão geral dos seus agendamentos e finanças.
      </p>
    </header>
  );
}

export { DashboardHeader };
