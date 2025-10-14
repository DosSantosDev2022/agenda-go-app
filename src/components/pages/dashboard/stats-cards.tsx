// components/dashboard/stats-cards.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { formatPrice } from "@/utils";
import { CalendarCheck, DollarSign, Users } from "lucide-react";

interface StatsCardsProps {
  totalBookings: number;
  totalCustomers: number;
  totalRevenue: number;
}


/**
 * @description Componente de exibição de cartões de estatísticas principais.
 * @param {StatsCardsProps} props - Propriedades contendo as métricas do dashboard.
 */
const StatsCards = ({
  totalBookings,
  totalCustomers,
  totalRevenue,
}: StatsCardsProps) => {
  const stats = [
    {
      title: "Receita Potencial",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      description: "Agendamentos confirmados e pendentes.",
    },
    {
      title: "Total de Agendamentos",
      value: totalBookings.toString(),
      icon: CalendarCheck,
      description: "Agendamentos ativos (confirmados/pendentes).",
    },
    {
      title: "Total de Clientes",
      value: totalCustomers.toString(),
      icon: Users,
      description: "Clientes cadastrados no seu negócio.",
    },
  ];

  return (
    // Grid responsivo: 1 coluna em mobile, 2 em tablet, 3 em desktop
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export { StatsCards };

