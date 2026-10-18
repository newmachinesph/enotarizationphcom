import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "2026-08-06" -> "6 August 2026". Dates on this site are always explicit. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${d} ${months[m - 1]} ${y}`;
}

/** Peso formatting for the cost estimator. Ranges, never false precision. */
export function peso(value: number): string {
  return `₱${value.toLocaleString("en-PH")}`;
}

export function pesoRange(low: number, high: number): string {
  return low === high ? peso(low) : `${peso(low)}–${peso(high)}`;
}
