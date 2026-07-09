"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  type SlotInfo,
  type View,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { Appointment } from "@/types/appointment";
import { PROCEDURE_HEX } from "@/types/appointment";
import { useMediaQuery } from "@/lib/use-media-query";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { "en-US": enUS },
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Appointment;
}

const DESKTOP_VIEWS: View[] = ["month", "week", "day"];
const MOBILE_VIEWS: View[] = ["day", "agenda"];

const CLINIC_OPEN_HOUR = 9;
const CLINIC_CLOSE_HOUR = 19;

function slotPropGetter(date: Date) {
  const hour = date.getHours();
  const isClinicHours = hour >= CLINIC_OPEN_HOUR && hour < CLINIC_CLOSE_HOUR;
  return {
    className: isClinicHours ? "rbc-slot-clinic-hours" : "rbc-slot-off-hours",
  };
}

export function CalendarView({
  appointments,
  onSelectSlot,
  onSelectEvent,
}: {
  appointments: Appointment[];
  onSelectSlot: (start: Date) => void;
  onSelectEvent: (appointment: Appointment) => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const allowedViews = isDesktop ? DESKTOP_VIEWS : MOBILE_VIEWS;

  const [view, setView] = useState<View>(isDesktop ? "week" : "day");
  const [date, setDate] = useState(() => new Date());

  const activeView = allowedViews.includes(view) ? view : allowedViews[0];

  const scrollToTime = useMemo(() => {
    const time = new Date();
    time.setHours(CLINIC_OPEN_HOUR, 0, 0, 0);
    return time;
  }, []);

  const events: CalendarEvent[] = useMemo(
    () =>
      appointments.map((appointment) => ({
        id: appointment.id,
        title: `${appointment.patientName} · ${appointment.procedureType}`,
        start: new Date(appointment.startTime),
        end: new Date(appointment.endTime),
        resource: appointment,
      })),
    [appointments]
  );

  return (
    <div className="rbc-wrapper overflow-hidden rounded-2xl border border-border bg-card">
      <Calendar
        localizer={localizer}
        events={events}
        view={activeView}
        onView={(nextView) => setView(nextView)}
        date={date}
        onNavigate={(nextDate) => setDate(nextDate)}
        views={allowedViews}
        selectable
        popup
        scrollToTime={scrollToTime}
        slotPropGetter={slotPropGetter}
        onSelectSlot={(slotInfo: SlotInfo) => onSelectSlot(slotInfo.start)}
        onSelectEvent={(event: CalendarEvent) => onSelectEvent(event.resource)}
        eventPropGetter={(event: CalendarEvent) => ({
          style: {
            backgroundColor: PROCEDURE_HEX[event.resource.procedureType],
            border: "none",
          },
        })}
        style={{ height: isDesktop ? 640 : 560 }}
      />
    </div>
  );
}
