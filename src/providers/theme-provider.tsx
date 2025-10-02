"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";


/**
 * Um wrapper para o NextThemesProvider da biblioteca 'next-themes'.
 *
 * Facilita a configuração e o uso do provedor de tema
 * em toda a aplicação, permitindo que componentes clientes acessem o tema
 * atual (claro/escuro) e o alternem.
 *
 * @param {React.ComponentProps<typeof NextThemesProvider>} props - As propriedades passadas
 * diretamente para o NextThemesProvider. Inclui `children` e outras props como
 * `attribute`, `defaultTheme`, etc.
 * @param {React.ReactNode} props.children - Os elementos filhos a serem renderizados dentro do provedor.
 * @returns {JSX.Element} Um componente NextThemesProvider configurado.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}