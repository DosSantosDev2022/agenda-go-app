// utils/time-slots-generator.ts

/**
 * @description Converte uma string de hora (ex: "09:00") para o número total de minutos desde a meia-noite.
 * @param {string} timeString - A string de hora no formato "HH:MM".
 * @returns {number} O número total de minutos.
 */
const timeToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * @description Converte o número de minutos desde a meia-noite para uma string de hora no formato "HH:MM".
 * @param {number} totalMinutes - O número total de minutos.
 * @returns {string} A string de hora no formato "HH:MM".
 */
const minutesToTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}`;
};

/**
 * @description Gera uma lista de strings de horários ("HH:MM") com base no horário de início, fim e duração do slot.
 * @param {string} startHour - Hora de início do expediente (ex: "09:00").
 * @param {string} endHour - Hora de fim do expediente (ex: "18:00").
 * @param {number} slotDuration - Duração de cada slot em minutos (ex: 60).
 * @returns {string[]} Um array de horários disponíveis.
 */
export function generateTimeSlots(
  startHour: string,
  endHour: string,
  slotDuration: number,
): string[] {
  // ✅ slotDuration incluído
  const slots: string[] = [];

  // ⚠️ Checa se a duração é válida para evitar loops infinitos
  if (slotDuration <= 0) {
    return [];
  }

  // 1. Converte as horas para minutos
  let currentTime = timeToMinutes(startHour);
  const endTime = timeToMinutes(endHour);

  // 2. Loop para gerar os slots
  while (currentTime < endTime) {
    slots.push(minutesToTime(currentTime));
    // Adiciona a duração do slot
    currentTime += slotDuration; // ✅ Usando o slotDuration
  }

  return slots;
}
