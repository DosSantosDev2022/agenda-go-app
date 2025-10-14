'use client';

import { registerAction } from '@/actions/auth/register-action';
import { RegisterSchema } from '@/types/schema/zod-schema-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Importe seus componentes do Shadcn/UI
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components/ui';
import Link from 'next/link';
import { toast } from 'sonner';


export function RegisterForm() {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      registerAction(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
        toast.success(data.success || 'Usuário cadastrado com sucesso !')
      });
    });
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Crie sua conta no AgendaGo</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Seu nome completo" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="seu@email.com" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="******" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirme sua Senha</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="******" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TODO: Adicionar mensagens de Erro e Sucesso globais */}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {/* TODO: Divisor "OU" */}
        {/* TODO: Botão de Login com Google */}
        <p className="text-sm text-center">
          Já tem uma conta?{' '}
          <Link href="/auth/login" className="underline">
            Faça o login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}