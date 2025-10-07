// components/agenda/customer-combobox.tsx
"use client";

import { CustomerSearchResult } from "@/actions";
import { Command, CommandEmpty, CommandGroup, CommandItem, Input } from "@/components/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCustomerComboboxController } from "@/hooks/booking";
import { Loader2, User } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";

/**
 * @description Interface para as propriedades do CustomerCombobox.
 */
interface CustomerComboboxProps {
  field: ControllerRenderProps<any, "customerName">;
  /** O valor atual do campo de nome do cliente (Controlado pelo RHF) */

  /** Callback chamado ao selecionar um cliente. */
  onCustomerSelect: (customer: CustomerSearchResult) => void;
  /** O valor atual do email (usado para destaque na lista). */
  currentEmail: string | null;
  /** Se o formulário está em processo de submissão. */
  isPending: boolean;
}

/**
 * @description Componente de Combobox para busca e seleção de clientes recorrentes.
 */
export function CustomerCombobox({
  field,
  onCustomerSelect,
  isPending,
}: CustomerComboboxProps) {
  const {
    open,
    setOpen,
    customers,
    isFetching,
    hasValidSearchTerm,
    handleSelect,
  } = useCustomerComboboxController({ field, onCustomerSelect });


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* Usamos um <Input> como o campo de entrada normal */}
        <div className="relative">
          <Input
            placeholder="Digite o nome do cliente"
            disabled={isPending}
            autoComplete="off"
            {...field}
          />
          {/* Indicador de carregamento */}
          {isFetching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        // Renderiza o PopoverContent vazio se não houver um termo válido para busca
        style={{ display: !hasValidSearchTerm ? 'none' : 'block' }}
      >
        <Command shouldFilter={false}>
          <CommandGroup>

            {isFetching ? (
              <CommandEmpty className="py-2 text-center text-sm text-muted-foreground">
                Buscando clientes...
              </CommandEmpty>
            ) : customers && customers.length > 0 ? (
              customers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={customer.name}
                  onSelect={() => handleSelect(customer)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.name}</span>
                  </div>
                </CommandItem>
              ))
            ) : (
              // Só mostra esta mensagem se a busca foi tentada e falhou.
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                Nenhum cliente encontrado.
              </CommandEmpty>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}