// app/onboarding/layout.tsx

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Wrapper que ocupa a tela toda e remove o scroll.
    <div className="flex items-center justify-center w-full min-h-screen overflow-hidden">
      {children}
    </div>
  );
}