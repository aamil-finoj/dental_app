"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

function getGreeting(hour: number) {
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function Greeting({ name = "Shaini" }: { name?: string }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      {/* Server and client clocks can differ; only the displayed text may mismatch on hydration. */}
      <p
        suppressHydrationWarning
        className="text-2xl font-semibold tracking-tight text-foreground"
      >
        {getGreeting(now.getHours())}, {name}
      </p>
      <p suppressHydrationWarning className="text-sm text-muted">
        {format(now, "EEEE, MMMM d")}
      </p>
    </div>
  );
}
