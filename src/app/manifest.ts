import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Clinic Assistant",
    short_name: "Clinic Assistant",
    description: "Appointments, patient histories, and reminders for the clinic.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#0ea5e9",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png" },
      { src: "/icon-512", sizes: "512x512", type: "image/png" },
    ],
  };
}
