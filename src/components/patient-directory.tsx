"use client";

import { useMemo, useState } from "react";
import { format, isFuture } from "date-fns";
import { Search, ChevronDown } from "lucide-react";
import { PROCEDURE_COLORS } from "@/types/appointment";
import type { Patient } from "@/lib/patients";
import { cn } from "@/lib/utils";

export function PatientDirectory({ patients }: { patients: Patient[] }) {
  const [query, setQuery] = useState("");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(q) || patient.phone.includes(q)
    );
  }, [patients, query]);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Patients</h2>
        <span className="text-sm text-muted">
          {patients.length} patient{patients.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or phone..."
          className="w-full rounded-full border border-border bg-card py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sky-500/40"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">
          No patients match &quot;{query}&quot;.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((patient) => {
            const isOpen = expandedKey === patient.id;
            const next = patient.appointments.find((appointment) =>
              isFuture(new Date(appointment.startTime))
            );
            const treatmentColors = patient.treatmentType
              ? PROCEDURE_COLORS[patient.treatmentType]
              : null;

            return (
              <div
                key={patient.id}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <button
                  type="button"
                  onClick={() => setExpandedKey(isOpen ? null : patient.id)}
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{patient.name}</p>
                      {treatmentColors && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[11px] font-medium",
                            treatmentColors.badge
                          )}
                        >
                          {patient.treatmentType}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted">{patient.phone}</p>
                    {next && (
                      <p className="mt-1 text-xs text-sky-600 dark:text-sky-400">
                        Next: {format(new Date(next.startTime), "MMM d, h:mm a")}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs text-muted">
                      {patient.appointments.length === 0
                        ? "No visits"
                        : `${patient.appointments.length} visit${
                            patient.appointments.length === 1 ? "" : "s"
                          }`}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-4 text-muted transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                    {patient.notes && (
                      <p className="text-xs text-muted">{patient.notes}</p>
                    )}
                    {patient.appointments.length === 0 ? (
                      <p className="text-xs text-muted">
                        No visits yet — nothing booked for this patient.
                      </p>
                    ) : (
                      patient.appointments.map((appointment) => {
                        const colors = PROCEDURE_COLORS[appointment.procedureType];
                        return (
                          <div
                            key={appointment.id}
                            className={cn(
                              "rounded-xl border-l-4 bg-background p-3",
                              colors.border
                            )}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium text-foreground">
                                {appointment.procedureType}
                              </span>
                              <span className="text-xs text-muted">
                                {format(new Date(appointment.startTime), "MMM d, yyyy")}
                              </span>
                            </div>
                            {appointment.notes && (
                              <p className="mt-1.5 text-xs text-muted">
                                {appointment.notes}
                              </p>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
