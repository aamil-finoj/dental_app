import type { ClinicData } from "@/types/sync";

export async function fetchServerData(): Promise<ClinicData | null> {
  try {
    const res = await fetch("/api/data");
    if (!res.ok) return null;
    const { data } = (await res.json()) as { data: ClinicData | null };
    return data;
  } catch {
    return null;
  }
}

export async function pushServerData(data: ClinicData): Promise<boolean> {
  try {
    const res = await fetch("/api/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}
