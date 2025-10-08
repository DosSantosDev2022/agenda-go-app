// components/onboarding/onboarding-form.tsx
'use client';

import { createBusinessAction } from '@/actions/onboarding/onboarding-action';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { WorkingHour, WorkingHoursArraySchema } from '@/types/schema/working-hours';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { WorkingHoursInput } from './working-hours-input';


// Padrão de Horário de Trabalho Inicial (Segunda a Sexta, 9h às 18h)
const DEFAULT_WORKING_HOURS: WorkingHour[] = [
  { day: 'MONDAY', isWorking: true, startTime: '09:00', endTime: '18:00' },
  { day: 'TUESDAY', isWorking: true, startTime: '09:00', endTime: '18:00' },
  { day: 'WEDNESDAY', isWorking: true, startTime: '09:00', endTime: '18:00' },
  { day: 'THURSDAY', isWorking: true, startTime: '09:00', endTime: '18:00' },
  { day: 'FRIDAY', isWorking: true, startTime: '09:00', endTime: '18:00' },
  { day: 'SATURDAY', isWorking: false, startTime: undefined, endTime: undefined },
  { day: 'SUNDAY', isWorking: false, startTime: undefined, endTime: undefined },
];

// Schema de validação ATUALIZADO com Zod
const OnboardingSchema = z.object({
  name: z.string().min(3, { message: 'O nome do negócio deve ter pelo menos 3 caracteres.' }),
  slug: z.string().min(3, { message: 'A URL deve ter pelo menos 3 caracteres.' })
    .regex(/^[a-z0-9-]+$/, { message: 'Use apenas letras minúsculas, números e hifens.' }),
  workingHours: WorkingHoursArraySchema.min(7, { message: 'Você deve configurar os 7 dias da semana.' }),
});

type OnboardingValues = z.infer<typeof OnboardingSchema>;

/**
 * @description Componente de formulário para configurar o negócio durante o Onboarding.
 */
export function OnboardingForm() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      name: '',
      slug: '',
      //  Valor default para os horários
      workingHours: DEFAULT_WORKING_HOURS,
    },
    // Modo de validação quando o usuário sai do campo.
    mode: 'onBlur',
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: OnboardingValues) => {

    // A Server Action receberá agora os dados de workingHours validados
    const result = await createBusinessAction(values);

    if (result.success) {
      toast.success('Negócio configurado com sucesso!');
      router.push('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Informações do Negócio</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[70vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* CAMPOS NAME E SLUG (MANTIDOS) */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Negócio</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Barbearia do Zé" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da sua página</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground p-2 bg-muted border border-r-0 rounded-l-md">
                        agendago.com/
                      </span>
                      <Input placeholder="ex: barbearia-do-ze" {...field} className="rounded-l-none" disabled={isSubmitting} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='space-y-2 max-h-[30vh] overflow-y-auto'>
              <FormLabel>Horário de Funcionamento</FormLabel>
              {/* Note que o WorkingHoursInput recebe o control e o nome do campo */}
              <WorkingHoursInput control={form.control} name="workingHours" />
              {/* O FormFieldMessage aqui captura erros de validação do array (ex: se não tiver 7 dias) */}
              <FormField
                control={form.control}
                name="workingHours"
                render={() => (
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Concluir Configuração'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}