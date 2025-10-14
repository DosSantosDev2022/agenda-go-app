// components/onboarding/working-hours-input.tsx
'use client';

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { WorkingHour, WorkingHoursArray } from '@/types/schema/working-hours';
import { Clock } from 'lucide-react';
import { Control, useFieldArray, useWatch } from 'react-hook-form';

// Tipagem para as props
interface WorkingHoursInputProps {
  control: Control<any>; // Usamos 'any' aqui para facilitar a integração com o formulário pai
  name: string; // O nome do campo no formulário pai, ex: 'workingHours'
}

// Mapeamento dos dias para exibição
const dayLabels = {
  MONDAY: 'Segunda-feira',
  TUESDAY: 'Terça-feira',
  WEDNESDAY: 'Quarta-feira',
  THURSDAY: 'Quinta-feira',
  FRIDAY: 'Sexta-feira',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
};

/**
 * @description Componente para definir os horários de trabalho semanais.
 * @param {WorkingHoursInputProps} props - Props do componente.
 */
const WorkingHoursInput = ({ control, name }: WorkingHoursInputProps) => {
  // useFieldArray gerencia a lista de dias dentro do RHF
  const { fields } = useFieldArray({
    control,
    name,
  });

  // useWatch observa o valor de um campo para renderização condicional
  const workingHours = useWatch({
    control,
    name,
  }) as WorkingHoursArray;

  return (
    <div className="space-y-4 pt-2">
      <p className="text-sm font-medium text-muted-foreground">Defina seu horário de atendimento padrão.</p>

      {fields.map((field, index) => {

        const typedField = field as WorkingHour & { id: string };
        // Objeto que representa o horário do dia atual
        // Agora podemos acessar 'day' e 'isWorking' sem o erro TS2339
        const dayWorkingHours = workingHours.find(item => item.day === typedField.day);

        const isWorking = dayWorkingHours?.isWorking ?? false;

        const dayLabel = dayLabels[typedField.day];

        return (
          <div key={typedField.id} className="flex items-start space-x-4 p-3 border rounded-lg bg-background">

            {/* 1. SELEÇÃO DE DIA DE TRABALHO (SWITCH) */}
            <div className="flex flex-col items-center justify-start pt-1">
              <FormField
                control={control}
                name={`${name}.${index}.isWorking`}
                render={({ field: switchField }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-2">
                    <FormControl>
                      <Switch
                        checked={switchField.value}
                        onCheckedChange={switchField.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className='flex justify-between items-center'>
                <Label className="text-sm font-semibold">{dayLabel}</Label>
              </div>

              {/* 2. CAMPOS DE HORA (RENDERIZAÇÃO CONDICIONAL) */}
              {isWorking ? (
                <div className="mt-2 grid grid-cols-2 gap-4">

                  {/* HORA DE INÍCIO */}
                  <FormField
                    control={control}
                    name={`${name}.${index}.startTime`}
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className="relative">
                          <Input
                            type="time"
                            className="pl-8"
                            {...field}
                          />
                          <Clock className='absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                        </div>
                        <FormMessage className="mt-1" />
                      </FormItem>
                    )}
                  />

                  {/* HORA DE FIM */}
                  <FormField
                    control={control}
                    name={`${name}.${index}.endTime`}
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className="relative">
                          <Input
                            type="time"
                            className="pl-8"
                            {...field}
                          />
                          <Clock className='absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                        </div>
                        <FormMessage className="mt-1" />
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">Dia de folga</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { WorkingHoursInput };
