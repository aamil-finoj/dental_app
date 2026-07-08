import { addMinutes, isToday } from "date-fns";
import type { Appointment } from "@/types/appointment";

// Rounds up to the next quarter-hour, after the last appointment ending today (or now).
export function getNextAvailableSlot(appointments: Appointment[]): Date {
  const now = new Date();
  const latestEndToday = appointments
    .filter((appointment) => isToday(new Date(appointment.startTime)))
    .reduce((latest, appointment) => {
      const end = new Date(appointment.endTime);
      return end > latest ? end : latest;
    }, now);

  const remainder = latestEndToday.getMinutes() % 15;
  const rounded =
    remainder === 0 ? latestEndToday : addMinutes(latestEndToday, 15 - remainder);
  rounded.setSeconds(0, 0);
  return rounded;
}
