// components/dashboard/recent-bookings.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookingWithServiceAndCustomer } from "@/services/dashboard-data";
import { formatBookingStatus, getStatusVariant } from "@/utils/format-status-booking";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RecentBookingsProps {
  recentBookings: BookingWithServiceAndCustomer[];
}



/**
 * @description Componente de exibição da lista de agendamentos recentes.
 * @param {RecentBookingsProps} props - Propriedades contendo a lista de agendamentos.
 */
export function RecentBookings({ recentBookings }: RecentBookingsProps) {
  if (recentBookings.length === 0) {
    return (
      <div className="p-6 border rounded-lg text-center text-muted-foreground">
        Nenhum agendamento encontrado.
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Serviço</TableHead>
            <TableHead>Data e Hora</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentBookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                {booking.customer.name}
              </TableCell>
              <TableCell>{booking.service.name}</TableCell>
              <TableCell>
                {format(booking.startTime, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </TableCell>
              <TableCell className="text-right">
                <Badge variant={getStatusVariant(booking.status)}>
                  {formatBookingStatus(booking.status)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}