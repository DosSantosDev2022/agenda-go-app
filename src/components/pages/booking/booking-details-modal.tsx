// components/agenda/booking-details-modal.tsx
"use client";

// Nota: Assumimos que a interface BookingAgenda está definida em um local acessível,
// ou que o 'get-appointments' a exporta, como no componente pai.
// Para este arquivo, a importação pode ser:
import { BookingAgenda } from "@/actions/booking/get-booking";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatBookingStatus, getStatusVariant } from "@/utils/format-status-booking";
import { format } from "date-fns";
import { Calendar, Hash, Mail, Tag, User } from "lucide-react";

/**
 * @description Interface para as propriedades do BookingDetailsModal.
 */
interface BookingDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  // Recebe o objeto completo do agendamento conforme a tipagem simplificada
  booking: BookingAgenda | null;
}

// --- Componente auxiliar DetailItem (mantido) ---

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value, className = "" }) => (
  <div className={`flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors ${className}`}>
    <div className="text-primary mt-1">{icon}</div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold text-foreground break-words">{value}</p>
    </div>
  </div>
);

// --- Componente principal ---

/**
 * @description Modal que exibe os detalhes de um agendamento e a ação de notificação.
 * Utiliza dados já carregados no componente pai.
 * @param {BookingDetailsModalProps} props As propriedades do componente.
 * @returns {JSX.Element | null} O componente modal.
 */
export function BookingDetailsModal({ isOpen, onOpenChange, booking }: BookingDetailsModalProps) {

  if (!booking) return null;

  // Converte Date objects (startTime/endTime) para strings formatadas
  const formatTime = (date: Date) => {
    return format(date, 'HH:mm');
  }


  const handleSendNotification = () => {
    console.log(`Notificação de lembrete solicitada para o agendamento ID: ${booking.id}`);
    // TODO: Chamar Server Action para enviar notificação
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
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
                    {/* Formata a data: 15/10 | 09:00 - 10:00 */}
                    {format(booking.startTime, "dd/MM")} | {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                  </p>
                </div>
              </div>
              <Badge variant={getStatusVariant(booking.status)}>
                {formatBookingStatus(booking.status)}
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
              icon={<Hash className="h-5 w-5" />}
              label="ID do Agendamento"
              value={booking.id}
              className="sm:col-span-2"
            />
          </div>
        </div>

        <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          {/* Botão de Ação: Enviar Notificação */}
          <Button
            onClick={handleSendNotification}
            className="w-full sm:w-auto mt-2 sm:mt-0"
          >
            <Mail className="mr-2 h-4 w-4" />
            Enviar Lembrete
          </Button>

          {/* Botão de Fechar */}
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}