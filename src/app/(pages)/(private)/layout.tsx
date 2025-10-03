import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { authOptions } from "@/lib/auth"; // Você já tem isso, está correto
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

/* export const dynamic = 'force-dynamic'; */

export default async function ProtectedLayout({
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
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="flex flex-1">
        {/* Passamos o status para o children via Context API, se necessário, 
           mas aqui vamos apenas usar o status para a UI do layout */}
        {userHasBusiness && <Sidebar />}
        <div className={`flex flex-1 flex-col`}>
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {/* O children agora é responsável pelo redirect */}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}