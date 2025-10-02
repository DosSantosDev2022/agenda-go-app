import { OnboardingForm } from "@/components/pages/onboarding/onboarding-form";

export default function OnboardingPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">Configure seu Negócio</h1>
        <p className="text-muted-foreground text-center mb-6">
          Precisamos de algumas informações para criar sua página de agendamento.
        </p>
        <OnboardingForm />
      </div>
    </div>
  );
}