import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { redis } from "@/lib/redis";
import type { ClinicData } from "@/types/sync";

function keyFor(email: string) {
  return `clinic-data:${email}`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!redis) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  const data = await redis.get<ClinicData>(keyFor(session.user.email));
  return NextResponse.json({ data: data ?? null });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!redis) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  const body = (await request.json()) as ClinicData;
  await redis.set(keyFor(session.user.email), body);
  return NextResponse.json({ ok: true });
}
