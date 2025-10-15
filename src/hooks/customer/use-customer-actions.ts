// src/hooks/customer/use-customer-actions.ts

import { CustomerListItem } from "@/types/customers";
import { useState } from "react";

/**
 * @description Hook customizado para gerenciar a abertura/fechamento
 * do modal de ações de cliente e o cliente selecionado.
 *
 * @returns Objeto com o estado e funções de controle.
 */
export function useCustomerActions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerListItem | null>(null);

  /**
   * @description Função para abrir o modal e definir o cliente.
   * @param customer O objeto do cliente selecionado.
   */
  const handleOpenActionsModal = (customer: CustomerListItem) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  /**
   * @description Função para fechar o modal e limpar o cliente selecionado.
   */
  const handleCloseActionsModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  return {
    isModalOpen,
    selectedCustomer,
    handleOpenActionsModal,
    handleCloseActionsModal,
  };
}
