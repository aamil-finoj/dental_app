"use client";

import { useRef, useState } from "react";
import { format } from "date-fns";
import { MessageCircle, Mic, Pencil, Square } from "lucide-react";
import type { Appointment } from "@/types/appointment";
import { PROCEDURE_COLORS } from "@/types/appointment";
import type { MessageTemplates } from "@/types/template";
import { renderTemplate } from "@/lib/render-template";
import { cn } from "@/lib/utils";

function digitsOnly(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

function buildWaLink(phone: string, message: string) {
  return `https://wa.me/${digitsOnly(phone)}?text=${encodeURIComponent(message)}`;
}

export function AppointmentCard({
  appointment,
  templates,
  doctorName,
  onEdit,
  onSaveNotes,
  onSaveVoiceNote,
  onMarkReminderSent,
}: {
  appointment: Appointment;
  templates: MessageTemplates;
  doctorName: string;
  onEdit: (appointment: Appointment) => void;
  onSaveNotes: (id: string, notes: string) => void;
  onSaveVoiceNote: (id: string, dataUrl: string) => void;
  onMarkReminderSent: (id: string, type: "patient" | "specialist") => void;
}) {
  const [notesOpen, setNotesOpen] = useState(false);
  const [note, setNote] = useState(appointment.notes ?? "");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const colors = PROCEDURE_COLORS[appointment.procedureType];
  const start = new Date(appointment.startTime);
  const end = new Date(appointment.endTime);
  const timeLabel = `${format(start, "h:mm a")} – ${format(end, "h:mm a")}`;
  const startLabel = format(start, "h:mm a");

  const hasSpecialistReminder = Boolean(appointment.specialistPhone);
  const reminderStatus = hasSpecialistReminder
    ? appointment.patientReminderSent && appointment.specialistReminderSent
      ? "sent"
      : appointment.patientReminderSent || appointment.specialistReminderSent
        ? "partial"
        : "none"
    : appointment.patientReminderSent
      ? "sent"
      : "none";
  const reminderStatusLabel =
    reminderStatus === "sent"
      ? "All reminders sent"
      : reminderStatus === "partial"
        ? "One of two reminders sent"
        : "No reminders sent yet";
  const reminderStatusColor =
    reminderStatus === "sent"
      ? "bg-emerald-500"
      : reminderStatus === "partial"
        ? "bg-amber-500"
        : "bg-rose-500";

  const patientMessage = renderTemplate(templates.patientTemplate, {
    patientName: appointment.patientName,
    procedureType: appointment.procedureType,
    time: startLabel,
    specialistName: appointment.specialistName ?? "",
    doctorName,
  });
  const specialistMessage = appointment.specialistName
    ? renderTemplate(templates.specialistTemplate, {
        patientName: appointment.patientName,
        procedureType: appointment.procedureType,
        time: startLabel,
        specialistName: appointment.specialistName,
        doctorName,
      })
    : "";

  async function toggleRecording() {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            onSaveVoiceNote(appointment.id, reader.result);
          }
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      window.alert("Microphone access is unavailable or was denied.");
    }
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 border-l-4 shadow-sm",
        colors.border
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <span
            title={reminderStatusLabel}
            aria-label={reminderStatusLabel}
            className={cn("mt-1.5 size-2.5 shrink-0 rounded-full", reminderStatusColor)}
          />
          <div>
            <p className="font-semibold text-foreground">{appointment.patientName}</p>
            <p className="text-sm text-muted">{timeLabel}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium",
              colors.badge
            )}
          >
            {appointment.procedureType}
          </span>
          <button
            type="button"
            onClick={() => onEdit(appointment)}
            aria-label="Edit appointment"
            className="flex size-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-background hover:text-foreground"
          >
            <Pencil className="size-3.5" />
          </button>
        </div>
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
          onClick={() => onMarkReminderSent(appointment.id, "patient")}
          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white transition-transform active:scale-95"
        >
          <MessageCircle className="size-3.5" />
          Patient Reminder
        </a>

        <button
          type="button"
          onClick={() => setNotesOpen((open) => !open)}
          className="text-xs font-medium text-muted transition-colors hover:text-foreground"
        >
          Notes
        </button>

        {appointment.specialistPhone && (
          <a
            href={buildWaLink(appointment.specialistPhone, specialistMessage)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onMarkReminderSent(appointment.id, "specialist")}
            aria-label="Send specialist reminder via WhatsApp"
            className="ml-auto inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-emerald-500 text-emerald-600 transition-transform active:scale-95 dark:text-emerald-400"
          >
            <MessageCircle className="size-3.5" />
          </a>
        )}

        <button
          type="button"
          onClick={toggleRecording}
          aria-pressed={isRecording}
          aria-label={isRecording ? "Stop recording voice note" : "Record voice note"}
          className={cn(
            "inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border transition-colors",
            !appointment.specialistPhone && "ml-auto",
            isRecording
              ? "animate-pulse border-rose-500 bg-rose-500 text-white"
              : "bg-background text-foreground"
          )}
        >
          {isRecording ? <Square className="size-3.5" /> : <Mic className="size-4" />}
        </button>
      </div>

      {appointment.voiceNoteUrl && (
        <audio controls src={appointment.voiceNoteUrl} className="mt-3 h-9 w-full" />
      )}

      {notesOpen && (
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => onSaveNotes(appointment.id, note)}
          placeholder="Clinical notes..."
          rows={2}
          className="mt-3 w-full resize-none rounded-lg border border-border bg-background p-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-500/40"
        />
      )}
    </div>
  );
}
