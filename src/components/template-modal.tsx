"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DEFAULT_TEMPLATES,
  TEMPLATE_PLACEHOLDERS,
  type MessageTemplates,
} from "@/types/template";

export function TemplateModal({
  open,
  onOpenChange,
  templates,
  onSave,
  onClearData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: MessageTemplates;
  onSave: (templates: MessageTemplates) => void;
  onClearData: () => void;
}) {
  const [patientTemplate, setPatientTemplate] = useState(templates.patientTemplate);
  const [specialistTemplate, setSpecialistTemplate] = useState(
    templates.specialistTemplate
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ patientTemplate, specialistTemplate });
    onOpenChange(false);
  }

  function handleReset() {
    setPatientTemplate(DEFAULT_TEMPLATES.patientTemplate);
    setSpecialistTemplate(DEFAULT_TEMPLATES.specialistTemplate);
  }

  function handleClearData() {
    if (
      !window.confirm(
        "Delete all appointments and patients? This can't be undone, and clears data on every signed-in device."
      )
    ) {
      return;
    }
    onClearData();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize the WhatsApp reminder messages sent to patients and
            specialists.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-foreground">Patient reminder</span>
            <textarea
              required
              rows={3}
              value={patientTemplate}
              onChange={(e) => setPatientTemplate(e.target.value)}
              className="resize-none rounded-lg border border-border bg-background p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-foreground">Specialist reminder</span>
            <textarea
              required
              rows={3}
              value={specialistTemplate}
              onChange={(e) => setSpecialistTemplate(e.target.value)}
              className="resize-none rounded-lg border border-border bg-background p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          </label>

          <div className="flex flex-wrap gap-1.5">
            {TEMPLATE_PLACEHOLDERS.map((placeholder) => (
              <span
                key={placeholder}
                className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:bg-sky-500/15 dark:text-sky-400"
              >
                {placeholder}
              </span>
            ))}
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-sky-500 py-2.5 text-sm font-medium text-white transition-transform active:scale-95"
          >
            Save templates
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-full border border-border py-2.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Reset to default
          </button>
        </form>

        <div className="mt-5 border-t border-border pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Danger zone
          </p>
          <button
            type="button"
            onClick={handleClearData}
            className="mt-2 w-full rounded-full border border-rose-500/40 py-2.5 text-sm font-medium text-rose-500 transition-transform active:scale-95"
          >
            Clear all appointments &amp; patients
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
