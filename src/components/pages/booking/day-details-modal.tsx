// components/agenda/day-details-modal.tsx (Esboço ShadcnUI)
"use client";

import { BookingAgenda } from "@/actions/booking/get-booking";
import { Badge, ScrollArea } from "@/components/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatBookingStatus, getStatusVariant } from "@/utils/format-status-booking";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock } from "lucide-react";

interface DayDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  bookings: BookingAgenda[];
  onBookingClick: (bookingId: string) => void;
}

export function DayDetailsModal({ isOpen, onOpenChange, date, bookings, onBookingClick }: DayDetailsModalProps) {
  if (!date) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Agendamentos para {format(date, 'EEEE, dd/MM', { locale: ptBR })}
          </DialogTitle>
        </DialogHeader>

        {/* Corpo do Modal - Lista de Agendamentos */}
        <ScrollArea className="h-72 pr-4">
          {bookings.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">Nenhum agendamento para este dia.</p>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <button
                  type="button"
                  key={booking.id}
                  className="w-full px-3 py-1.5 border rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                  onClick={() => onBookingClick(booking.id)}
                >
                  <div className="font-semibold text-base flex justify-between items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    {format(booking.startTime, 'HH:mm')} - {booking.customerName}
                    <Badge variant={getStatusVariant(booking.status)}>
                      {formatBookingStatus(booking.status)}
                    </Badge>
                  </div>
                  <div className="mt-1">
                    <p className="text-sm text-muted-foreground">{booking.serviceName}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}