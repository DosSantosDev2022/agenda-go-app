// components/agenda/custom-agenda-view.tsx
"use client";

import { BookingAgenda } from "@/actions/booking/get-booking";
import { Button } from "@/components/ui/button";
import { useAppointmentsBookings } from "@/hooks";
import { DayData, formatMonthYear, groupBookingsIntoCalendarDays } from "@/utils/full-calendar";
import { addMonths, endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { AddBookingsModal } from "./add-booking-modal";
import { BookingDetailsModal } from "./booking-details-modal"; // Reutilizando os modais
import { CalendarGrid } from "./calendar-grid";
import { DayDetailsModal } from "./day-details-modal";

/**
 * @description Componente principal da Agenda, possui um formato de calendário renderizando os agendamentos de cada dia do mês.
 */
export function BookingView() {
  // Estado para o mês atual
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // Para controlar o DayDetailsModal
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  // Para armazenar a data do dia clicado
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  // Para armazenar os agendamentos do dia clicado
  const [selectedDayBookings, setSelectedDayBookings] = useState<BookingAgenda[]>([]);
  // Estado para os modais (Reutilizado)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  // Para armazenar o objeto de agendamento completo selecionado
  const [selectedBooking, setSelectedBooking] = useState<BookingAgenda | null>(null);

  // 1. Calcular o range de datas para a Server Action (início/fim do mês exibido)
  const dateRange = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return {
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd'),
    };
  }, [currentMonth]);

  // 2. DATA FETCHING: Busca os agendamentos
  const { data: rawBookings = [], isLoading } = useAppointmentsBookings(dateRange.start, dateRange.end);

  // 3. Agrupa os agendamentos nos dias do calendário
  const days: DayData[] = useMemo(() => {
    return groupBookingsIntoCalendarDays(currentMonth, rawBookings);
  }, [currentMonth, rawBookings]);


  // Manipuladores de Navegação
  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth(prev => subMonths(prev, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(prev => addMonths(prev, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentMonth(new Date());
  }, []);

  // Manipulador de Clique no Dia
  const handleDayClick = useCallback((date: Date) => {

    // 1. Encontra o objeto DayData completo para o dia clicado
    const dayData = days.find(day => day.date.getTime() === date.getTime());
    if (dayData) {
      // 2. Armazena os agendamentos e a data
      setSelectedDay(dayData.date);
      setSelectedDayBookings(dayData.appointments);
      setIsDayModalOpen(true);
    }
  }, [days]);


  const handleBookingClick = useCallback((bookingId: string) => {
    // 1. Encontra o objeto completo na lista geral (rawBookings)
    // O array rawBookings é usado aqui, então ele deve estar nas dependências do useCallback
    const booking = rawBookings.find(b => b.id === bookingId);

    if (booking) {
      // 2. Armazena o objeto de agendamento COMPLETO
      setSelectedBooking(booking);

      // 3. Fecha o DayDetailsModal
      setIsDayModalOpen(false);

      // 4. Abre o BookingDetailsModal
      setIsBookingModalOpen(true);
    } else {
      // Opcional: Tratar caso o ID não seja encontrado (muito raro se a lógica estiver correta)
      console.error(`Agendamento com ID ${bookingId} não encontrado.`);
    }
  }, [rawBookings])


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* HEADER DE NAVEGAÇÃO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">

        {/* Botões de Navegação e Mês/Ano */}
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth} aria-label="Mês Anterior">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth} aria-label="Próximo Mês">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={goToToday}>Hoje</Button>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight capitalize ml-4">
            {formatMonthYear(currentMonth)}
          </h1>
        </div>

        {/* Modal para adicionar um novo agendamento */}
        <AddBookingsModal />
      </div>

      {/* CORPO DO CALENDÁRIO */}
      <div className="bg-card rounded-lg shadow-xl overflow-hidden border border-border">
        {isLoading ? (
          // TODO: Substituir por um spinner ShadcnUI
          <div className="p-8 text-center text-muted-foreground">Carregando agenda...</div>
        ) : (
          <CalendarGrid days={days} onDayClick={handleDayClick} />
        )}
      </div>

      {/* Modais (reutilizados) */}
      <DayDetailsModal
        isOpen={isDayModalOpen}
        onOpenChange={setIsDayModalOpen}
        date={selectedDay}
        bookings={selectedDayBookings}
        onBookingClick={handleBookingClick}
      />
      <BookingDetailsModal
        isOpen={isBookingModalOpen}
        onOpenChange={setIsBookingModalOpen}
        booking={selectedBooking || null}
      />
    </div>
  );
}