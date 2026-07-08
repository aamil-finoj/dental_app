import { addDays, addMinutes, setHours, setMinutes, setSeconds } from "date-fns";
import type { Appointment } from "@/types/appointment";

function at(dayOffset: number, hour: number, minute: number) {
  const base = setSeconds(
    setMinutes(setHours(addDays(new Date(), dayOffset), hour), minute),
    0
  );
  return base;
}

function iso(date: Date) {
  return date.toISOString();
}

function makeAppointment(
  partial: Omit<Appointment, "id" | "endTime"> & { durationMinutes: number }
): Appointment {
  const { durationMinutes, ...rest } = partial;
  const start = new Date(rest.startTime);
  return {
    id: crypto.randomUUID(),
    ...rest,
    endTime: iso(addMinutes(start, durationMinutes)),
  };
}

export const mockAppointments: Appointment[] = [
  makeAppointment({
    patientName: "Aarav Mehta",
    patientPhone: "+919876543210",
    procedureType: "Checkup",
    startTime: iso(at(0, 9, 0)),
    durationMinutes: 15,
  }),
  makeAppointment({
    patientName: "Priya Nair",
    patientPhone: "+919812345678",
    procedureType: "Cleaning",
    startTime: iso(at(0, 9, 30)),
    durationMinutes: 30,
  }),
  makeAppointment({
    patientName: "Rohan Kulkarni",
    patientPhone: "+919845123456",
    procedureType: "Root Canal",
    specialistName: "Dr. Anjali Deshpande",
    specialistPhone: "+919900112233",
    startTime: iso(at(0, 11, 0)),
    durationMinutes: 60,
    notes: "Second sitting, sensitivity on lower left molar.",
  }),
  makeAppointment({
    patientName: "Simran Kaur",
    patientPhone: "+919871234567",
    procedureType: "Consultation",
    startTime: iso(at(0, 13, 30)),
    durationMinutes: 20,
  }),
  makeAppointment({
    patientName: "Vikram Singh",
    patientPhone: "+919823456781",
    procedureType: "Filling",
    startTime: iso(at(0, 15, 0)),
    durationMinutes: 30,
  }),
  makeAppointment({
    patientName: "Ananya Iyer",
    patientPhone: "+919834567890",
    procedureType: "Extraction",
    specialistName: "Dr. Karan Mehra",
    specialistPhone: "+919911223344",
    startTime: iso(at(0, 16, 30)),
    durationMinutes: 45,
    notes: "Impacted wisdom tooth, referred for oral surgery follow-up.",
  }),
  makeAppointment({
    patientName: "Ishaan Verma",
    patientPhone: "+919845678123",
    procedureType: "Surgery",
    specialistName: "Dr. Anjali Deshpande",
    specialistPhone: "+919900112233",
    startTime: iso(at(0, 18, 0)),
    durationMinutes: 60,
    notes: "Pre-op checklist confirmed, patient fasting since morning.",
  }),
  // A few appointments on other days, for the upcoming calendar view.
  makeAppointment({
    patientName: "Meera Joshi",
    patientPhone: "+919856781234",
    procedureType: "Checkup",
    startTime: iso(at(1, 10, 0)),
    durationMinutes: 15,
  }),
  makeAppointment({
    patientName: "Kabir Malhotra",
    patientPhone: "+919867891234",
    procedureType: "Surgery",
    specialistName: "Dr. Karan Mehra",
    specialistPhone: "+919911223344",
    startTime: iso(at(2, 12, 0)),
    durationMinutes: 60,
  }),
  makeAppointment({
    patientName: "Diya Kapoor",
    patientPhone: "+919878912345",
    procedureType: "Cleaning",
    startTime: iso(at(-1, 14, 0)),
    durationMinutes: 30,
  }),
];
