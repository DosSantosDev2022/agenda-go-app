// components/services/service-details-modal.tsx
"use client";

import { ServiceListItem } from "@/actions";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui";
import { EditServiceForm } from "./service-edit-form";

interface ServiceDetailsModalProps {
  service: ServiceListItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * @description Modal que exibe os detalhes de um serviço e permite a edição.
 */
const ServiceEditModal = ({ isOpen, onOpenChange, service }: ServiceDetailsModalProps) => {


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Serviço</DialogTitle>
          <DialogDescription>
            Altere os detalhes do serviço.
          </DialogDescription>
        </DialogHeader>
        <EditServiceForm service={service} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

export { ServiceEditModal };

