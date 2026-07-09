import type { Appointment } from "@/types/appointment";
import type { PatientRecord } from "@/types/patient";
import type { MessageTemplates } from "@/types/template";

export interface ClinicData {
  appointments: Appointment[];
  patientRecords: PatientRecord[];
  templates: MessageTemplates;
}
