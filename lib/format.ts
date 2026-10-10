import { BENGALI_DAYS, BENGALI_MONTHS, UNIT_LABELS } from "./constants";
import type { ChangeDirection, Product } from "./types";

export function bnNumber(value: number | string, maximumFractionDigits = 0) {
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(Number(value));
  return formatted.replace(/[0-9]/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);
}

export function price(value: number) {
  return `${bnNumber(value)} টাকা`;
}

export function unitLabel(unit: string) {
  return UNIT_LABELS[unit] ?? `প্রতি ${unit}`;
}

export function changeLabel(direction: ChangeDirection, percentage: number) {
  const prefix = direction === "up" ? "▲" : direction === "down" ? "▼" : "—";
  return `${prefix} ${bnNumber(Math.abs(percentage), 1)}%`;
}

export function dateInBangla(date = new Date()) {
  return `${BENGALI_DAYS[date.getDay()]}, ${bnNumber(date.getDate())} ${BENGALI_MONTHS[date.getMonth()]} ${bnNumber(date.getFullYear())}`;
}

export function productAverage(product: Product) {
  const total = product.markets.reduce((sum, market) => sum + (market.min + market.max) / 2, 0);
  return product.markets.length ? Math.round(total / product.markets.length) : product.today;
}

export function productMin(product: Product) {
  return Math.min(...product.markets.map((market) => market.min), product.today);
}

export function productMax(product: Product) {
  return Math.max(...product.markets.map((market) => market.max), product.today);
}
