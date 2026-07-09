"use client";

import { useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { CalendarDays, ListChecks, LogOut, Plus, Settings, Users } from "lucide-react";
import { Greeting } from "@/components/greeting";
import { ThemeToggle } from "@/components/theme-toggle";
import { DailyAgenda } from "@/components/daily-agenda";
import { CalendarView } from "@/components/calendar-view";
import { PatientDirectory } from "@/components/patient-directory";
import { AppointmentModal } from "@/components/appointment-modal";
import { PatientModal } from "@/components/patient-modal";
import { TemplateModal } from "@/components/template-modal";
import { mockAppointments } from "@/data/appointments";
import { getNextAvailableSlot } from "@/lib/next-slot";
import { derivePatients } from "@/lib/patients";
import { deriveSpecialists } from "@/lib/specialists";
import type { Appointment } from "@/types/appointment";
import type { PatientRecord } from "@/types/patient";
import { DEFAULT_TEMPLATES, type MessageTemplates } from "@/types/template";
import { cn } from "@/lib/utils";

const APPOINTMENTS_KEY = "dental-app:appointments";
const PATIENTS_KEY = "dental-app:patients";
const TEMPLATES_KEY = "dental-app:templates";

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

function loadTemplates(): MessageTemplates {
  try {
    const raw = window.localStorage.getItem(TEMPLATES_KEY);
    return raw ? (JSON.parse(raw) as MessageTemplates) : DEFAULT_TEMPLATES;
  } catch {
    return DEFAULT_TEMPLATES;
  }
}

type Tab = "agenda" | "calendar" | "patients";

const TABS: { id: Tab; label: string; icon: typeof ListChecks }[] = [
  { id: "agenda", label: "Agenda", icon: ListChecks },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "patients", label: "Patients", icon: Users },
];

export function AppShell() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>(loadAppointments);
  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>(loadPatients);
  const [tab, setTab] = useState<Tab>("agenda");
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [modalStart, setModalStart] = useState(() => new Date());
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [templates, setTemplates] = useState<MessageTemplates>(loadTemplates);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);

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

  function persistTemplates(next: MessageTemplates) {
    setTemplates(next);
    window.localStorage.setItem(TEMPLATES_KEY, JSON.stringify(next));
  }

  function updateAppointment(id: string, patch: Partial<Appointment>) {
    persistAppointments(
      appointments.map((appointment) =>
        appointment.id === id ? { ...appointment, ...patch } : appointment
      )
    );
  }

  function deleteAppointment(id: string) {
    persistAppointments(appointments.filter((appointment) => appointment.id !== id));
  }

  function openCreateModalAt(start: Date) {
    setEditingAppointment(null);
    setModalStart(start);
    setAppointmentModalOpen(true);
  }

  function openEditModal(appointment: Appointment) {
    setEditingAppointment(appointment);
    setModalStart(new Date(appointment.startTime));
    setAppointmentModalOpen(true);
  }

  function handleCreateAppointment(appointment: Appointment) {
    persistAppointments([...appointments, appointment]);
  }

  function handleUpdateAppointment(appointment: Appointment) {
    updateAppointment(appointment.id, appointment);
  }

  function handleCreatePatient(patient: PatientRecord) {
    persistPatients([...patientRecords, patient]);
  }

  function handleAddClick() {
    if (tab === "patients") {
      setPatientModalOpen(true);
    } else {
      openCreateModalAt(getNextAvailableSlot(appointments));
    }
  }

  const firstName = session?.user?.name?.split(" ")[0];
  const doctorName = firstName ?? "the doctor";

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 pb-24 pt-6 sm:max-w-3xl">
      <header className="flex items-start justify-between">
        <Greeting name={firstName} />
        <div className="flex items-center gap-2">
          {session?.user?.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt={session.user.name ?? "Profile"}
              referrerPolicy="no-referrer"
              className="size-9 rounded-full border border-border"
            />
          )}
          <button
            type="button"
            onClick={() => setTemplateModalOpen(true)}
            aria-label="Edit message templates"
            className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-background"
          >
            <Settings className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            aria-label="Sign out"
            className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-background"
          >
            <LogOut className="size-4" />
          </button>
          <ThemeToggle />
        </div>
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

      {tab === "agenda" && (
        <DailyAgenda
          appointments={appointments}
          templates={templates}
          doctorName={doctorName}
          onEdit={openEditModal}
          onSaveNotes={(id, notes) => updateAppointment(id, { notes: notes || undefined })}
          onSaveVoiceNote={(id, dataUrl) => updateAppointment(id, { voiceNoteUrl: dataUrl })}
          onMarkReminderSent={(id, type) =>
            updateAppointment(
              id,
              type === "patient"
                ? { patientReminderSent: true }
                : { specialistReminderSent: true }
            )
          }
        />
      )}
      {tab === "calendar" && (
        <CalendarView
          appointments={appointments}
          onSelectSlot={openCreateModalAt}
          onSelectEvent={openEditModal}
        />
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
        key={editingAppointment ? `edit-${editingAppointment.id}` : `create-${modalStart.toISOString()}`}
        open={appointmentModalOpen}
        onOpenChange={setAppointmentModalOpen}
        initialStart={modalStart}
        editingAppointment={editingAppointment ?? undefined}
        patients={patients}
        specialists={specialists}
        onCreate={handleCreateAppointment}
        onUpdate={handleUpdateAppointment}
        onDelete={deleteAppointment}
      />

      <PatientModal
        key={patientModalOpen ? "patient-modal-open" : "patient-modal-closed"}
        open={patientModalOpen}
        onOpenChange={setPatientModalOpen}
        onCreate={handleCreatePatient}
      />

      <TemplateModal
        key={templateModalOpen ? "template-modal-open" : "template-modal-closed"}
        open={templateModalOpen}
        onOpenChange={setTemplateModalOpen}
        templates={templates}
        onSave={persistTemplates}
      />
    </main>
  );
}
