import { AuthLayout } from '@/components/pages/auth';
import { LoginForm } from '@/components/pages/auth/login/login-form'; // Você criará este componente

export default function LoginPage() {
  return (
    <AuthLayout
      title="Acesse sua conta"
      subtitle="Gerencie seus agendamentos de forma inteligente!"
    >
      <LoginForm />
    </AuthLayout>
  );
}