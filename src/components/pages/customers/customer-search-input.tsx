// components/customers/customer-search-input.tsx
"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface CustomerSearchInputProps {
  /**
   * @description Função de callback para notificar o componente pai com o valor debounced.
   */
  onSearchChange: (searchTerm: string) => void;
  /**
   * @description Indica se o componente pai está carregando a nova lista filtrada.
   */
  isSearching: boolean;
}

/**
 * @description Componente de Input de busca isolado. Mantém o foco e notifica o pai apenas com o valor debounced.
 */
export function CustomerSearchInput({ onSearchChange, isSearching }: CustomerSearchInputProps) {
  // 1. Estado Local, dissociado da query do React Query
  const [searchTerm, setSearchTerm] = useState("");

  // 2. Aplica o debounce (muda este valor localmente)
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // 3. Efeito para notificar o componente pai quando o valor debounced realmente mudar
  useEffect(() => {
    // 💡 Chama o callback do pai (que atualiza o estado que o useInfiniteQuery usa)
    onSearchChange(debouncedSearchTerm);

    // A lista de dependências é apenas o valor debounced
  }, [debouncedSearchTerm, onSearchChange]);

  return (
    <div className="flex items-center space-x-2 w-full">
      <div className="relative w-full max-w-sm sm:max-w-md">
        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, e-mail ou telefone..."
          className="pl-10"
          value={searchTerm} // 💡 Usa o estado LOCAL
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* Indicador de Carregamento da Busca */}
      {isSearching && (
        <Loader2 className="h-5 w-5 animate-spin text-primary flex-shrink-0" />
      )}
    </div>
  );
}