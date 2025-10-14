"use client";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

/**
 * Componente que agrupa todos os provedores de contexto e temas da aplicação.
 *
 * Inclui:
 * - AuthProvider (para gerenciamento de autenticação)
 * - QueryProvider (para gerenciamento de estado de dados assíncronos, ex: TanStack Query)
 * - NextThemesProvider (para gerenciamento de temas claro/escuro)
 * - Toaster (para exibição de notificações)
 *
 * Além disso, define a fonte Poppins e classes CSS globais no elemento <body>.
 *
 * @param {Object} props - As propriedades do componente.
 * @param {React.ReactNode} props.children - Os elementos filhos a serem renderizados dentro dos provedores.
 * @returns {JSX.Element} O componente <body> com todos os provedores e filhos aninhados.
 */
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <body
      className={`${poppins.className} antialiased h-full m-0 p-0 overflow-hidden`}
    >
      <AuthProvider>
        <QueryProvider>
          <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </NextThemesProvider>
          <Toaster position="top-center" richColors />
        </QueryProvider>
      </AuthProvider>
    </body>
  );
}

export { Providers };
