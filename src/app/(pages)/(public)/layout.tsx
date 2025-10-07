// app/onboarding/layout.tsx

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Wrapper que ocupa a tela toda e remove o scroll.
    <div className="overflow-auto h-screen scrollbar-custom">
      {children}
    </div>
  );
}