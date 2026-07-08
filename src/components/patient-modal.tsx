"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PROCEDURE_TYPES, type ProcedureType } from "@/types/appointment";
import type { PatientRecord } from "@/types/patient";

export function PatientModal({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (patient: PatientRecord) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [treatmentType, setTreatmentType] = useState<ProcedureType | "">("");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    onCreate({
      id: crypto.randomUUID(),
      name: name.trim(),
      phone: phone.trim(),
      treatmentType: treatmentType || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    });

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Patient</DialogTitle>
          <DialogDescription>
            Register a patient before their first booking.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-foreground">Patient name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-foreground">Patient phone</span>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91"
              className="rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-foreground">Treatment type (optional)</span>
            <select
              value={treatmentType}
              onChange={(e) => setTreatmentType(e.target.value as ProcedureType | "")}
              className="rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            >
              <option value="">Not specified</option>
              {PROCEDURE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-foreground">Notes (optional)</span>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="General history, allergies, etc."
              className="resize-none rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          </label>

          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-sky-500 py-2.5 text-sm font-medium text-white transition-transform active:scale-95"
          >
            Save patient
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
