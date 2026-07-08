import type { Appointment, ProcedureType } from "@/types/appointment";
import type { PatientRecord } from "@/types/patient";

export interface Patient {
  id: string;
  name: string;
  phone: string;
  treatmentType?: ProcedureType;
  notes?: string;
  appointments: Appointment[];
}

export function derivePatients(
  patientRecords: PatientRecord[],
  appointments: Appointment[]
): Patient[] {
  const byPhone = new Map<string, Patient>();

  for (const record of patientRecords) {
    byPhone.set(record.phone, {
      id: record.id,
      name: record.name,
      phone: record.phone,
      treatmentType: record.treatmentType,
      notes: record.notes,
      appointments: [],
    });
  }

  for (const appointment of appointments) {
    const existing = byPhone.get(appointment.patientPhone);
    if (existing) {
      existing.appointments.push(appointment);
    } else {
      byPhone.set(appointment.patientPhone, {
        id: appointment.patientPhone,
        name: appointment.patientName,
        phone: appointment.patientPhone,
        appointments: [appointment],
      });
    }
  }

  return Array.from(byPhone.values())
    .map((patient) => ({
      ...patient,
      appointments: [...patient.appointments].sort(
        (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      ),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
