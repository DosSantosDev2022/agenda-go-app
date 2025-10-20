"use client"
import { DialogTrigger, Dialog, DialogContent, Button, DialogHeader, DialogTitle } from "@/components/ui"
import { AddInputForm } from "./add-input-form"
import { useState } from "react";


const AddInputs = () => {

  const [isOpen, setIsOpen] = useState(false);

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
        <AddInputForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}

export { AddInputs }