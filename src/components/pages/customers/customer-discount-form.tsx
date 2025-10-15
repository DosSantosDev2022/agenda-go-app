// components/customers/customer-discount-form.tsx
"use client";

import { sendDiscountAction } from "@/actions/customer/send-discount-action";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CustomerListItem } from "@/types/customers";
import {
  DiscountFormValues,
  DiscountSchema,
} from "@/types/schema/zod-discount-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CustomerDiscountFormProps {
  customer: CustomerListItem;
  onSuccess: () => void; // Para fechar o modal após o sucesso
}

/**
 * @description Formulário para definir e enviar um desconto percentual a um cliente.
 */
export function CustomerDiscountForm({ customer, onSuccess }: CustomerDiscountFormProps) {
  const form = useForm({
    resolver: zodResolver(DiscountSchema),
    defaultValues: {
      customerId: customer.id,
      percentage: 10, // Sugestão inicial
    },
  });

  const { isSubmitting } = form.formState;

  // 1. Definição da função onSubmit
  const onSubmit = async (data: DiscountFormValues) => {
    // 2. Integração com a Server Action
    const result = await sendDiscountAction(data);

    if (result.success) {
      toast.success(result.message);
      onSuccess(); // Fecha o modal
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Campo Oculto (CustomerId) */}
        <input type="hidden" {...form.register("customerId")} />

        {/* Campo: Porcentagem de Desconto */}
        <FormField
          control={form.control}
          name="percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Porcentagem de Desconto (%)</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    {...field}
                    value={field.value?.toString()}
                    onChange={(e) => {
                      // Chama o onChange do RHF
                      field.onChange(e);
                    }}
                    type="number"
                    min={1}
                    max={100}
                    placeholder="Ex: 10, 25, 50"
                  />
                </FormControl>
                {/* Ícone de Porcentagem */}
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {isSubmitting ? "Enviando..." : "Enviar Desconto"}
        </Button>
      </form>
    </Form>
  );
}