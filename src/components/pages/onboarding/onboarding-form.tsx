'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createBusinessAction } from '@/actions/onboarding/onboarding-action'; // Nossa futura Server Action

// Schema de validação com Zod
const OnboardingSchema = z.object({
  name: z.string().min(3, { message: 'O nome do negócio deve ter pelo menos 3 caracteres.' }),
  slug: z.string().min(3, { message: 'A URL deve ter pelo menos 3 caracteres.' })
    .regex(/^[a-z0-9-]+$/, { message: 'Use apenas letras minúsculas, números e hifens.' }),
});

type OnboardingValues = z.infer<typeof OnboardingSchema>;

export function OnboardingForm() {
  const router = useRouter();
  const form = useForm<OnboardingValues>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: OnboardingValues) => {
    const result = await createBusinessAction(values);

    if (result.success) {
      toast.success('Negócio configurado com sucesso!');
      router.push('/dashboard'); // Redireciona para o dashboard
    } else {
      toast.error(result.error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Negócio</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Concluir Configuração'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}