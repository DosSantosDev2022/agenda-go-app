// components/services/service-actions.tsx
"use client";

import { ServiceListItem } from "@/actions/services/get-services";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui";
import { useDeleteService } from "@/hooks/services";
import { Edit, Loader2, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { ServiceEditModal } from "./service-edit-modal";

interface ServiceActionsProps {
  service: ServiceListItem;
}

/**
 * @description Componente de ações para cada serviço na tabela.
 */
const ServiceActions = ({ service }: ServiceActionsProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado para o modal de edição
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false); // Estado para o modal de exclusão

  const { mutate: deleteService, isPending: isDeleting } = useDeleteService();

  /**
   * @description Lógica de deleção, chamada após a confirmação no AlertDialog.
   */
  function handleDeleteConfirm() {
    deleteService(service.id, {
      onSuccess: () => {
        // Fechar o modal de confirmação após a tentativa de exclusão
        setIsDeleteConfirmOpen(false);
      }
      // o toast de sucesso ou erro é disparado dentro do useDeleteService
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isDeleting}>
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>

          {/* 1. (Abre o Modal de Edição) */}
          <DropdownMenuItem
            onClick={() => setIsEditModalOpen(true)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* 2. Deletar Serviço (Abre o AlertDialog de Confirmação) */}
          <DropdownMenuItem
            onClick={() => setIsDeleteConfirmOpen(true)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash className="mr-2 h-4 w-4" />
            )}
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal de Confirmação de Exclusão (Shadcn AlertDialog) */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o serviço
              <span className="font-semibold text-foreground"> {service.name} </span>
              e todas as referências futuras a ele.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Sim, Excluir"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ServiceEditModal
        service={service}
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
    </>
  );
}

export { ServiceActions };

