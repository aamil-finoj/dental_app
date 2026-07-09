export interface MessageTemplates {
  patientTemplate: string;
  specialistTemplate: string;
}

export const DEFAULT_TEMPLATES: MessageTemplates = {
  patientTemplate:
    "Hi {patientName}, this is a reminder for your {procedureType} appointment today at {time} with Dr. {doctorName}. See you soon!",
  specialistTemplate:
    "Hi {specialistName}, reminder for your session with {patientName} tomorrow at {time}.",
};

export const TEMPLATE_PLACEHOLDERS = [
  "{patientName}",
  "{procedureType}",
  "{time}",
  "{specialistName}",
  "{doctorName}",
] as const;
