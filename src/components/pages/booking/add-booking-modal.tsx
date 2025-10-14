import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui";
import { CalendarPlus } from "lucide-react";
import { useState } from "react";
import { AddABookingForm } from "./add-booking-form";


/**
 * Componente de modal para adicionar novos agendamentos.
 *
 * Ele encapsula um componente Dialog que, quando acionado através de um botão,
 * exibe um conteúdo para a criação de um novo agendamento.
 *
 * @returns {JSX.Element} O componente de modal de agendamentos.
 */


const AddBookingsModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="space-x-2">
          <CalendarPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Novo Agendamento</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <AddABookingForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
export { AddBookingsModal };

