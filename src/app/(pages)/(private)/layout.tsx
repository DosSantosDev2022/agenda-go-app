import { getServerSession } from "next-auth";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { authOptions } from "@/lib/auth"; // Você já tem isso, está correto

/* export const dynamic = 'force-dynamic'; */

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    // Embora o middleware já proteja, esta é uma camada extra de segurança.
    return redirect("/auth/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      business: true,
    },
  });

  if (!user) {
    return redirect("/auth/login"); // Ou para uma página de erro/logout
  }

  // Leia o pathname do header que o middleware injetou. É mais confiável.
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  const userHasBusiness = !!user.business;
  const isOnboardingPage = pathname === "/onboarding";

  if (!userHasBusiness && !isOnboardingPage) {
    redirect("/onboarding");
  }

  if (userHasBusiness && isOnboardingPage) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="flex flex-1">
        {userHasBusiness && <Sidebar />}
        <div className={`flex flex-1 flex-col ${userHasBusiness ? "lg:pl-72" : ""}`}>
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}