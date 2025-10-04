// components/agenda/add-appointment-form.tsx
"use client";

import { BookingViewFormValues, BookingViewSchema } from "@/types/schema/zod-booking-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Componentes Shadcn/UI
import { CustomerSearchResult } from "@/actions";
import { Input } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useServicesQuery } from "@/hooks";
import { useCreateBooking } from "@/hooks/booking/use-create-booking";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils";
import { CalendarIcon, CalendarPlus, Loader2 } from "lucide-react";
import { useCallback } from "react";
import { CustomerCombobox } from "./customer-combobox";


// MOCK para horários disponíveis
const TIME_SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];


/**
 * @description Componente de formulário para a criação de um novo agendamento.
 * @param {object} props - Propriedades do componente.
 * @param {() => void} props.onSuccess - Callback para fechar o modal após o sucesso.
 */
interface AddBookingViewFormProps {
  onSuccess: () => void;
}

export function AddABookingForm({ onSuccess }: AddBookingViewFormProps) {

  const { mutate, isPending } = useCreateBooking();

  const form = useForm<BookingViewFormValues>({
    resolver: zodResolver(BookingViewSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      serviceId: "",
      date: undefined, // Tipo Date | undefined
      startTime: "",
      notes: "",
    },
  });

  /**
   * @description Manipula a submissão do formulário, integrando com a Server Action.
   * @param values Os dados validados do formulário.
   */
  async function onSubmit(values: BookingViewFormValues) {
    // Chama a função mutate com os valores.
    mutate(values, {
      onSuccess: (result) => {
        if (result.success) {
          form.reset();
          onSuccess(); // Fecha o modal
        }
      },
    });
  }

  // Função para preencher Email e Telefone ao selecionar um cliente
  const handleCustomerSelect = useCallback((customer: CustomerSearchResult) => {
    // Atualiza os campos do React Hook Form com os dados do cliente
    form.setValue("customerName", customer.name, { shouldValidate: true });
    form.setValue("customerEmail", customer.email ?? "", { shouldValidate: true });
    form.setValue("customerPhone", customer.phone ?? "", { shouldValidate: true });
  }, [form]);

  // Busca os serviços do negócio
  const { data, isLoading } = useServicesQuery()

  const services = data

  if (!services) {
    return <div>Erro ao carregar serviços </div>
  }



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* 1. SELEÇÃO DE CLIENTE */}
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Cliente</FormLabel>
              <FormControl>
                <CustomerCombobox
                  field={{
                    ...field,
                    // 💡 Sobrescreve o onChange para incluir a lógica de limpeza do email/telefone
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      const newName = e.target.value;

                      // 1. Atualiza o valor do RHF
                      field.onChange(newName);

                      // 2. Limpa Email/Telefone se o usuário estiver digitando
                      // (Se o valor não for o mesmo que foi setado por handleCustomerSelect)
                      if (newName !== form.getValues('customerName')) {
                        form.setValue("customerEmail", "", { shouldValidate: true });
                        form.setValue("customerPhone", "", { shouldValidate: true });
                      }
                    }
                  }}
                  currentEmail={form.watch('customerEmail')}
                  isPending={isPending}
                  onCustomerSelect={handleCustomerSelect}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 2. CAMPO E-MAIL */}
        <FormField
          control={form.control}
          name="customerEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="cliente@email.com"
                  type="email"
                  disabled={isPending}
                  autoComplete="off"
                  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 3. CAMPO TELEFONE */}
        <FormField
          control={form.control}
          name="customerPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone (WhatsApp)</FormLabel>
              <FormControl>
                <Input
                  placeholder="(99) 99999-9999"
                  disabled={isPending}
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 2. SELEÇÃO DE SERVIÇO */}
        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serviço</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`${isLoading ? "Carregando..." : "Selecione o serviço"}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 3. DATA E HORA */}
        <div className="grid grid-cols-2 gap-4">

          {/* CAMPO DE DATA */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="mb-1">Data</FormLabel>
                <Popover>
                  <PopoverTrigger className="w-full" asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isPending}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? formatDate(field.value, "PPP") : <span>Selecione a data</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      // Desabilita dias passados
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CAMPO DE HORA */}
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a hora" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TIME_SLOTS.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 4. OBSERVAÇÕES */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detalhes importantes sobre o agendamento..."
                  className="resize-none"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormDescription>Máximo de 500 caracteres.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* BOTÃO DE SUBMISSÃO */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CalendarPlus className="mr-2 h-4 w-4" />
          )}
          {isPending ? "Agendando..." : "Confirmar Agendamento"}
        </Button>
      </form>
    </Form>
  );
}