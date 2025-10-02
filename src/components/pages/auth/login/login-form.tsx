'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LoginSchema } from '@/types/schema/zod-schema-auth';
import { signIn } from 'next-auth/react';
// 1. CORREÇÃO DO ROUTER: Para o App Router, use 'next/navigation'
import { useRouter } from 'next/navigation';

// Importe seus componentes
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { toast } from 'sonner';

// Define o tipo dos dados do formulário a partir do Zod Schema
type LoginFormInputs = z.infer<typeof LoginSchema>;

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Extrai o 'isSubmitting' do formState para usar no botão
  const { isSubmitting } = form.formState;

  const onSubmit = async (data: LoginFormInputs) => {
    setError(null);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password
      });
      console.log(result)
      if (result?.error) {
        const errorMessage = "Email ou senha inválidos.";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("Erro de login:", result.error);
      } else if (result?.ok) {
        toast.success("Login efetuado com sucesso!");
        router.push("/dashboard");
        form.reset();
      }
    } catch (err) {
      const unexpectedError = "Ocorreu um erro inesperado. Tente novamente.";
      console.error("Erro inesperado durante o login:", err);
      setError(unexpectedError);
      toast.error(unexpectedError);
    }
  };

  // Removi o Card para ser compatível com o AuthLayout
  return (
    <div className="w-full space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="seu@email.com" disabled={isSubmitting} />
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
                  <Input {...field} type="password" placeholder="******" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Opcional: Exibir a mensagem de erro global */}
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Acessando...' : 'Acessar conta'}
          </Button>
        </form>
      </Form>

      {/* Divisor "OU" */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ou acesse com
          </span>
        </div>
      </div>

      {/* Botão de login com Google */}
      <Button variant="outline" className="w-full" onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
        {/* Adicione o ícone do Google se desejar */}
        Google
      </Button>

      <div>
        <p className="text-sm text-center">
          Não possuí uma conta?{' '}
          <Link href="/auth/register" className="underline">
            Faça o cadastro
          </Link>
        </p>
      </div>
    </div>
  );
}