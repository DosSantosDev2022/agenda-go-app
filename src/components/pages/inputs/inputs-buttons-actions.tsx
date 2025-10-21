// components/inputs/inputs-button-actions.tsx (FINAL E OTIMIZADO)

'use client'

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger, Button,
} from "@/components/ui/index";
import { useDeleteInput } from "@/hooks/inputs/mutations/use-delete-input";
import { InputsListItem } from "@/types/inputs"; // Tipo do insumo
import { Loader2, Trash } from "lucide-react";
import { EditInputDialogPrefilled } from "./edit-input-dialog-prefilled"; // Novo componente

/**
 * @typedef {object} InputsButtonActionsProps
 * @property {InputsListItem} inputItem - O objeto completo do insumo, contendo todos os dados necessários (ID, nome, quantidade) para as ações de edição e deleção.
 */
interface InputsButtonActionsProps {
  inputItem: InputsListItem; // RECEBE O OBJETO COMPLETO
}

/**
 * Componente que agrupa as ações de um único item de insumo, incluindo a edição via modal pré-preenchido e a deleção com confirmação via AlertDialog.
 *
 * Ele utiliza o hook de mutação `useDeleteInput` para gerenciar o estado assíncrono da deleção.
 * @param {InputsButtonActionsProps} props - As propriedades do componente.
 * @returns {JSX.Element} - Uma div contendo o botão de Edição e o botão/modal de Deleção.
 */
const InputsButtonActions = ({ inputItem }: InputsButtonActionsProps) => {
  // Lógica de Deleção
  /**
   * Hook do React Query para lidar com a deleção do insumo.
   * `mutate` é a função para disparar a deleção.
   * `isPending` é o estado que indica se a operação está em andamento.
   */
  const { mutate: deleteInput, isPending: isDeleting } = useDeleteInput();

  /**
   * Handler que dispara a mutação de deleção, utilizando o ID do insumo.
   * @returns {void}
   */
  const handleDeleteConfirm = () => {
    deleteInput({ id: inputItem.id }); // Usa o ID do objeto recebido
  }

  return (
    <div className="flex items-center gap-1">

      {/* 1. Botão de Edição  */}
      <EditInputDialogPrefilled inputItem={inputItem} />

      {/* 2. Botão de Deleção */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin text-red-500" />
            ) : (
              <Trash className="h-4 w-4 text-red-500 hover:text-red-600" />
            )}
          </Button>
        </AlertDialogTrigger>

        {/* Conteúdo do AlertDialog */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá remover permanentemente o insumo **{inputItem.name}** do seu inventário.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deletando...
                </>
              ) : (
                "Sim, Deletar Insumo"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export { InputsButtonActions };

