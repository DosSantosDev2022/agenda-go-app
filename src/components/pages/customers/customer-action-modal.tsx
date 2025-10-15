// src/components/customers/customer-action-modal.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { CustomerListItem } from "@/types/customers";
import { Gift, Percent, Send, Zap } from "lucide-react";
// NOVO IMPORT
import { CustomerDiscountForm } from "@/components/pages/customers/customer-discount-form";
import { useState } from "react";

// Estado para controlar qual aba está ativa dentro do modal
type ModalView = "MAIN_MENU" | "DISCOUNT_FORM" | "FREE_SERVICE_FORM";

interface CustomerActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerListItem | null;
}

/**
 * @description Modal de ações específicas para um cliente, com opções de recompensa.
 */
export function CustomerActionModal({
  isOpen,
  onClose,
  customer,
}: CustomerActionModalProps) {

  const [view, setView] = useState<ModalView>("MAIN_MENU");

  // Resetar a view ao fechar/abrir o modal
  const handleClose = () => {
    setView("MAIN_MENU");
    onClose();
  };

  if (!customer) return null;

  // Renderiza o formulário de desconto
  const renderDiscountForm = () => (
    <div className="pt-2">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <Gift className="h-5 w-5 mr-2 text-primary" /> Desconto para {customer.name}
      </h3>
      <CustomerDiscountForm customer={customer} onSuccess={handleClose} />
      <Button variant="ghost" onClick={() => setView("MAIN_MENU")} className="mt-4 w-full">
        Voltar para o Menu
      </Button>
    </div>
  );

  // Renderiza o menu principal
  const renderMainMenu = () => (
    <div className="flex flex-col space-y-4 pt-2">
      {/* Opção 1: Desconto (AGORA MUDA A VIEW) */}
      <Button
        onClick={() => setView("DISCOUNT_FORM")}
        variant="default"
        className="w-full justify-start h-12"
      >
        <Percent className="h-5 w-5 mr-3" />
        Enviar Desconto ao Cliente
      </Button>

      <Separator />

      {/* Opção 2: Gratuidade (Mantido como placeholder) */}
      <Button
        onClick={() => console.log("Implementar lógica de Serviço Gratuito")}
        variant="outline"
        className="w-full justify-start h-12"
        disabled
      >
        <Zap className="h-5 w-5 mr-3 text-amber-500" />
        Ofertar um Serviço Gratuito (Em breve)
      </Button>

      {/* Opção 3: Mensagem (Mantido como placeholder) */}
      <Button
        onClick={() => console.log("Implementar lógica de Mensagem")}
        variant="ghost"
        className="w-full justify-start h-12"
        disabled
      >
        <Send className="h-5 w-5 mr-3" />
        Enviar Mensagem de Agradecimento (Em breve)
      </Button>
    </div>
  );

  return (
    // Usa handleClose para resetar o estado interno ao fechar
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ações para {customer.name}</DialogTitle>
          <DialogDescription>
            {view === "MAIN_MENU"
              ? "Escolha uma recompensa para o cliente fiel."
              : "Defina a porcentagem do desconto e envie."}
          </DialogDescription>
        </DialogHeader>

        {/* Renderização condicional da view */}
        {view === "MAIN_MENU" && renderMainMenu()}
        {view === "DISCOUNT_FORM" && renderDiscountForm()}
      </DialogContent>
    </Dialog>
  );
}