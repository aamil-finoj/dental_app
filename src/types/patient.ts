import type { ProcedureType } from "@/types/appointment";

export interface PatientRecord {
  id: string;
  name: string;
  phone: string;
  treatmentType?: ProcedureType;
  notes?: string;
  createdAt: string; // ISO 8601
}
