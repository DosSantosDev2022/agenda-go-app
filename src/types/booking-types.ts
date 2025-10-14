// types/agenda-types.ts

// --- Tipos para Serviços (Do get-services.ts) ---
export interface ServiceListItem {
  id: string;
  name: string;
  durationInMinutes: number;
  price: number;
}

// --- Tipos para Horário de Funcionamento (Do get-business-hours.ts) ---
export interface DayWorkingHours {
  dayOfWeek: number; // 0=Dom, 6=Sáb
  startTime: string; // Ex: "09:00"
  endTime: string; // Ex: "18:00"
}

export interface BusinessHours {
  workingHours: DayWorkingHours[];
  slotDurationInMinutes: number;
}

// --- NOVO TIPO UNIFICADO (Para o hook de disponibilidade diária) ---
export interface DailyAvailability {
  // Horário de Funcionamento (Simplificado para o dia)
  startTime: string | null;
  endTime: string | null;
  slotDurationInMinutes: number;

  // Slots Ocupados (Para o filtro do frontend)
  occupiedSlots: string[]; // Horários formatados "HH:MM"
}
