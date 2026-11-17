import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely serializes data to a JSON string suitable for inclusion inside an
 * inline `<script type="application/ld+json">` tag.
 *
 * Escapes `<`, `>`, `&`, `\u2028`, and `\u2029` to prevent HTML script breakout,
 * XSS vulnerabilities, and JavaScript syntax errors caused by line terminators in string literals.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
