import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely serializes data to a JSON string for use in inline script tags (e.g. JSON-LD).
 * Escapes characters that can cause script execution vulnerabilities or syntax errors when rendered inline in HTML:
 * - `<` as `\u003c` (prevents </script> breakout)
 * - `>` as `\u003e`
 * - `&` as `\u0026`
 * - `\u2028` as `\u2028`
 * - `\u2029` as `\u2029`
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
