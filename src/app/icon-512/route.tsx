import { ImageResponse } from "next/og";
import { renderIcon } from "@/lib/icon-content";

export function GET() {
  return new ImageResponse(renderIcon(512, false), { width: 512, height: 512 });
}
