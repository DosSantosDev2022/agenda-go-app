'use client';

import {
  Button,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/index";
import { InputsListItem } from "@/types/inputs";
import { UpdateInputFormValues } from "@/types/schema/zod-input-schema";
import { Edit } from "lucide-react";
import { useState } from "react";
import { InputForm } from "./input-form";

/**
 * @typedef {object} EditInputDialogProps
 * @property {InputsListItem} inputItem - O objeto completo do insumo a ser editado, tipicamente vindo de uma lista ou tabela.
 */
interface EditInputDialogProps {
  inputItem: InputsListItem; // Recebe o objeto completo da tabela
}

/**
 * Componente Wrapper que exibe um modal (Dialog) para edição de um insumo.
 * O formulário interno é pré-preenchido com os dados do insumo fornecido via props.
 * * @param {EditInputDialogProps} props - As propriedades do componente.
 * @returns {JSX.Element} - Um botão que, ao ser clicado, abre o modal de edição.
 */
const EditInputDialogPrefilled = ({ inputItem }: EditInputDialogProps) => {
  /**
   * Estado que controla se o modal de diálogo de edição está aberto ou fechado.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mapeia os dados do insumo da lista para o formato de edição
  /**
   * Dados iniciais do formulário extraídos do item da lista.
   * @type {UpdateInputFormValues}
   */
  const initialData: UpdateInputFormValues = {
    id: inputItem.id,
    name: inputItem.name,
    quantity: inputItem.quantity,
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={'ghost'}
          size="icon"
        >
          <Edit className="h-4 w-4 text-primary" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Insumo</DialogTitle>
        </DialogHeader>

        {/* O formulário é renderizado instantaneamente com os dados pré-preenchidos */}
        <InputForm
          initialData={initialData}
          onSuccess={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export { EditInputDialogPrefilled };

