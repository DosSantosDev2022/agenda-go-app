// components/services/new-service-button.tsx
"use client";

import { AddServiceForm } from "@/components/pages/services";
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui";
import { Plus } from "lucide-react";
import { useState } from "react";

/**
 * @description Botão que abre um modal para cadastrar um novo serviço.
 */
const AddServiceModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Serviço
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Serviço</DialogTitle>
          <DialogDescription>
            Preencha os detalhes para adicionar um novo serviço ao seu catálogo.
          </DialogDescription>
        </DialogHeader>
        {/* Passa a função para fechar o modal após o sucesso */}
        <AddServiceForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export { AddServiceModal };

