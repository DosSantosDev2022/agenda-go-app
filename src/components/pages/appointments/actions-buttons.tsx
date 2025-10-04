'use client'
import { Button } from "@/components/ui"
import { AddAppointmentsModal } from "./add-appointments-modal"


/**
 * Componente que exibe botões de ação para a tela de agendamentos.
 * Inclui um botão para criar um novo agendamento e botões para alternar
 * entre as visualizações de Mês, Semana e Dia.
 *
 * @returns {JSX.Element} Um elemento div contendo os botões de ação.
 */
const ActionsButtons = () => {
  return (
    <div className="flex items-center space-x-2">
      <AddAppointmentsModal />
      {/* TODO: Implementar botões de Mês/Semana/Dia (TimeGrid) aqui */}
      <Button variant="secondary" size="sm">Mês</Button>
      <Button variant="outline" size="sm" disabled>Semana</Button>
      <Button variant="outline" size="sm" disabled>Dia</Button>
    </div>
  )
}


export { ActionsButtons }

