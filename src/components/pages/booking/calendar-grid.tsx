// components/agenda/calendar-grid.tsx
"use client";

import { cn } from "@/lib/utils";
import { DayData, getWeekdays } from "@/utils/full-calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarGridProps {
  days: DayData[];
  onDayClick: (date: Date) => void;
}

/**
 * @description Renderiza a grade de dias do calendário (corpo).
 * @param {CalendarGridProps} props - Propriedades contendo os dias e o callback de clique.
 */
const CalendarGrid = ({ days, onDayClick }: CalendarGridProps) => {
  const weekdays = getWeekdays();

  return (
    <div className="flex flex-col">
      {/* Cabeçalho dos Dias da Semana */}
      <div className="grid grid-cols-7 border-b border-t border-border">
        {weekdays.map((day, index) => (
          <div
            key={index}
            className="p-3 text-center text-sm font-semibold text-muted-foreground uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grade de Dias */}
      <div className="grid grid-cols-7 border-l border-border">
        {days.map((day, index) => (
          // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div
            key={index}
            // Responsividade e Estilização
            className={cn(
              "relative border-r border-b border-border h-16 sm:h-22 md:h-24", // Altura responsiva!
              "group p-1 sm:p-2 transition-colors duration-100 cursor-pointer",
              "hover:bg-accent/50",
              // Se não for do mês atual, desfoque.
              !day.isCurrentMonth && "bg-muted/30 text-muted-foreground/60",
              // Dia de Hoje
              day.isToday && "bg-primary/10 hover:bg-primary/20",
            )}
            onClick={() => onDayClick(day.date)}
          >
            {/* Número do Dia */}
            <div
              className={cn(
                "absolute top-1 right-1 sm:top-2 sm:right-2 flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium",
                day.isToday && "bg-primary text-primary-foreground",
                !day.isCurrentMonth && "text-muted-foreground/60",
              )}
            >
              {format(day.date, "d", { locale: ptBR })}
            </div>

            {/* Marcador de Agendamentos */}
            {day.appointmentsCount > 0 && (
              <div
                className={cn(
                  "absolute bottom-1 left-1 sm:bottom-2 sm:left-2 text-xs font-semibold px-2 py-1 rounded-full",
                  "bg-green-500/20 text-green-700 dark:bg-green-400/20 dark:text-green-300",
                  "flex items-center space-x-1" // Para alinhar o contador e o texto
                )}
              >
                {/* 1. Contador: SEMPRE VISÍVEL no mobile e desktop */}
                <span className="font-bold">{day.appointmentsCount}</span>

                {/* 2. Texto descritivo: OCULTO no mobile, VISÍVEL em telas médias (md) e maiores */}
                <span className="hidden md:inline-block">
                  Agendado(s)
                </span>
              </div>
            )}

            {/* TODO: Renderizar Agendamentos em pequenos cards/bolinhas aqui (para visualização completa) */}

          </div>
        ))}
      </div>
    </div>
  );
}

export { CalendarGrid };
