// components/pages/dashboard/monthly-revenue-chart.tsx
"use client";

import { MonthlyRevenueData } from "@/actions/dashboard/dashboard-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { formatPrice } from "@/utils";
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";

/**
 * @interface MonthlyRevenueChartProps
 * @description Propriedades para o componente MonthlyRevenueChart.
 * @property {MonthlyRevenueData[]} data - Array de dados de receita mensal.
 */
interface MonthlyRevenueChartProps {
  data: MonthlyRevenueData[];
}

/**
 * @description Componente de gráfico de colunas para exibir a receita mensal.
 * Ele é um componente cliente e utiliza Recharts para renderização.
 * @param {MonthlyRevenueChartProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente de gráfico de receita mensal.
 */
const MonthlyRevenueChart = ({ data }: MonthlyRevenueChartProps) => {

  const CustomLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width / 2}
        y={y}
        dy={-10} // Desloca o texto para cima, longe da barra
        fill="var(--foreground)"
        fontSize={12}
        fontWeight="bold"
        textAnchor="middle" // Alinha o texto no centro
      >
        {formatPrice(value)}
      </text>
    );
  };

  return (
    <Card className="col-span-1 h-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Receita Mensal (Últimos 12 Meses)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[250px] md:h-[300px] p-4 pt-0">
        <ResponsiveContainer width="100%" height="100%">
          {data.length > 0 ? (
            <BarChart data={data}>
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                // Formata o valor do eixo Y para ser mais legível (ex: R$ 1k, R$ 5k)
                tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
              />

              <Bar dataKey="totalRevenue" fill="var(--chart-4)" radius={[4, 4, 0, 0]}>
                <LabelList position="top" content={CustomLabel} />
              </Bar>
            </BarChart>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Nenhuma receita confirmada nos últimos 12 meses.
            </div>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export { MonthlyRevenueChart };

