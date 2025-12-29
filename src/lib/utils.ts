import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// [NOVA FUNÇÃO] Lógica de negócio pura, isolada e testável
export function truncateLabel(label: string, isMobile: boolean, totalItems: number = 0): string {
  // Regra 1: Mobile corta sempre curto
  if (isMobile) {
    return label.length > 6 ? label.substring(0, 6) + '..' : label;
  }

  // Regra 2: PC com muitos itens (>10) corta médio
  if (totalItems > 10) {
    return label.length > 12 ? label.substring(0, 12) + '..' : label;
  }

  // Regra 3: PC com poucos itens mostra quase tudo
  return label.length > 30 ? label.substring(0, 30) + '..' : label;
}