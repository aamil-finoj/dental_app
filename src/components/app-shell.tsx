"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ListChecks, Plus, Users } from "lucide-react";
import { Greeting } from "@/components/greeting";
import { ThemeToggle } from "@/components/theme-toggle";
import { DailyAgenda } from "@/components/daily-agenda";
import { CalendarView } from "@/components/calendar-view";
import { PatientDirectory } from "@/components/patient-directory";
import { AppointmentModal } from "@/components/appointment-modal";
import { PatientModal } from "@/components/patient-modal";
import { mockAppointments } from "@/data/appointments";
import { getNextAvailableSlot } from "@/lib/next-slot";
import { derivePatients } from "@/lib/patients";
import { deriveSpecialists } from "@/lib/specialists";
import type { Appointment } from "@/types/appointment";
import type { PatientRecord } from "@/types/patient";
import { cn } from "@/lib/utils";

const APPOINTMENTS_KEY = "dental-app:appointments";
const PATIENTS_KEY = "dental-app:patients";

function loadAppointments(): Appointment[] {
  try {
    const raw = window.localStorage.getItem(APPOINTMENTS_KEY);
    return raw ? (JSON.parse(raw) as Appointment[]) : mockAppointments;
  } catch {
    return mockAppointments;
  }
}

function loadPatients(): PatientRecord[] {
  try {
    const raw = window.localStorage.getItem(PATIENTS_KEY);
    return raw ? (JSON.parse(raw) as PatientRecord[]) : [];
  } catch {
    return [];
  }
}

type Tab = "agenda" | "calendar" | "patients";

const TABS: { id: Tab; label: string; icon: typeof ListChecks }[] = [
  { id: "agenda", label: "Agenda", icon: ListChecks },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "patients", label: "Patients", icon: Users },
];

export function AppShell() {
  const [appointments, setAppointments] = useState<Appointment[]>(loadAppointments);
  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>(loadPatients);
  const [tab, setTab] = useState<Tab>("agenda");
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [modalStart, setModalStart] = useState(() => new Date());

  const patients = useMemo(
    () => derivePatients(patientRecords, appointments),
    [patientRecords, appointments]
  );

  const specialists = useMemo(() => deriveSpecialists(appointments), [appointments]);

  function persistAppointments(next: Appointment[]) {
    setAppointments(next);
    window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(next));
  }

  function persistPatients(next: PatientRecord[]) {
    setPatientRecords(next);
    window.localStorage.setItem(PATIENTS_KEY, JSON.stringify(next));
  }

  function openAppointmentModalAt(start: Date) {
    setModalStart(start);
    setAppointmentModalOpen(true);
  }

  function handleCreateAppointment(appointment: Appointment) {
    persistAppointments([...appointments, appointment]);
  }

  function handleCreatePatient(patient: PatientRecord) {
    persistPatients([...patientRecords, patient]);
  }

  function handleAddClick() {
    if (tab === "patients") {
      setPatientModalOpen(true);
    } else {
      openAppointmentModalAt(getNextAvailableSlot(appointments));
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 pb-24 pt-6 sm:max-w-3xl">
      <header className="flex items-start justify-between">
        <Greeting />
        <ThemeToggle />
      </header>

      <div className="inline-flex w-fit gap-1 rounded-full border border-border bg-card p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              tab === id
                ? "bg-sky-500 text-white"
                : "text-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "agenda" && <DailyAgenda appointments={appointments} />}
      {tab === "calendar" && (
        <CalendarView appointments={appointments} onSelectSlot={openAppointmentModalAt} />
      )}
      {tab === "patients" && <PatientDirectory patients={patients} />}

      <button
        type="button"
        onClick={handleAddClick}
        aria-label={tab === "patients" ? "Add patient" : "Add appointment"}
        className="fixed bottom-6 right-6 flex size-14 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg transition-transform active:scale-95"
      >
        <Plus className="size-6" />
      </button>

      <AppointmentModal
        key={modalStart.toISOString()}
        open={appointmentModalOpen}
        onOpenChange={setAppointmentModalOpen}
        initialStart={modalStart}
        patients={patients}
        specialists={specialists}
        onCreate={handleCreateAppointment}
      />

      <PatientModal
        key={patientModalOpen ? "patient-modal-open" : "patient-modal-closed"}
        open={patientModalOpen}
        onOpenChange={setPatientModalOpen}
        onCreate={handleCreatePatient}
      />
    </main>
  );
}
