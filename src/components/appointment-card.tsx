"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MessageCircle, Mic, Phone } from "lucide-react";
import type { Appointment } from "@/types/appointment";
import { PROCEDURE_COLORS } from "@/types/appointment";
import { cn } from "@/lib/utils";

function digitsOnly(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

function buildWaLink(phone: string, message: string) {
  return `https://wa.me/${digitsOnly(phone)}?text=${encodeURIComponent(message)}`;
}

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const [notesOpen, setNotesOpen] = useState(false);
  const [note, setNote] = useState(appointment.notes ?? "");
  const [recording, setRecording] = useState(false);

  const colors = PROCEDURE_COLORS[appointment.procedureType];
  const start = new Date(appointment.startTime);
  const end = new Date(appointment.endTime);
  const timeLabel = `${format(start, "h:mm a")} – ${format(end, "h:mm a")}`;
  const startLabel = format(start, "h:mm a");

  const patientMessage = `Hi ${appointment.patientName}, this is a reminder for your ${appointment.procedureType} appointment today at ${startLabel} with Dr. Shaini. See you soon!`;
  const specialistMessage = appointment.specialistName
    ? `Hi Dr. ${appointment.specialistName.replace(/^Dr\.?\s*/i, "")}, reminder for your session with ${appointment.patientName} tomorrow at ${startLabel}.`
    : "";

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 border-l-4 shadow-sm",
        colors.border
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">{appointment.patientName}</p>
          <p className="text-sm text-muted">{timeLabel}</p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
            colors.badge
          )}
        >
          {appointment.procedureType}
        </span>
      </div>

      {appointment.specialistName && (
        <p className="mt-2 text-xs text-muted">
          With specialist:{" "}
          <span className="font-medium text-foreground">
            {appointment.specialistName}
          </span>
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a
          href={buildWaLink(appointment.patientPhone, patientMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white transition-transform active:scale-95"
        >
          <MessageCircle className="size-3.5" />
          Patient Reminder
        </a>

        {appointment.specialistPhone && (
          <a
            href={buildWaLink(appointment.specialistPhone, specialistMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500 px-3 py-1.5 text-xs font-medium text-emerald-600 transition-transform active:scale-95 dark:text-emerald-400"
          >
            <Phone className="size-3.5" />
            Specialist Reminder
          </a>
        )}

        <button
          type="button"
          onClick={() => {
            setRecording((r) => !r);
            setNotesOpen(true);
          }}
          aria-pressed={recording}
          aria-label="Record voice note"
          className={cn(
            "ml-auto inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border transition-colors",
            recording
              ? "animate-pulse border-rose-500 bg-rose-500 text-white"
              : "bg-background text-foreground"
          )}
        >
          <Mic className="size-4" />
        </button>
      </div>

      {notesOpen && (
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Clinical notes..."
          rows={2}
          className="mt-3 w-full resize-none rounded-lg border border-border bg-background p-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-500/40"
        />
      )}
    </div>
  );
}
