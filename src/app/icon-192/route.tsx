import { ImageResponse } from "next/og";
import { renderIcon } from "@/lib/icon-content";

export function GET() {
  return new ImageResponse(renderIcon(192, false), { width: 192, height: 192 });
}
