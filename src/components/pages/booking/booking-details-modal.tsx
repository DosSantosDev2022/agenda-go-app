// components/agenda/booking-details-modal.tsx
"use client";
import { BookingAgenda } from "@/actions/booking/get-booking";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useBookingDetailsController } from "@/hooks/booking";
import { formatBookingStatus, getStatusVariant } from "@/utils/format-status-booking";
import { Calendar, CircleCheck, Delete, Tag, TextAlignCenter, User } from "lucide-react";
import { DetailItem } from "./detail-item";

/**
 * @description Interface para as propriedades do BookingDetailsModal.
 */
interface BookingDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  // Recebe o objeto completo do agendamento conforme a tipagem simplificada
  booking: BookingAgenda | null;
}

/**
 * @description Modal que exibe os detalhes de um agendamento e a ação de notificação.
 * Utiliza dados já carregados no componente pai.
 * @param {BookingDetailsModalProps} props As propriedades do componente.
 * @returns {JSX.Element | null} O componente modal.
 */
export function BookingDetailsModal({ isOpen, onOpenChange, booking }: BookingDetailsModalProps) {

  if (!booking) return null;


  const {
    fullTimeRange,
    handleConfirmBooking,
    handleCancelBooking,
    currentStatus
    // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
  } = useBookingDetailsController(booking, onOpenChange);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Agendamento</DialogTitle>
          <DialogDescription>
            Informações básicas do agendamento e ações disponíveis.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4">

          {/* SEÇÃO PRINCIPAL (DATA/HORA/STATUS) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4 p-4 border rounded-xl bg-card/50 shadow-sm">
              <div className="flex items-center space-x-4">
                <Calendar className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="text-lg font-medium text-muted-foreground">Data e Hora</p>
                  <p className="text-2xl font-bold">
                    {fullTimeRange}
                  </p>
                </div>
              </div>
              <Badge variant={getStatusVariant(currentStatus)}>
                {formatBookingStatus(currentStatus)}
              </Badge>
            </div>
          </div>

          <Separator className="my-2" />

          {/* DETALHES GERAIS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Cliente */}
            <DetailItem
              icon={<User className="h-5 w-5" />}
              label="Cliente"
              value={booking.customerName}
            />

            {/* Serviço */}
            <DetailItem
              icon={<Tag className="h-5 w-5" />}
              label="Serviço Agendado"
              value={booking.serviceName}
            />

            {/* ID do Agendamento (opcional, mas útil para debug/referência) */}
            <DetailItem
              icon={<TextAlignCenter className="h-5 w-5" />}
              label="Observações do cliente"
              value={booking.notes || "Sem observações"}
              className="sm:col-span-2"
            />
          </div>
        </div>

        <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-start sm:space-x-2">
          {/* Botão de Ação: Enviar Notificação */}
          {/* <Button
            onClick={handleSendNotification}
            className="w-full sm:w-auto mt-2 sm:mt-0"
          >
            <Mail className="mr-2 h-4 w-4" />
            Enviar Lembrete
          </Button> */}

          {/* Botão de Fechar */}
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => handleConfirmBooking()}
            disabled={booking.status === 'CONFIRMED'}
          >
            <CircleCheck className="mr-2 h-4 w-4" />
            {booking.status === 'CONFIRMED' ? 'Agenda confirmada' : 'Confirmar agendamento'}
          </Button>

          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={() => handleCancelBooking()}
            disabled={booking.status === 'CANCELED'}
          >
            <Delete className="mr-2 h-4 w-4" />
            {booking.status === 'CANCELED' ? 'Agenda cancelada' : 'Cancelar agenda'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}