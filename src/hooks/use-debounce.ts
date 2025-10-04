// hooks/use-debounce.ts
import * as React from "react";

/**
 * @description Hook customizado que retorna um valor debounced.
 * O valor só é atualizado após o período de tempo especificado (delay)
 * desde a última vez que o valor de entrada foi alterado.
 * @param {T} value O valor de entrada.
 * @param {number} delay O tempo de atraso em milissegundos.
 * @returns {T} O valor debounced.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    // Define um timeout para atualizar o valor debounced
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timeout anterior se o valor mudar antes do delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
