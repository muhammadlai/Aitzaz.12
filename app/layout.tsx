import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Earning Robot",
  description: "Earning Robot cyber command center",
  manifest: "/Aitzaz.12/manifest.webmanifest",
  icons: {
    icon: "/Aitzaz.12/icon.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#020604",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}