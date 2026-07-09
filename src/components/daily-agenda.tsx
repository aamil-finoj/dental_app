"use client";

import { useMemo } from "react";
import { isToday } from "date-fns";
import type { Appointment } from "@/types/appointment";
import type { MessageTemplates } from "@/types/template";
import { AppointmentCard } from "@/components/appointment-card";

export function DailyAgenda({
  appointments,
  templates,
  doctorName,
  onEdit,
  onSaveNotes,
  onSaveVoiceNote,
  onMarkReminderSent,
}: {
  appointments: Appointment[];
  templates: MessageTemplates;
  doctorName: string;
  onEdit: (appointment: Appointment) => void;
  onSaveNotes: (id: string, notes: string) => void;
  onSaveVoiceNote: (id: string, dataUrl: string) => void;
  onMarkReminderSent: (id: string, type: "patient" | "specialist") => void;
}) {
  const todaysAppointments = useMemo(() => {
    return appointments
      .filter((appointment) => isToday(new Date(appointment.startTime)))
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
  }, [appointments]);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Today&apos;s Agenda</h2>
        <span className="text-sm text-muted">
          {todaysAppointments.length} appointment
          {todaysAppointments.length === 1 ? "" : "s"}
        </span>
      </div>

      {todaysAppointments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">
          No appointments scheduled for today.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {todaysAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              templates={templates}
              doctorName={doctorName}
              onEdit={onEdit}
              onSaveNotes={onSaveNotes}
              onSaveVoiceNote={onSaveVoiceNote}
              onMarkReminderSent={onMarkReminderSent}
            />
          ))}
        </div>
      )}
    </section>
  );
}
