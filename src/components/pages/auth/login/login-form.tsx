'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RegisterSchema } from '@/types/schema/zod-schema-auth';
import { loginAction } from '@/actions/auth/register-action';
import { FaGoogle } from "react-icons/fa";


// Importe seus componentes do Shadcn/UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { toast } from 'sonner';


export function LoginForm() {
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
      loginAction(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
        toast.success(data.success)
      });
    });
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Faça seu login no AgendaGo</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            
            {/* TODO: Adicionar mensagens de Erro e Sucesso globais */}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Acessando conta...' : 'Acessar conta'}
            </Button>
            <Button type="submit" className="w-full" disabled={isPending}>
              Acessar com Google <FaGoogle />
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {/* TODO: Divisor "OU" */}
        <p className="text-sm text-center">
            Não possuí uma conta?{' '}
            <Link href="/auth/register" className="underline">
                Faça o cadastro
            </Link>
        </p>
      </CardFooter>
    </Card>
  );
}