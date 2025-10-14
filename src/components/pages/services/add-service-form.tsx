// components/services/new-service-form.tsx
"use client";

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@/components/ui";
import { useCreateService } from "@/hooks/services";
import { ServiceFormValues, ServiceSchema } from "@/types/schema/zod-service-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

/**
 * @description Props para o formulário de novo serviço.
 */
interface NewServiceFormProps {
  onSuccess: () => void;
}

/**
 * @description Formulário para cadastrar um novo serviço.
 */
const AddServiceForm = ({ onSuccess }: NewServiceFormProps) => {
  const { mutate, isPending } = useCreateService();

  const form = useForm({
    resolver: zodResolver(ServiceSchema),
    defaultValues: {
      name: "",
      durationInMinutes: 60, // Valor padrão 60 minutos
      price: 0,
    },
  });

  /**
   * @description Envia os dados do formulário para a mutação do React Query.
   */
  function onSubmit(values: ServiceFormValues) {
    mutate(values, {
      onSuccess: (result) => {
        if (result.success) {
          form.reset();
          onSuccess(); // Fecha o modal
        }
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* 1. Nome do Serviço */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Serviço</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Corte e Barba" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* 2. Duração em Minutos */}
          <FormField
            control={form.control}
            name="durationInMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração (Minutos)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ex: 60"
                    disabled={isPending}
                    value={field.value as number}
                    // Garante que o valor seja tratado como número para o input
                    onChange={e => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 3. Preço */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ex: 50.00"
                    step="0.01"
                    value={field.value as number} // Garante que o valor seja passado corretamente
                    onChange={e => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* BOTÃO DE SUBMISSÃO */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar Serviço"}
        </Button>
      </form>
    </Form>
  );
}

export { AddServiceForm };

