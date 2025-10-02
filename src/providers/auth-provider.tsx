"use client";

/**
 * Provedor de Sessão para autenticação.
 *
 * Este componente de alto nível (`Higher-Order Component`) envolve a aplicação
 * com o `SessionProvider` do NextAuth.js. Ele torna o objeto de sessão
 * disponível para todos os componentes filhos que o utilizam
 * por meio de hooks como `useSession`. Isso é crucial para gerenciar
 * o estado de autenticação do usuário em toda a aplicação cliente.
 *
 * @param {object} { children } - O objeto de props, contendo os elementos filhos que serão renderizados dentro do provedor.
 * @returns {JSX.Element} Um componente `SessionProvider` que envolve os componentes filhos.
 */
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export { AuthProvider };
