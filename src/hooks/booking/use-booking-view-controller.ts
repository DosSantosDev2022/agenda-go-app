// hooks/agenda/use-booking-view-controller.ts

import { BookingAgenda } from "@/actions/booking/get-booking";
import { useAppointmentsBookings } from "@/hooks/booking";
import {
  DayData,
  formatMonthYear,
  groupBookingsIntoCalendarDays,
} from "@/utils/full-calendar";
import {
  addMonths,
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useCallback, useMemo, useState } from "react";

/**
 * @description Hook de controle para o componente BookingView (CustomAgendaView).
 * Gerencia o estado do calendário (mês atual), busca de dados e modais.
 */
export function useBookingViewController() {
  // 1. Estados de UI
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Estados para o DayDetailsModal
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedDayBookings, setSelectedDayBookings] = useState<
    BookingAgenda[]
  >([]);

  // Estados para o BookingDetailsModal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingAgenda | null>(
    null,
  );

  // 2. Lógica de Data e Fetching

  // Calcula o range de datas para o mês visível
  const dateRange = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return {
      start: format(start, "yyyy-MM-dd"),
      end: format(end, "yyyy-MM-dd"),
    };
  }, [currentMonth]);

  // Busca os agendamentos para o range de datas
  const { data: rawBookings = [], isLoading } = useAppointmentsBookings(
    dateRange.start,
    dateRange.end,
  );

  // Agrupa os agendamentos nos dias do calendário (memorizado)
  const days: DayData[] = useMemo(() => {
    return groupBookingsIntoCalendarDays(currentMonth, rawBookings);
  }, [currentMonth, rawBookings]);

  // 3. Manipuladores de Navegação
  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentMonth(new Date());
  }, []);

  // 4. Manipuladores de Modais e Seleção

  // Abre o modal de detalhes do dia, armazena a data e a lista de agendamentos
  const handleDayClick = useCallback(
    (date: Date) => {
      const dayData = days.find((day) => day.date.getTime() === date.getTime());
      if (dayData) {
        setSelectedDay(dayData.date);
        setSelectedDayBookings(dayData.appointments);
        setIsDayModalOpen(true);
      }
    },
    [days],
  );

  // Lida com o clique em um agendamento individual (geralmente do DayDetailsModal)
  const handleBookingClick = useCallback(
    (bookingId: string) => {
      const booking = rawBookings.find((b) => b.id === bookingId);

      if (booking) {
        setSelectedBooking(booking);

        // Transiciona: fecha o modal do dia e abre o modal de detalhes do agendamento
        setIsDayModalOpen(false);
        setIsBookingModalOpen(true);
      } else {
        console.error(`Agendamento com ID ${bookingId} não encontrado.`);
      }
    },
    [rawBookings],
  );

  // Lógica para fechar o DayDetailsModal e o BookingDetailsModal
  const handleCloseDayModal = useCallback((open: boolean) => {
    setIsDayModalOpen(open);
    // Opcional: Limpar dados se o modal for fechado
    if (!open) {
      setSelectedDay(null);
      setSelectedDayBookings([]);
    }
  }, []);

  const handleCloseBookingModal = useCallback((open: boolean) => {
    setIsBookingModalOpen(open);
    // Opcional: Limpar dados se o modal for fechado
    if (!open) {
      setSelectedBooking(null);
    }
  }, []);

  // 5. Variáveis de Exibição Derivadas
  const monthYearDisplay = formatMonthYear(currentMonth);

  // 6. Retorno do Hook
  return {
    // Dados de Display
    days,
    isLoading,
    monthYearDisplay,

    // Handlers de Navegação
    goToPreviousMonth,
    goToNextMonth,
    goToToday,

    // Handlers de Clique
    handleDayClick,
    handleBookingClick,

    // Estados e Handlers dos Modais
    isDayModalOpen,
    isBookingModalOpen,
    selectedDay,
    selectedDayBookings,
    selectedBooking,
    onOpenDayModalChange: handleCloseDayModal,
    onOpenBookingModalChange: handleCloseBookingModal,
  };
}
