"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button"; // Assumindo que você usa Shadcn UI Button
import { cn } from "@/lib/utils"; // Assumindo que você tem uma função utilitária para combinar classes

// Interface para as propriedades do componente
interface ThemeToggleProps {
  /** Se deve mostrar o texto do tema (Light/Dark) ao lado do ícone. */
  showLabel?: boolean;
  /** Classes CSS adicionais para o botão. */
  className?: string;
}

/**
 * Componente que alterna entre os temas 'light' e 'dark' usando o next-themes.
 *
 * Ele exibe o ícone de Sol ou Lua e, opcionalmente, o nome do tema,
 * e usa o componente Button do Shadcn UI.
 *
 * @param {ThemeToggleProps} props - As propriedades do componente.
 * @returns {JSX.Element | null} O botão de alternância de tema ou null durante a montagem.
 */
export function ThemeToggleButton({ showLabel = false, className }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // 1. Garante que o componente só renderize o conteúdo dependente do tema
  // após ser montado no lado do cliente (para evitar erros de hidratação).
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    // Alterna o tema entre 'light' e 'dark'.
    // Note: 'system' não é usado como destino aqui, mas o 'theme' pode ser 'system'.
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size={showLabel ? "default" : "icon"}
      onClick={handleClick}
      className={cn(
        'relative overflow-hidden transition-all',
        showLabel && 'gap-2',
        className
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {/* Ícone: Sol para Light, Lua para Dark/System */}
      {theme === 'light' ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}

      {/* Rótulo opcional */}
      {showLabel && (
        <span className="text-sm">
          {theme === 'light' ? 'Light' : 'Dark'}
        </span>
      )}
    </Button>
  );
}