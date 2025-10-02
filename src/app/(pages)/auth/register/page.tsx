import { AuthLayout } from '@/components/pages/auth';
import { RegisterForm } from '@/components/pages/auth/register/register-form';

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Comece a otimizar seu negócio hoje mesmo!"
    >
      <RegisterForm />
    </AuthLayout>
  );
}