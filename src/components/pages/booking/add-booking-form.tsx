// components/agenda/add-appointment-form.tsx
"use client";
import { Button, Calendar, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, Popover, PopoverContent, PopoverTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from "@/components/ui";
import { useAddBookingFormController } from "@/hooks/booking";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils";
import { CalendarIcon, CalendarPlus, Loader2 } from "lucide-react";
import { CustomerCombobox } from "./customer-combobox";

/**
 * @description Componente de formulário para a criação de um novo agendamento.
 * @param {object} props - Propriedades do componente.
 * @param {() => void} props.onSuccess - Callback para fechar o modal após o sucesso.
 */
interface AddBookingViewFormProps {
  onSuccess: () => void;
}

const AddABookingForm = ({ onSuccess }: AddBookingViewFormProps) => {
  const {
    form,
    onSubmit,
    isPending,
    services,
    isLoadingServices,
    isErrorServices,
    isServicesDisabled,
    handleCustomerSelect,
    handleCustomerNameChange,
    customerEmail,
    timeSlots,
    isTimeSlotsDisabled,
    isDayClosed
  } = useAddBookingFormController({ onSuccess });

  console.log("timeSlots:", timeSlots)
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">

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
                    onChange: handleCustomerNameChange
                  }}
                  currentEmail={customerEmail}
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
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isServicesDisabled}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={
                      isLoadingServices
                        ? "Carregando serviços..."
                        : isErrorServices || !services
                          ? "Erro ao carregar"
                          : "Selecione o serviço"
                    } />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/** biome-ignore lint/complexity/useOptionalChain: <explanation> */}
                  {services && services.map(service => (
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
        <div className="grid grid-cols-2 gap-4 justify-center items-end">

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
                        {field.value ? formatDate(field.value) : <span>Selecione a data</span>}
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

          {isDayClosed ? (
            <div className="flex items-center justify-center h-8 text-sm text-center text-yellow-600 bg-yellow-50 rounded-md border border-yellow-200">
              Fechado neste dia.
            </div>
          ) : (
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
                      {timeSlots.map(time => (
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
          )}

          {/* CAMPO DE HORA */}

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

export { AddABookingForm };

