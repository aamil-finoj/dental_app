import type { Appointment } from "@/types/appointment";

export interface Specialist {
  name: string;
  phone: string;
}

export function deriveSpecialists(appointments: Appointment[]): Specialist[] {
  const byPhone = new Map<string, Specialist>();

  for (const appointment of appointments) {
    if (appointment.specialistName && appointment.specialistPhone) {
      if (!byPhone.has(appointment.specialistPhone)) {
        byPhone.set(appointment.specialistPhone, {
          name: appointment.specialistName,
          phone: appointment.specialistPhone,
        });
      }
    }
  }

  return Array.from(byPhone.values()).sort((a, b) => a.name.localeCompare(b.name));
}
