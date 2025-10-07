import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { authOptions } from "@/lib/auth"; // Você já tem isso, está correto
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

/* export const dynamic = 'force-dynamic'; */

export default async function PriveteRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return redirect("/auth/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      business: true,
    },
  });

  if (!user) {
    return redirect("/auth/login");
  }

  const userHasBusiness = !!user.business;

  return (
    <div className="flex bg-background h-screen overflow-hidden">

      {/* 1. Sidebar */}
      {userHasBusiness && <Sidebar />}

      {/* 2. Área de Conteúdo (Header + Main) */}
      <div className={`flex flex-1 flex-col`}>
        <Header />

        {/* 💡 AQUI É ONDE O SCROLL DEVE OCORRER NO DASHBOARD! 
           flex-1 faz com que ele preencha o espaço restante, e overflow-y-auto 
           cria o scroll interno. */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-custom">
          {children}
        </main>
      </div>
    </div>
  );
}