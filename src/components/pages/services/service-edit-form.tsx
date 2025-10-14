// components/services/edit-service-form.tsx
"use client";

import { ServiceListItem } from "@/actions";
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@/components/ui";
import { useUpdateService } from "@/hooks/services";
import { ServiceFormValues, ServiceSchema } from "@/types/schema/zod-service-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";

/**
 * @description Props para o formulário de edição de serviço.
 */
interface EditServiceFormProps {
  service: ServiceListItem;
  onSuccess: () => void;
}

/**
 * @description Formulário para editar um serviço existente.
 */
const EditServiceForm = ({ service, onSuccess }: EditServiceFormProps) => {
  const { mutate, isPending } = useUpdateService();

  // Inicializa o formulário com os dados do serviço
  const form = useForm({
    resolver: zodResolver(ServiceSchema),
    defaultValues: {
      name: service.name,
      durationInMinutes: service.durationInMinutes,
      price: service.price / 100,
    },
  });

  /**
   * @description Envia os dados do formulário para a mutação de atualização.
   */
  function onSubmit(values: ServiceFormValues) {
    mutate({ serviceId: service.id, values }, {
      onSuccess: (result) => {
        if (result.success) {
          // Não precisa resetar, pois os dados já foram atualizados e refletirão na UI
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
                    {...field}
                    value={field.value as number}
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
                    disabled={isPending}
                    value={field.value as number}
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
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isPending ? "Salvando Alterações..." : "Salvar Alterações"}
        </Button>
      </form>
    </Form>
  );
}

export { EditServiceForm };

