"use client"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui";
import { useState } from "react";
import { InputForm } from "./input-form";

/**
 * Componente funcional para adicionar novos insumos.
 * Ele gerencia a abertura e fechamento de um modal (Dialog) que contém um formulário de adição.
 * * @returns {JSX.Element} - O componente de botão que dispara o modal de adição de insumo.
 */
const AddInputs = () => {

  /**
   * Estado que controla se o modal de adição de insumo está aberto ou fechado.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Função de callback executada após o sucesso da submissão do formulário.
   * Fecha o modal (Dialog) definindo 'isOpen' para false.
   * @returns {void}
   */
  const handleSuccess = () => {
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar novo insumo</DialogTitle>
        </DialogHeader>
        <InputForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}

export { AddInputs };
