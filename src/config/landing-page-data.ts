// config/landing-page-data.ts

import {
  BarChart3,
  CalendarCheck,
  Clock,
  DollarSign,
  Lock,
  Zap,
} from "lucide-react";

// Tipagem para os Cards de Funcionalidades
export interface FeatureCard {
  icon: React.ElementType; // Para usar ícones do Lucide-React
  title: string;
  description: string;
}

// Tipagem para os Planos de Preços
export interface PricingPlan {
  name: string;
  price: string;
  billingCycle: string;
  features: string[];
  isHighlighted: boolean;
}

// Tipagem para Perguntas Frequentes
export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * @description Todos os dados de conteúdo da Landing Page (Agenda GO).
 */
export const landingPageData = {
  // --- Seção Hero ---
  hero: {
    title: "Agenda GO: Otimize seus agendamentos e seu tempo.",
    subtitle:
      "A solução completa para profissionais e pequenos negócios gerenciarem horários, clientes e serviços de forma inteligente e sem complicação.",
    ctaPrimary: "Comece Grátis por 7 dias",
    ctaSecondary: "Acessar sua conta",
  },

  // --- Seção de Funcionalidades ---
  features: {
    heading: "Por que escolher o Agenda GO?",
    subheading: "Recursos que elevam a gestão do seu negócio ao próximo nível.",
    cards: [
      {
        icon: CalendarCheck,
        title: "Agendamento Online 24/7",
        description:
          "Permita que seus clientes agendem a qualquer hora, reduzindo o tempo gasto com ligações e mensagens.",
      },
      {
        icon: Zap,
        title: "Notificações Automáticas",
        description:
          "Reduza faltas e esquecimentos com lembretes automáticos via e-mail ou WhatsApp, otimizando sua taxa de ocupação.",
      },
      {
        icon: BarChart3,
        title: "Relatórios financeiros",
        description:
          "Tenha uma visão clara da sua renda, gastos e faturamento do seu negócio em tempo real.",
      },
      {
        icon: Clock,
        title: "Gestão Inteligente de Tempo",
        description:
          "Bloqueie horários de almoço, defina buffers entre serviços e evite conflitos de agenda automaticamente.",
      },
      {
        icon: Lock,
        title: "Segurança de Dados",
        description:
          "Seus dados e os de seus clientes estão protegidos com criptografia de ponta e backups regulares na nuvem.",
      },
      {
        icon: DollarSign,
        title: "Controle Financeiro",
        description:
          "Registre pagamentos, gerencie o fluxo de caixa e tenha um histórico financeiro detalhado de cada cliente.",
      },
    ] as FeatureCard[],
  },

  // --- Seção de Preços ---
  pricing: {
    heading: "Planos que cabem no seu bolso.",
    subheading: "Comece com o plano gratuito e evolua junto com o seu negócio.",
    plans: [
      {
        name: "Teste (1 mês Grátis)",
        price: "R$ 0",
        billingCycle: "/mês",
        features: [
          "1 Usuário",
          "Agendamentos ilimitados",
          "Cadastro de 10 serviços",
          "Suporte por e-mail (24h)",
        ],
        isHighlighted: false,
      },
      {
        name: "Profissional",
        price: "R$ 29,90",
        billingCycle: "/mês",
        features: [
          "2 Usuários (colaboradores)",
          "Agendamentos ilimitados",
          "Cadastro ilimitado de serviços",
          "Gestão de insumos para seu negócio",
          "Gestão financeira completa",
          "Relatórios e estatísticas",
        ],
        isHighlighted: true,
      },
      {
        name: "Empresarial",
        price: "R$ 79,90",
        billingCycle: "/mês",
        features: [
          "5 Usuários (colaboradores)",
          "Todos os recursos do Profissional",
          "Confirmações de agendamentos automáticas",
          "Integração com Google calendar",
          "Suporte via WhatsApp",
        ],
        isHighlighted: false,
      },
    ] as PricingPlan[],
  },

  // --- Seção de Perguntas Frequentes ---
  faq: {
    heading: "Perguntas Frequentes",
    items: [
      {
        question: "O Agenda GO oferece teste grátis?",
        answer:
          "Sim! Você pode começar com nosso Plano Básico totalmente gratuito por 30 dias, já com diversas funcionalidades liberadas para testar.",
      },
      {
        question: "Preciso de cartão de crédito para começar o teste?",
        answer:
          "Não. Para o Plano Básico grátis não exigimos cartão de crédito. Você só precisará cadastrar um método de pagamento se optar por um plano pago após o teste.",
      },
      {
        question: "Posso cancelar minha assinatura a qualquer momento?",
        answer:
          "Sim, a assinatura é mensal e você pode cancelar diretamente no painel de configurações sem multas ou taxas adicionais.",
      },
      {
        question: "O sistema é compatível com meu celular?",
        answer:
          "Absolutamente! O Agenda GO é totalmente responsivo e funciona perfeitamente em smartphones, tablets e desktops.",
      },
    ] as FAQItem[],
  },

  // --- Seção de CTA Final ---
  finalCta: {
    title: "Pronto para revolucionar seus agendamentos?",
    subtitle:
      "Junte-se a centenas de profissionais que já usam o Agenda GO para crescer seus negócios.",
    ctaText: "Comece o seu teste grátis agora!",
  },
};
