"use client";

import { useMemo, useState } from "react";
import { addMinutes, format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  PROCEDURE_TYPES,
  PROCEDURE_DEFAULT_DURATION,
  type Appointment,
  type ProcedureType,
} from "@/types/appointment";
import type { Patient } from "@/lib/patients";
import type { Specialist } from "@/lib/specialists";

function toDatetimeLocalValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function AppointmentModal({
  open,
  onOpenChange,
  initialStart,
  patients,
  specialists,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialStart: Date;
  patients: Patient[];
  specialists: Specialist[];
  onCreate: (appointment: Appointment) => void;
}) {
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [procedureType, setProcedureType] = useState<ProcedureType>("Checkup");
  const [specialistName, setSpecialistName] = useState("");
  const [specialistPhone, setSpecialistPhone] = useState("");
  const [showSpecialistSuggestions, setShowSpecialistSuggestions] = useState(false);
  const [startValue, setStartValue] = useState(toDatetimeLocalValue(initialStart));
  const [duration, setDuration] = useState(PROCEDURE_DEFAULT_DURATION.Checkup);
  const [durationTouched, setDurationTouched] = useState(false);
  const [notes, setNotes] = useState("");

  const suggestions = useMemo(() => {
    const q = patientName.trim().toLowerCase();
    const list = q
      ? patients.filter(
          (patient) =>
            patient.name.toLowerCase().includes(q) || patient.phone.includes(q)
        )
      : patients;
    return list.slice(0, 8);
  }, [patients, patientName]);

  function selectPatient(patient: Patient) {
    setPatientName(patient.name);
    setPatientPhone(patient.phone);
    setShowSuggestions(false);
  }

  const specialistSuggestions = useMemo(() => {
    const q = specialistName.trim().toLowerCase();
    const list = q
      ? specialists.filter(
          (specialist) =>
            specialist.name.toLowerCase().includes(q) || specialist.phone.includes(q)
        )
      : specialists;
    return list.slice(0, 8);
  }, [specialists, specialistName]);

  function selectSpecialist(specialist: Specialist) {
    setSpecialistName(specialist.name);
    setSpecialistPhone(specialist.phone);
    setShowSpecialistSuggestions(false);
  }

  function handleProcedureChange(next: ProcedureType) {
    setProcedureType(next);
    if (!durationTouched) {
      setDuration(PROCEDURE_DEFAULT_DURATION[next]);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim() || !startValue) return;

    const start = new Date(startValue);
    const end = addMinutes(start, duration);

    onCreate({
      id: crypto.randomUUID(),
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      procedureType,
      specialistName: specialistName.trim() || undefined,
      specialistPhone: specialistPhone.trim() || undefined,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      notes: notes.trim() || undefined,
    });

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Appointment</DialogTitle>
          <DialogDescription>
            {format(initialStart, "EEEE, MMMM d · h:mm a")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative flex flex-col gap-1 text-sm">
            <label htmlFor="patientName" className="text-foreground">
              Patient name
            </label>
            <input
              id="patientName"
              required
              autoComplete="off"
              value={patientName}
              onChange={(e) => {
                setPatientName(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
              placeholder="Jane Doe"
              className="rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 top-full z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
                {suggestions.map((patient) => (
                  <button
                    key={patient.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectPatient(patient)}
                    className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left hover:bg-background"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {patient.name}
                    </span>
                    <span className="text-xs text-muted">{patient.phone}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-foreground">Patient phone</span>
            <input
              required
              type="tel"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              placeholder="+91"
              className="rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-foreground">Procedure type</span>
            <select
              value={procedureType}
              onChange={(e) => handleProcedureChange(e.target.value as ProcedureType)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            >
              {PROCEDURE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-foreground">Start time</span>
              <input
                required
                type="datetime-local"
                value={startValue}
                onChange={(e) => setStartValue(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className="text-foreground">Duration (min)</span>
              <input
                required
                type="number"
                min={5}
                step={5}
                value={duration}
                onChange={(e) => {
                  setDurationTouched(true);
                  setDuration(Number(e.target.value));
                }}
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative flex flex-col gap-1 text-sm">
              <label htmlFor="specialistName" className="text-foreground">
                Specialist name (optional)
              </label>
              <input
                id="specialistName"
                autoComplete="off"
                value={specialistName}
                onChange={(e) => {
                  setSpecialistName(e.target.value);
                  setShowSpecialistSuggestions(true);
                }}
                onFocus={() => setShowSpecialistSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowSpecialistSuggestions(false), 120)
                }
                placeholder="Dr. ..."
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
              {showSpecialistSuggestions && specialistSuggestions.length > 0 && (
                <div className="absolute left-0 top-full z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
                  {specialistSuggestions.map((specialist) => (
                    <button
                      key={specialist.phone}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectSpecialist(specialist)}
                      className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left hover:bg-background"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {specialist.name}
                      </span>
                      <span className="text-xs text-muted">{specialist.phone}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <label className="flex flex-col gap-1 text-sm">
              <span className="text-foreground">Specialist phone (optional)</span>
              <input
                type="tel"
                value={specialistPhone}
                onChange={(e) => setSpecialistPhone(e.target.value)}
                placeholder="+91 ..."
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-foreground">Notes (optional)</span>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Clinical notes..."
              className="resize-none rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          </label>

          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-sky-500 py-2.5 text-sm font-medium text-white transition-transform active:scale-95"
          >
            Save appointment
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
