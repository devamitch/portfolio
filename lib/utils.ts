import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PROFILE_DATA } from "~/data/portfolio.data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getYrs = () =>
  Math.floor(
    (Date.now() - new Date(PROFILE_DATA.started).getTime()) /
      (365.25 * 24 * 60 * 60 * 1000),
  );
