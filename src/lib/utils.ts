import { differenceInYears } from "date-fns";

export function calculateAge(birthDate: string | Date): number {
  return differenceInYears(new Date(), new Date(birthDate));
}
