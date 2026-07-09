export const PROCEDURE_TYPES = [
  "Checkup",
  "Cleaning",
  "Filling",
  "Root Canal",
  "Extraction",
  "Surgery",
  "Consultation",
  "Orthodontics",
] as const;

export type ProcedureType = (typeof PROCEDURE_TYPES)[number];

// Tailwind classes for the left border + accent chip per procedure type.
export const PROCEDURE_COLORS: Record<
  ProcedureType,
  { border: string; badge: string }
> = {
  Checkup: {
    border: "border-l-sky-500",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
  },
  Cleaning: {
    border: "border-l-emerald-500",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  Filling: {
    border: "border-l-teal-500",
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",
  },
  "Root Canal": {
    border: "border-l-purple-500",
    badge:
      "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
  },
  Extraction: {
    border: "border-l-orange-500",
    badge:
      "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  },
  Surgery: {
    border: "border-l-rose-500",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
  },
  Consultation: {
    border: "border-l-amber-500",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },
  Orthodontics: {
    border: "border-l-indigo-500",
    badge:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400",
  },
};

// Solid hex colors for the same palette, used where Tailwind classes can't
// reach (inline styles for react-big-calendar events).
export const PROCEDURE_HEX: Record<ProcedureType, string> = {
  Checkup: "#0ea5e9",
  Cleaning: "#10b981",
  Filling: "#14b8a6",
  "Root Canal": "#a855f7",
  Extraction: "#f97316",
  Surgery: "#f43f5e",
  Consultation: "#f59e0b",
  Orthodontics: "#6366f1",
};

// Smart default duration (minutes) applied when creating an appointment.
export const PROCEDURE_DEFAULT_DURATION: Record<ProcedureType, number> = {
  Checkup: 15,
  Cleaning: 30,
  Filling: 30,
  "Root Canal": 60,
  Extraction: 45,
  Surgery: 60,
  Consultation: 20,
  Orthodontics: 20,
};

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  procedureType: ProcedureType;
  specialistName?: string;
  specialistPhone?: string;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  notes?: string;
  voiceNoteUrl?: string; // base64 data URL of a recorded clinical voice note
  patientReminderSent?: boolean;
  specialistReminderSent?: boolean;
}
