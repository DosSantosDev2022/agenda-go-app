// components/agenda/custom-agenda-view.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useBookingViewController } from "@/hooks/booking";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AddBookingsModal } from "./add-booking-modal";
import { BookingDetailsModal } from "./booking-details-modal"; // Reutilizando os modais
import { CalendarGrid } from "./calendar-grid";
import { DayDetailsModal } from "./day-details-modal";

/**
 * @description Componente principal da Agenda, possui um formato de calendário renderizando os agendamentos de cada dia do mês.
 */
const BookingView = () => {
  const {
    // Dados
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

    // Modais
    isDayModalOpen,
    isBookingModalOpen,
    selectedDay,
    selectedDayBookings,
    selectedBooking,
    onOpenDayModalChange,
    onOpenBookingModalChange,
  } = useBookingViewController();


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
            {monthYearDisplay}
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
        onOpenChange={onOpenDayModalChange}
        date={selectedDay}
        bookings={selectedDayBookings}
        onBookingClick={handleBookingClick}
      />
      <BookingDetailsModal
        isOpen={isBookingModalOpen}
        onOpenChange={onOpenBookingModalChange}
        booking={selectedBooking || null}
      />
    </div>
  );
}

export { BookingView };
