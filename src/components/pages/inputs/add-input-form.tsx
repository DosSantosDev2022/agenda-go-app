// components/inputs/add-input-form.tsx

"use client";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea
} from "@/components/ui";
import { useAddInputFormController } from "@/hooks/inputs/controllers/use-add-input-form-controller";
import { Loader2, PlusCircle } from "lucide-react";

/**
 * @description Props para o componente AddInputForm.
 */
interface AddInputFormProps {
  onSuccess: () => void; // Callback para fechar o modal ou dialog após sucesso.
}

/**
 * @description Componente de formulário para a criação de um novo insumo.
 */
const AddInputForm = ({ onSuccess }: AddInputFormProps) => {
  // Usamos nosso hook simplificado para obter tudo que precisamos.
  const { form, onSubmit, isPending } = useAddInputFormController({ onSuccess });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">

        {/* 1. CAMPO NOME DO INSUMO */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Insumo</FormLabel>
              <FormControl>
                {/* Trocamos o 'CustomerCombobox' por um Input simples. */}
                <Input
                  placeholder="Ex: Parafuso Sextavado"
                  disabled={isPending}
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 2. CAMPO DESCRIÇÃO */}
        {/* <FormField
          control={form.control}
          name="description" // Nome do campo deve ser 'description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex: Material de aço inoxidável, 5mm"
                  disabled={isPending}
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* 3. CAMPO QUANTIDADE */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade em Estoque</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  disabled={isPending}
                  autoComplete="off"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)} // Garante que o valor seja numérico
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* BOTÃO DE SUBMISSÃO */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="mr-2 h-4 w-4" /> // Ícone mais apropriado
          )}
          {isPending ? "Adicionando..." : "Adicionar Insumo"}
        </Button>
      </form>
    </Form>
  );
};

export { AddInputForm };